<?php

use App\Http\Middleware\EnsureSuperAdmin;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\RedirectSuperAdmin;
use App\Http\Middleware\RequireCurrentWorkspace;
use App\Http\Middleware\ResolveCurrentWorkspace;
use App\Http\Middleware\SetLocale;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');

        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            SetLocale::class,
            HandleInertiaRequests::class,
            ResolveCurrentWorkspace::class,
            \App\Http\Middleware\PreventInertiaCaching::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'billing/webhook',
            'billing/webhook/paypal',
            'billing/webhook/razorpay',
        ]);

        $middleware->alias([
            'workspace.resolve' => ResolveCurrentWorkspace::class,
            'workspace.require' => RequireCurrentWorkspace::class,
            'super_admin' => EnsureSuperAdmin::class,
            'redirect.super_admin' => RedirectSuperAdmin::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e, \Illuminate\Http\Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json(['message' => 'Not Found'], 404);
            }

            if (! $request->isMethod('GET')) {
                return response('Not Found', 404);
            }

            try {
                // Ensure locale is resolved
                $locale = 'en';
                $cookieLocale = $request->cookie('locale');

                if ($request->hasSession() && $request->session()->has('locale')) {
                    $locale = $request->session()->get('locale');
                } elseif ($cookieLocale && in_array($cookieLocale, ['en', 'tr'], true)) {
                    $locale = $cookieLocale;
                } else {
                    $cfCountry = $request->header('cf-ipcountry');
                    if ($cfCountry && strtoupper($cfCountry) === 'TR') {
                        $locale = 'tr';
                    } else {
                        $acceptLang = strtolower((string) $request->header('accept-language', ''));
                        $browserLocale = $request->getPreferredLanguage(['en', 'tr']);
                        if ($browserLocale === 'tr' || str_starts_with($acceptLang, 'tr') || str_contains($acceptLang, 'tr-tr')) {
                            $locale = 'tr';
                        }
                    }
                }
                app()->setLocale($locale);

                $transFile = lang_path("{$locale}.json");
                $translations = file_exists($transFile)
                    ? (json_decode(file_get_contents($transFile), true) ?? [])
                    : [];

                return \Inertia\Inertia::render('errors/404', [
                    'locale' => $locale,
                    'translations' => $translations,
                    'branding' => \App\Support\AppBranding::shared(),
                ])
                    ->toResponse($request)
                    ->setStatusCode(404);
            } catch (\Throwable) {
                return response('Not Found', 404);
            }
        });
    })->create();
