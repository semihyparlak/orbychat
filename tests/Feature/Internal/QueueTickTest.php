<?php

use App\Models\AppSetting;

test('queue-tick rejects missing token with 503 when nothing is configured', function () {
    $s = AppSetting::singleton();
    $s->internal_queue_token = null;
    $s->save();
    AppSetting::flushSingleton();

    $this->postJson('/api/v1/internal/queue-tick')
        ->assertStatus(503)
        ->assertJsonPath('error.code', 'queue_tick_disabled');
});

test('queue-tick rejects wrong token with 401', function () {
    $s = AppSetting::singleton();
    $s->internal_queue_token = 'right-token';
    $s->save();
    AppSetting::flushSingleton();

    $this->postJson('/api/v1/internal/queue-tick', [], [
        'X-OrbyChat-Token' => 'wrong-token',
    ])->assertStatus(401);
});

test('queue-tick accepts the configured token and returns stats', function () {
    $s = AppSetting::singleton();
    $s->internal_queue_token = 'good-token';
    $s->save();
    AppSetting::flushSingleton();

    $response = $this->postJson('/api/v1/internal/queue-tick', [
        'max_jobs' => 1,
        'max_time' => 5,
    ], [
        'X-OrbyChat-Token' => 'good-token',
    ])->assertOk();

    $data = $response->json('data');
    expect($data)->toHaveKeys(['exit_code', 'stats']);
    expect($data['stats'])->toHaveKeys([
        'processed',
        'failed_in_tick',
        'remaining_pending',
        'failed_total',
        'elapsed_s',
    ]);
});

test('queue-tick uses constant-time comparison (length-mismatched tokens are 401)', function () {
    $s = AppSetting::singleton();
    $s->internal_queue_token = 'long-secret-token-that-is-quite-long';
    $s->save();
    AppSetting::flushSingleton();

    $this->postJson('/api/v1/internal/queue-tick', [], [
        'X-OrbyChat-Token' => 'short',
    ])->assertStatus(401);
});
