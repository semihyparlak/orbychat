import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Platform\LeadController::index
 * @see app/Http/Controllers/Admin/Platform/LeadController.php:13
 * @route '/admin/leads'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/leads',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\LeadController::index
 * @see app/Http/Controllers/Admin/Platform/LeadController.php:13
 * @route '/admin/leads'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\LeadController::index
 * @see app/Http/Controllers/Admin/Platform/LeadController.php:13
 * @route '/admin/leads'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\LeadController::index
 * @see app/Http/Controllers/Admin/Platform/LeadController.php:13
 * @route '/admin/leads'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\LeadController::index
 * @see app/Http/Controllers/Admin/Platform/LeadController.php:13
 * @route '/admin/leads'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\LeadController::index
 * @see app/Http/Controllers/Admin/Platform/LeadController.php:13
 * @route '/admin/leads'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\LeadController::index
 * @see app/Http/Controllers/Admin/Platform/LeadController.php:13
 * @route '/admin/leads'
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
const leads = {
    index: Object.assign(index, index),
}

export default leads