<?php

namespace App\Http\Middleware;

use App\Models\AppSetting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Platform-level kill switch for the public marketing site.
 *
 * When `app_settings.marketing_site_enabled` is false (admin opt-in
 * via Settings → Branding), unauthenticated visitors hitting any
 * route this middleware is bound to are redirected to /login. Authed
 * users (super-admins or already-signed-in customers) still see the
 * page so admins can preview the marketing surfaces.
 *
 * Hot-path-safe: AppSetting::singleton() is the cached singleton,
 * one in-memory lookup per request, no DB hit per page load.
 */
class RedirectMarketingWhenDisabled
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() !== null) {
            return $next($request);
        }

        $enabled = (bool) (AppSetting::singleton()->marketing_site_enabled ?? true);
        if ($enabled) {
            return $next($request);
        }

        return redirect('/login');
    }
}
