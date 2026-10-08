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
        $cookieLocale = $request->cookie('locale');

        if ($request->session()->has('locale')) {
            App::setLocale($request->session()->get('locale'));
        } elseif ($cookieLocale && in_array($cookieLocale, ['en', 'tr'], true)) {
            App::setLocale($cookieLocale);
            $request->session()->put('locale', $cookieLocale);
        } else {
            // Default to English
            $locale = 'en';

            // 1. Check Cloudflare header first (fastest & most reliable)
            $cfCountry = $request->header('cf-ipcountry');
            if ($cfCountry && strtoupper($cfCountry) === 'TR') {
                $locale = 'tr';
            } else {
                // 2. Check browser Accept-Language header
                $acceptLang = strtolower((string) $request->header('accept-language', ''));
                $browserLocale = $request->getPreferredLanguage(['en', 'tr']);
                if ($browserLocale === 'tr' || str_starts_with($acceptLang, 'tr') || str_contains($acceptLang, 'tr-tr')) {
                    $locale = 'tr';
                }
            }

            App::setLocale($locale);
            $request->session()->put('locale', $locale);
        }

        return $next($request);
    }
}
