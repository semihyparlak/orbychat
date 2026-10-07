import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Platform\ImpersonateController::stop
 * @see app/Http/Controllers/Admin/Platform/ImpersonateController.php:60
 * @route '/impersonate/stop'
 */
export const stop = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stop.url(options),
    method: 'post',
})

stop.definition = {
    methods: ["post"],
    url: '/impersonate/stop',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\ImpersonateController::stop
 * @see app/Http/Controllers/Admin/Platform/ImpersonateController.php:60
 * @route '/impersonate/stop'
 */
stop.url = (options?: RouteQueryOptions) => {
    return stop.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\ImpersonateController::stop
 * @see app/Http/Controllers/Admin/Platform/ImpersonateController.php:60
 * @route '/impersonate/stop'
 */
stop.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stop.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\ImpersonateController::stop
 * @see app/Http/Controllers/Admin/Platform/ImpersonateController.php:60
 * @route '/impersonate/stop'
 */
    const stopForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: stop.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\ImpersonateController::stop
 * @see app/Http/Controllers/Admin/Platform/ImpersonateController.php:60
 * @route '/impersonate/stop'
 */
        stopForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: stop.url(options),
            method: 'post',
        })
    
    stop.form = stopForm
const impersonate = {
    stop: Object.assign(stop, stop),
}

export default impersonate