<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        // `remove_branding` controls whether the visitor widget hides
        // the "Powered by OrbyChat" footer. Free shows it; every paid
        // plan hides it (standard SaaS pattern — branding-as-distribution
        // on the free tier, white-label on paid).
        foreach ([
            ['name' => 'Free', 'slug' => 'free', 'monthly_conversations' => 100, 'price_cents' => 0, 'features' => ['remove_branding' => false]],
            ['name' => 'Standard', 'slug' => 'standard', 'monthly_conversations' => 500, 'price_cents' => 4900, 'features' => ['remove_branding' => true]],
            ['name' => 'Pro', 'slug' => 'pro', 'monthly_conversations' => 3000, 'price_cents' => 24900, 'features' => ['remove_branding' => true]],
            ['name' => 'Custom', 'slug' => 'custom', 'monthly_conversations' => 0, 'price_cents' => 0, 'features' => ['remove_branding' => true]],
        ] as $row) {
            Plan::query()->updateOrCreate(
                ['slug' => $row['slug']],
                [...$row, 'is_active' => true],
            );
        }
    }
}
