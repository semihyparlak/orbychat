<?php

namespace App\Services\Integrations\Google;

use App\Models\IntegrationConnection;

/**
 * Wraps an `IntegrationConnection` of kind=google. Returns a fresh access
 * token, transparently refreshing it via the refresh_token when needed.
 */
class GoogleTokenStore
{
    public function __construct(private readonly GoogleClient $client) {}

    public function activeAccessToken(IntegrationConnection $connection): string
    {
        $creds = (array) ($connection->credentials_encrypted ?? []);
        $accessToken = (string) ($creds['access_token'] ?? '');
        $refreshToken = (string) ($creds['refresh_token'] ?? '');
        $expiresAt = $creds['expires_at'] ?? null;

        $isExpired = $expiresAt === null
            || now()->greaterThanOrEqualTo($expiresAt);

        if (! $isExpired && $accessToken !== '') {
            return $accessToken;
        }

        if ($refreshToken === '') {
            throw new GoogleException('Google access token expired and no refresh token is on file. Reconnect Google.');
        }

        $fresh = $this->client->refresh($refreshToken);

        $connection->update([
            'credentials_encrypted' => array_merge($creds, [
                'access_token' => $fresh['access_token'],
                'expires_at' => now()->addSeconds($fresh['expires_in'])->toIso8601String(),
            ]),
        ]);

        return $fresh['access_token'];
    }
}
