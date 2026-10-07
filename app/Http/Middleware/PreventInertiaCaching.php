<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PreventInertiaCaching
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Ensure the browser knows the response varies by the X-Inertia header.
        // This prevents the browser from showing a cached JSON response on a direct visit.
        $response->headers->set('Vary', 'X-Inertia', false);

        // If it's an internal Inertia request (returning JSON), explicitly disable caching.
        if ($request->header('X-Inertia')) {
            $response->headers->set('Cache-Control', 'no-cache, no-store, must-revalidate');
        }

        return $response;
    }
}
