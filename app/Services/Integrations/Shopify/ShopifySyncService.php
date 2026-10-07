<?php

namespace App\Services\Integrations\Shopify;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ShopifySyncService
{
    /**
     * Fetch products from Shopify using the GraphQL API.
     */
    public function fetchProducts(string $shopDomain, string $accessToken, int $limit = 50): array
    {
        $url = "https://{$shopDomain}/admin/api/2024-04/graphql.json";
        
        $query = <<<GQL
        {
          products(first: {$limit}) {
            edges {
              node {
                id
                title
                description
                handle
                onlineStoreUrl
                variants(first: 1) {
                  edges {
                    node {
                      price
                    }
                  }
                }
                featuredImage {
                  url
                }
              }
            }
          }
        }
GQL;

        try {
            $response = Http::withHeaders([
                'X-Shopify-Access-Token' => $accessToken,
                'Content-Type' => 'application/json',
            ])->post($url, ['query' => $query]);

            if ($response->failed()) {
                Log::error("Shopify API Error: " . $response->body());
                return [];
            }

            $data = $response->json();
            $products = [];

            foreach ($data['data']['products']['edges'] ?? [] as $edge) {
                $node = $edge['node'];
                $products[] = [
                    'external_id' => $node['id'],
                    'title' => $node['title'],
                    'body' => $node['description'],
                    'url' => $node['onlineStoreUrl'] ?? "https://{$shopDomain}/products/{$node['handle']}",
                    'price' => $node['variants']['edges'][0]['node']['price'] ?? null,
                    'image_url' => $node['featuredImage']['url'] ?? null,
                    'type' => 'product'
                ];
            }

            return $products;

        } catch (\Exception $e) {
            Log::error("Shopify Sync Exception: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Fetch pages from Shopify.
     */
    public function fetchPages(string $shopDomain, string $accessToken): array
    {
        // For simplicity, we use REST for pages as it's often easier for basic content
        $url = "https://{$shopDomain}/admin/api/2024-04/pages.json";

        try {
            $response = Http::withHeaders([
                'X-Shopify-Access-Token' => $accessToken,
            ])->get($url);

            if ($response->failed()) {
                return [];
            }

            $data = $response->json();
            $pages = [];

            foreach ($data['pages'] ?? [] as $page) {
                $pages[] = [
                    'external_id' => (string) $page['id'],
                    'title' => $page['title'],
                    'body' => strip_tags($page['body_html']),
                    'url' => "https://{$shopDomain}/pages/{$page['handle']}",
                    'type' => 'page'
                ];
            }

            return $pages;

        } catch (\Exception $e) {
            return [];
        }
    }
}
