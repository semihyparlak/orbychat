<?php

use App\Http\Controllers\Internal\QueueTickController;
use App\Http\Controllers\Widget\AvailabilityController;
use App\Http\Controllers\Widget\ConversationClearController;
use App\Http\Controllers\Widget\ConversationMessagesController;
use App\Http\Controllers\Widget\EventsController;
use App\Http\Controllers\Widget\GdprController;
use App\Http\Controllers\Widget\InitController;
use App\Http\Controllers\Widget\LeadController as WidgetLeadController;
use App\Http\Controllers\Widget\MessageController;
use App\Http\Controllers\Widget\MessageStreamController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1/widget')->group(function () {
    Route::post('init', InitController::class)
        ->middleware('throttle:widget-init')
        ->name('widget.init');
    
    Route::get('availability', [AvailabilityController::class, 'index'])->name('widget.availability');

    Route::middleware('throttle:widget-session')->group(function () {
        Route::post('messages', MessageController::class)->name('widget.messages');
        Route::post('messages/stream', MessageStreamController::class)->name('widget.messages.stream');
        Route::post('events', EventsController::class)->name('widget.events');
        Route::delete('me', [GdprController::class, 'delete'])->name('widget.gdpr.delete');
        Route::get('conversation/messages', ConversationMessagesController::class)->name('widget.conversation.messages');
        Route::post('conversation/clear', ConversationClearController::class)->name('widget.conversation.clear');
    });

    Route::post('leads', WidgetLeadController::class)
        ->middleware('throttle:widget-leads')
        ->name('widget.leads');
});

// Internal endpoint hit by an external cron (Cloudflare Workers Cron
// Trigger, GitHub Actions, cron-job.org, etc.) to drive the Laravel
// queue when cPanel cron + long-running queue:work daemons are
// unreliable. Auth via INTERNAL_QUEUE_TOKEN env.
Route::post('v1/internal/queue-tick', QueueTickController::class)
    ->name('internal.queue-tick');

Route::prefix('v1/integrations')->group(function () {
    Route::post('wordpress/sync', [\App\Http\Controllers\Api\Integration\WordPressSyncController::class, 'sync'])
        ->name('integrations.wordpress.sync');
    Route::post('wordpress/events/cart', [\App\Http\Controllers\Api\Integration\WordPressSyncController::class, 'handleCartEvent'])
        ->name('integrations.wordpress.events.cart');
    Route::post('wordpress/events/order', [\App\Http\Controllers\Api\Integration\WordPressSyncController::class, 'handleOrderEvent'])
        ->name('integrations.wordpress.events.order');
});
