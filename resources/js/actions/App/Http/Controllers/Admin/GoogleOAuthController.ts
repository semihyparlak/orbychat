import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\GoogleOAuthController::start
 * @see app/Http/Controllers/Admin/GoogleOAuthController.php:27
 * @route '/app/oauth/google/connect'
 */
export const start = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: start.url(options),
    method: 'get',
})

start.definition = {
    methods: ["get","head"],
    url: '/app/oauth/google/connect',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GoogleOAuthController::start
 * @see app/Http/Controllers/Admin/GoogleOAuthController.php:27
 * @route '/app/oauth/google/connect'
 */
start.url = (options?: RouteQueryOptions) => {
    return start.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GoogleOAuthController::start
 * @see app/Http/Controllers/Admin/GoogleOAuthController.php:27
 * @route '/app/oauth/google/connect'
 */
start.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: start.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\GoogleOAuthController::start
 * @see app/Http/Controllers/Admin/GoogleOAuthController.php:27
 * @route '/app/oauth/google/connect'
 */
start.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: start.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\GoogleOAuthController::start
 * @see app/Http/Controllers/Admin/GoogleOAuthController.php:27
 * @route '/app/oauth/google/connect'
 */
    const startForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: start.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\GoogleOAuthController::start
 * @see app/Http/Controllers/Admin/GoogleOAuthController.php:27
 * @route '/app/oauth/google/connect'
 */
        startForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: start.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\GoogleOAuthController::start
 * @see app/Http/Controllers/Admin/GoogleOAuthController.php:27
 * @route '/app/oauth/google/connect'
 */
        startForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: start.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    start.form = startForm
/**
* @see \App\Http\Controllers\Admin\GoogleOAuthController::callback
 * @see app/Http/Controllers/Admin/GoogleOAuthController.php:58
 * @route '/app/oauth/google/callback'
 */
export const callback = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})

callback.definition = {
    methods: ["get","head"],
    url: '/app/oauth/google/callback',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\GoogleOAuthController::callback
 * @see app/Http/Controllers/Admin/GoogleOAuthController.php:58
 * @route '/app/oauth/google/callback'
 */
callback.url = (options?: RouteQueryOptions) => {
    return callback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\GoogleOAuthController::callback
 * @see app/Http/Controllers/Admin/GoogleOAuthController.php:58
 * @route '/app/oauth/google/callback'
 */
callback.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\GoogleOAuthController::callback
 * @see app/Http/Controllers/Admin/GoogleOAuthController.php:58
 * @route '/app/oauth/google/callback'
 */
callback.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: callback.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\GoogleOAuthController::callback
 * @see app/Http/Controllers/Admin/GoogleOAuthController.php:58
 * @route '/app/oauth/google/callback'
 */
    const callbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: callback.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\GoogleOAuthController::callback
 * @see app/Http/Controllers/Admin/GoogleOAuthController.php:58
 * @route '/app/oauth/google/callback'
 */
        callbackForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: callback.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\GoogleOAuthController::callback
 * @see app/Http/Controllers/Admin/GoogleOAuthController.php:58
 * @route '/app/oauth/google/callback'
 */
        callbackForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: callback.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    callback.form = callbackForm
const GoogleOAuthController = { start, callback }

export default GoogleOAuthController