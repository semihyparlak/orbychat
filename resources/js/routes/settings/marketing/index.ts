import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::index
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:61
 * @route '/settings/marketing'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/marketing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::index
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:61
 * @route '/settings/marketing'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::index
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:61
 * @route '/settings/marketing'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::index
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:61
 * @route '/settings/marketing'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::index
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:61
 * @route '/settings/marketing'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::index
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:61
 * @route '/settings/marketing'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::index
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:61
 * @route '/settings/marketing'
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
const marketing = {
    index: Object.assign(index, index),
}

export default marketing