import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ConversationController::workspaceIndex
 * @see app/Http/Controllers/Admin/ConversationController.php:23
 * @route '/app/conversations'
 */
export const workspaceIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: workspaceIndex.url(options),
    method: 'get',
})

workspaceIndex.definition = {
    methods: ["get","head"],
    url: '/app/conversations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ConversationController::workspaceIndex
 * @see app/Http/Controllers/Admin/ConversationController.php:23
 * @route '/app/conversations'
 */
workspaceIndex.url = (options?: RouteQueryOptions) => {
    return workspaceIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ConversationController::workspaceIndex
 * @see app/Http/Controllers/Admin/ConversationController.php:23
 * @route '/app/conversations'
 */
workspaceIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: workspaceIndex.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ConversationController::workspaceIndex
 * @see app/Http/Controllers/Admin/ConversationController.php:23
 * @route '/app/conversations'
 */
workspaceIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: workspaceIndex.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ConversationController::workspaceIndex
 * @see app/Http/Controllers/Admin/ConversationController.php:23
 * @route '/app/conversations'
 */
    const workspaceIndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: workspaceIndex.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ConversationController::workspaceIndex
 * @see app/Http/Controllers/Admin/ConversationController.php:23
 * @route '/app/conversations'
 */
        workspaceIndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: workspaceIndex.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ConversationController::workspaceIndex
 * @see app/Http/Controllers/Admin/ConversationController.php:23
 * @route '/app/conversations'
 */
        workspaceIndexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: workspaceIndex.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    workspaceIndex.form = workspaceIndexForm
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
/**
* @see \App\Http\Controllers\Admin\ConversationController::show
 * @see app/Http/Controllers/Admin/ConversationController.php:240
 * @route '/app/conversations/{conversation}'
 */
export const show = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/app/conversations/{conversation}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ConversationController::show
 * @see app/Http/Controllers/Admin/ConversationController.php:240
 * @route '/app/conversations/{conversation}'
 */
show.url = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conversation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { conversation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    conversation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conversation: typeof args.conversation === 'object'
                ? args.conversation.id
                : args.conversation,
                }

    return show.definition.url
            .replace('{conversation}', parsedArgs.conversation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ConversationController::show
 * @see app/Http/Controllers/Admin/ConversationController.php:240
 * @route '/app/conversations/{conversation}'
 */
show.get = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ConversationController::show
 * @see app/Http/Controllers/Admin/ConversationController.php:240
 * @route '/app/conversations/{conversation}'
 */
show.head = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ConversationController::show
 * @see app/Http/Controllers/Admin/ConversationController.php:240
 * @route '/app/conversations/{conversation}'
 */
    const showForm = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ConversationController::show
 * @see app/Http/Controllers/Admin/ConversationController.php:240
 * @route '/app/conversations/{conversation}'
 */
        showForm.get = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ConversationController::show
 * @see app/Http/Controllers/Admin/ConversationController.php:240
 * @route '/app/conversations/{conversation}'
 */
        showForm.head = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const ConversationController = { workspaceIndex, index, show }

export default ConversationController