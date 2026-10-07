<?php

namespace App\Jobs\Integrations\Shopify;

use App\Models\Document;
use App\Models\Source;
use App\Services\Integrations\Shopify\ShopifySyncService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class SyncShopifySourceJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(private readonly int $sourceId)
    {
    }

    /**
     * Execute the job.
     */
    public function handle(ShopifySyncService $shopify)
    {
        $source = Source::find($this->sourceId);
        if (!$source || $source->type !== 'shopify') {
            return;
        }

        $config = $source->config;
        $shopDomain = $config['shop_domain'] ?? null;
        $accessToken = $config['access_token'] ?? null;

        if (!$shopDomain || !$accessToken) {
            $source->update(['status' => 'failed', 'error' => 'Missing Shopify credentials']);
            return;
        }

        $source->update(['status' => 'indexing', 'error' => null]);

        try {
            $products = $shopify->fetchProducts($shopDomain, $accessToken);
            $pages = $shopify->fetchPages($shopDomain, $accessToken);
            $items = array_merge($products, $pages);

            DB::transaction(function () use ($items, $source) {
                foreach ($items as $item) {
                    Document::updateOrCreate(
                        [
                            'source_id' => $source->id,
                            'url' => $item['url']
                        ],
                        [
                            'title' => $item['title'],
                            'body' => $this->formatBody($item),
                            'fetched_at' => now(),
                            'crawler' => 'shopify_api'
                        ]
                    );
                }
            });

            $source->update(['status' => 'indexed', 'last_synced_at' => now()]);

        } catch (\Exception $e) {
            $source->update(['status' => 'failed', 'error' => $e->getMessage()]);
        }
    }

    private function formatBody(array $item): string
    {
        $body = $item['title'] . "\n\n";
        
        if ($item['type'] === 'product') {
            if (!empty($item['price'])) {
                $body .= "Price: " . $item['price'] . "\n";
            }
            if (!empty($item['url'])) {
                $body .= "Product Link: " . $item['url'] . "\n";
            }
        }
        
        $body .= "\n" . $item['body'];
        
        return $body;
    }
}
