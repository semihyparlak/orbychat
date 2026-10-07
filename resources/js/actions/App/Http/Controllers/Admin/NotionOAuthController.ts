import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\NotionOAuthController::start
 * @see app/Http/Controllers/Admin/NotionOAuthController.php:26
 * @route '/app/oauth/notion/connect'
 */
export const start = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: start.url(options),
    method: 'get',
})

start.definition = {
    methods: ["get","head"],
    url: '/app/oauth/notion/connect',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\NotionOAuthController::start
 * @see app/Http/Controllers/Admin/NotionOAuthController.php:26
 * @route '/app/oauth/notion/connect'
 */
start.url = (options?: RouteQueryOptions) => {
    return start.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotionOAuthController::start
 * @see app/Http/Controllers/Admin/NotionOAuthController.php:26
 * @route '/app/oauth/notion/connect'
 */
start.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: start.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\NotionOAuthController::start
 * @see app/Http/Controllers/Admin/NotionOAuthController.php:26
 * @route '/app/oauth/notion/connect'
 */
start.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: start.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\NotionOAuthController::start
 * @see app/Http/Controllers/Admin/NotionOAuthController.php:26
 * @route '/app/oauth/notion/connect'
 */
    const startForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: start.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\NotionOAuthController::start
 * @see app/Http/Controllers/Admin/NotionOAuthController.php:26
 * @route '/app/oauth/notion/connect'
 */
        startForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: start.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\NotionOAuthController::start
 * @see app/Http/Controllers/Admin/NotionOAuthController.php:26
 * @route '/app/oauth/notion/connect'
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
* @see \App\Http\Controllers\Admin\NotionOAuthController::callback
 * @see app/Http/Controllers/Admin/NotionOAuthController.php:52
 * @route '/app/oauth/notion/callback'
 */
export const callback = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})

callback.definition = {
    methods: ["get","head"],
    url: '/app/oauth/notion/callback',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\NotionOAuthController::callback
 * @see app/Http/Controllers/Admin/NotionOAuthController.php:52
 * @route '/app/oauth/notion/callback'
 */
callback.url = (options?: RouteQueryOptions) => {
    return callback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotionOAuthController::callback
 * @see app/Http/Controllers/Admin/NotionOAuthController.php:52
 * @route '/app/oauth/notion/callback'
 */
callback.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: callback.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\NotionOAuthController::callback
 * @see app/Http/Controllers/Admin/NotionOAuthController.php:52
 * @route '/app/oauth/notion/callback'
 */
callback.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: callback.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\NotionOAuthController::callback
 * @see app/Http/Controllers/Admin/NotionOAuthController.php:52
 * @route '/app/oauth/notion/callback'
 */
    const callbackForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: callback.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\NotionOAuthController::callback
 * @see app/Http/Controllers/Admin/NotionOAuthController.php:52
 * @route '/app/oauth/notion/callback'
 */
        callbackForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: callback.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\NotionOAuthController::callback
 * @see app/Http/Controllers/Admin/NotionOAuthController.php:52
 * @route '/app/oauth/notion/callback'
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
const NotionOAuthController = { start, callback }

export default NotionOAuthController