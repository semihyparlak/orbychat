<?php

namespace App\Services\Integrations\Ikas;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IkasSyncService
{
    /**
     * Fetch products from Ikas.
     */
    public function fetchProducts(string $shopDomain, string $accessToken, int $limit = 100): array
    {
        // Ikas API endpoint: https://api.ikas.com/v1/products
        $url = "https://api.ikas.com/v1/products";

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $accessToken,
                'Content-Type' => 'application/json',
            ])->get($url, [
                'limit' => $limit,
                'status' => 'ACTIVE'
            ]);

            if ($response->failed()) {
                Log::error("Ikas API Error: " . $response->body());
                return [];
            }

            $data = $response->json();
            $products = [];

            foreach ($data['data'] ?? [] as $product) {
                $products[] = [
                    'external_id' => $product['id'],
                    'title' => $product['name'],
                    'body' => $product['description'] ?? '',
                    'url' => "https://{$shopDomain}/products/{$product['slug']}",
                    'price' => $product['variants'][0]['sellPrice'] ?? null,
                    'image_url' => $product['images'][0]['url'] ?? null,
                    'type' => 'product'
                ];
            }

            return $products;

        } catch (\Exception $e) {
            Log::error("Ikas Sync Exception: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Fetch pages from Ikas.
     */
    public function fetchPages(string $shopDomain, string $accessToken): array
    {
        $url = "https://api.ikas.com/v1/pages";

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $accessToken,
            ])->get($url);

            if ($response->failed()) {
                return [];
            }

            $data = $response->json();
            $pages = [];

            foreach ($data['data'] ?? [] as $page) {
                $pages[] = [
                    'external_id' => $page['id'],
                    'title' => $page['title'],
                    'body' => strip_tags($page['content'] ?? ''),
                    'url' => "https://{$shopDomain}/pages/{$page['slug']}",
                    'type' => 'page'
                ];
            }

            return $pages;

        } catch (\Exception $e) {
            return [];
        }
    }
}
