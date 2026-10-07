import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DashboardController::show
 * @see app/Http/Controllers/Admin/DashboardController.php:28
 * @route '/dashboard'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DashboardController::show
 * @see app/Http/Controllers/Admin/DashboardController.php:28
 * @route '/dashboard'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DashboardController::show
 * @see app/Http/Controllers/Admin/DashboardController.php:28
 * @route '/dashboard'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DashboardController::show
 * @see app/Http/Controllers/Admin/DashboardController.php:28
 * @route '/dashboard'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\DashboardController::show
 * @see app/Http/Controllers/Admin/DashboardController.php:28
 * @route '/dashboard'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\DashboardController::show
 * @see app/Http/Controllers/Admin/DashboardController.php:28
 * @route '/dashboard'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\DashboardController::show
 * @see app/Http/Controllers/Admin/DashboardController.php:28
 * @route '/dashboard'
 */
        showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const DashboardController = { show }

export default DashboardController