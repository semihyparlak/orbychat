<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Gates the platform admin area (/admin/*).
 *
 * Returns 404 (not 403) for non-admins so the existence of the area is
 * not advertised to regular customers via URL probing.
 */
class EnsureSuperAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if ($user === null || ! $user->isSuperAdmin()) {
            abort(404);
        }

        return $next($request);
    }
}
