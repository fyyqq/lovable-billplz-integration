<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Idempotency & Tracking Keys
            $table->string('reference_id')->unique()->comment('Unique internal transaction ID');
            $table->string('billplz_id')->nullable()->unique()->comment('ID returned by Billplz API');

            // Amount & Purpose Information
            $table->decimal('amount', 10, 2)->comment('Amount requested in MYR');
            $table->decimal('fixed_amount', 10, 2)->nullable()->comment('Paid amount verified from webhook');
            $table->string('purpose')->comment('e.g., Subscription Monthly Plan Pro');

            // Status & URL Redirection
            $table->enum('status', ['pending', 'paid', 'due', 'failed'])->default('pending');
            $table->text('url')->nullable()->comment('Billplz payment page URL');
            $table->timestamp('paid_at')->nullable();

            $table->json('webhook_responses')->nullable()->comment('Raw callback payload from Billplz');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
