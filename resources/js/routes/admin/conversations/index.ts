import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Platform\ConversationController::index
 * @see app/Http/Controllers/Admin/Platform/ConversationController.php:13
 * @route '/admin/conversations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/conversations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\ConversationController::index
 * @see app/Http/Controllers/Admin/Platform/ConversationController.php:13
 * @route '/admin/conversations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\ConversationController::index
 * @see app/Http/Controllers/Admin/Platform/ConversationController.php:13
 * @route '/admin/conversations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\ConversationController::index
 * @see app/Http/Controllers/Admin/Platform/ConversationController.php:13
 * @route '/admin/conversations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\ConversationController::index
 * @see app/Http/Controllers/Admin/Platform/ConversationController.php:13
 * @route '/admin/conversations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\ConversationController::index
 * @see app/Http/Controllers/Admin/Platform/ConversationController.php:13
 * @route '/admin/conversations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\ConversationController::index
 * @see app/Http/Controllers/Admin/Platform/ConversationController.php:13
 * @route '/admin/conversations'
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
const conversations = {
    index: Object.assign(index, index),
}

export default conversations