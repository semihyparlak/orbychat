import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ConversationController::index
 * @see app/Http/Controllers/Admin/ConversationController.php:121
 * @route '/app/agents/{agent}/conversations'
 */
export const index = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/app/agents/{agent}/conversations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ConversationController::index
 * @see app/Http/Controllers/Admin/ConversationController.php:121
 * @route '/app/agents/{agent}/conversations'
 */
index.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { agent: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { agent: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    agent: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        agent: typeof args.agent === 'object'
                ? args.agent.id
                : args.agent,
                }

    return index.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ConversationController::index
 * @see app/Http/Controllers/Admin/ConversationController.php:121
 * @route '/app/agents/{agent}/conversations'
 */
index.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ConversationController::index
 * @see app/Http/Controllers/Admin/ConversationController.php:121
 * @route '/app/agents/{agent}/conversations'
 */
index.head = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ConversationController::index
 * @see app/Http/Controllers/Admin/ConversationController.php:121
 * @route '/app/agents/{agent}/conversations'
 */
    const indexForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ConversationController::index
 * @see app/Http/Controllers/Admin/ConversationController.php:121
 * @route '/app/agents/{agent}/conversations'
 */
        indexForm.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ConversationController::index
 * @see app/Http/Controllers/Admin/ConversationController.php:121
 * @route '/app/agents/{agent}/conversations'
 */
        indexForm.head = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
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