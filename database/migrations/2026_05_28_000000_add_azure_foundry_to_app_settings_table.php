<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('app_settings')) {
            return;
        }

        Schema::table('app_settings', function (Blueprint $table) {
            if (! Schema::hasColumn('app_settings', 'azure_foundry_enabled')) {
                $table->boolean('azure_foundry_enabled')->default(false);
            }
            if (! Schema::hasColumn('app_settings', 'azure_foundry_endpoint')) {
                $table->text('azure_foundry_endpoint')->nullable();
            }
            if (! Schema::hasColumn('app_settings', 'azure_foundry_api_key')) {
                $table->text('azure_foundry_api_key')->nullable();
            }
            if (! Schema::hasColumn('app_settings', 'azure_foundry_deployment')) {
                $table->string('azure_foundry_deployment')->nullable();
            }
            if (! Schema::hasColumn('app_settings', 'azure_foundry_embed_model')) {
                $table->string('azure_foundry_embed_model')->nullable();
            }
            if (! Schema::hasColumn('app_settings', 'azure_foundry_api_version')) {
                $table->string('azure_foundry_api_version', 64)->nullable();
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('app_settings')) {
            return;
        }

        Schema::table('app_settings', function (Blueprint $table) {
            $columns = [
                'azure_foundry_enabled',
                'azure_foundry_endpoint',
                'azure_foundry_api_key',
                'azure_foundry_deployment',
                'azure_foundry_embed_model',
                'azure_foundry_api_version',
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('app_settings', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
