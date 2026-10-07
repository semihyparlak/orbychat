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
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            SetLocale::class,
            HandleInertiaRequests::class,
            ResolveCurrentWorkspace::class,
            AddLinkHeadersForPreloadedAssets::class,
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
            if (! $request->isMethod('GET')) {
                return null;
            }

            return \Inertia\Inertia::render('errors/404')
                ->toResponse($request)
                ->setStatusCode(404);
        });
    })->create();
