<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->session()->has('locale')) {
            App::setLocale($request->session()->get('locale'));
        } else {
            // Default to English
            $locale = 'en';

            // 1. Check Cloudflare header first (fastest & most reliable)
            $cfCountry = $request->header('cf-ipcountry');
            if ($cfCountry) {
                if (strtoupper($cfCountry) === 'TR') {
                    $locale = 'tr';
                }
            } else {
                // 2. Fallback to Browser detection if not on Cloudflare
                $browserLocale = $request->getPreferredLanguage(['en', 'tr']);
                if ($browserLocale === 'tr') {
                    $locale = 'tr';
                }

                // 3. Last resort: External IP API (only if needed)
                try {
                    $response = \Illuminate\Support\Facades\Http::timeout(1)->get('http://ip-api.com/json/' . $request->ip());
                    if ($response->successful()) {
                        $data = $response->json();
                        if (isset($data['countryCode']) && strtoupper($data['countryCode']) === 'TR') {
                            $locale = 'tr';
                        }
                    }
                } catch (\Exception $e) {
                    // Stay with current $locale
                }
            }

            App::setLocale($locale);
            $request->session()->put('locale', $locale);
        }

        return $next($request);
    }
}
