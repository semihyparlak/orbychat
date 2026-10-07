import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Platform\SubscriptionController::index
 * @see app/Http/Controllers/Admin/Platform/SubscriptionController.php:24
 * @route '/admin/subscriptions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/subscriptions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SubscriptionController::index
 * @see app/Http/Controllers/Admin/Platform/SubscriptionController.php:24
 * @route '/admin/subscriptions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SubscriptionController::index
 * @see app/Http/Controllers/Admin/Platform/SubscriptionController.php:24
 * @route '/admin/subscriptions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\SubscriptionController::index
 * @see app/Http/Controllers/Admin/Platform/SubscriptionController.php:24
 * @route '/admin/subscriptions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SubscriptionController::index
 * @see app/Http/Controllers/Admin/Platform/SubscriptionController.php:24
 * @route '/admin/subscriptions'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SubscriptionController::index
 * @see app/Http/Controllers/Admin/Platform/SubscriptionController.php:24
 * @route '/admin/subscriptions'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\SubscriptionController::index
 * @see app/Http/Controllers/Admin/Platform/SubscriptionController.php:24
 * @route '/admin/subscriptions'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const SubscriptionController = { index }

export default SubscriptionController