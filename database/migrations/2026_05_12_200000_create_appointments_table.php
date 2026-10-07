<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('workspace_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('agent_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('lead_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->dateTimeTz('appointment_at');
            $table->text('reason')->nullable();
            $table->string('status')->default('pending'); // pending, confirmed, cancelled, completed
            $table->json('metadata')->nullable();
            $table->timestampsTz();

            $table->index(['agent_id', 'appointment_at', 'status']);
            $table->index(['workspace_id', 'appointment_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
