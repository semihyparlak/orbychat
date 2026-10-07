import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\BillingController::show
 * @see app/Http/Controllers/Admin/BillingController.php:28
 * @route '/app/billing'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/app/billing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BillingController::show
 * @see app/Http/Controllers/Admin/BillingController.php:28
 * @route '/app/billing'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BillingController::show
 * @see app/Http/Controllers/Admin/BillingController.php:28
 * @route '/app/billing'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BillingController::show
 * @see app/Http/Controllers/Admin/BillingController.php:28
 * @route '/app/billing'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\BillingController::show
 * @see app/Http/Controllers/Admin/BillingController.php:28
 * @route '/app/billing'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\BillingController::show
 * @see app/Http/Controllers/Admin/BillingController.php:28
 * @route '/app/billing'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\BillingController::show
 * @see app/Http/Controllers/Admin/BillingController.php:28
 * @route '/app/billing'
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
/**
* @see \App\Http\Controllers\Admin\BillingController::portal
 * @see app/Http/Controllers/Admin/BillingController.php:96
 * @route '/billing/portal'
 */
export const portal = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: portal.url(options),
    method: 'get',
})

portal.definition = {
    methods: ["get","head"],
    url: '/billing/portal',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BillingController::portal
 * @see app/Http/Controllers/Admin/BillingController.php:96
 * @route '/billing/portal'
 */
portal.url = (options?: RouteQueryOptions) => {
    return portal.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BillingController::portal
 * @see app/Http/Controllers/Admin/BillingController.php:96
 * @route '/billing/portal'
 */
portal.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: portal.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BillingController::portal
 * @see app/Http/Controllers/Admin/BillingController.php:96
 * @route '/billing/portal'
 */
portal.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: portal.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\BillingController::portal
 * @see app/Http/Controllers/Admin/BillingController.php:96
 * @route '/billing/portal'
 */
    const portalForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: portal.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\BillingController::portal
 * @see app/Http/Controllers/Admin/BillingController.php:96
 * @route '/billing/portal'
 */
        portalForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: portal.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\BillingController::portal
 * @see app/Http/Controllers/Admin/BillingController.php:96
 * @route '/billing/portal'
 */
        portalForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: portal.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    portal.form = portalForm
const BillingController = { show, portal }

export default BillingController