import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\KnowledgeController::index
 * @see app/Http/Controllers/Admin/KnowledgeController.php:26
 * @route '/app/agents/{agent}/knowledge'
 */
export const index = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/app/agents/{agent}/knowledge',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\KnowledgeController::index
 * @see app/Http/Controllers/Admin/KnowledgeController.php:26
 * @route '/app/agents/{agent}/knowledge'
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
* @see \App\Http\Controllers\Admin\KnowledgeController::index
 * @see app/Http/Controllers/Admin/KnowledgeController.php:26
 * @route '/app/agents/{agent}/knowledge'
 */
index.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\KnowledgeController::index
 * @see app/Http/Controllers/Admin/KnowledgeController.php:26
 * @route '/app/agents/{agent}/knowledge'
 */
index.head = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\KnowledgeController::index
 * @see app/Http/Controllers/Admin/KnowledgeController.php:26
 * @route '/app/agents/{agent}/knowledge'
 */
    const indexForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\KnowledgeController::index
 * @see app/Http/Controllers/Admin/KnowledgeController.php:26
 * @route '/app/agents/{agent}/knowledge'
 */
        indexForm.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\KnowledgeController::index
 * @see app/Http/Controllers/Admin/KnowledgeController.php:26
 * @route '/app/agents/{agent}/knowledge'
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
* @see \App\Http\Controllers\Admin\KnowledgeController::reindex
 * @see app/Http/Controllers/Admin/KnowledgeController.php:124
 * @route '/app/documents/{document}/reindex'
 */
export const reindex = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reindex.url(args, options),
    method: 'post',
})

reindex.definition = {
    methods: ["post"],
    url: '/app/documents/{document}/reindex',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\KnowledgeController::reindex
 * @see app/Http/Controllers/Admin/KnowledgeController.php:124
 * @route '/app/documents/{document}/reindex'
 */
reindex.url = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { document: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    document: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return reindex.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\KnowledgeController::reindex
 * @see app/Http/Controllers/Admin/KnowledgeController.php:124
 * @route '/app/documents/{document}/reindex'
 */
reindex.post = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reindex.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\KnowledgeController::reindex
 * @see app/Http/Controllers/Admin/KnowledgeController.php:124
 * @route '/app/documents/{document}/reindex'
 */
    const reindexForm = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reindex.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\KnowledgeController::reindex
 * @see app/Http/Controllers/Admin/KnowledgeController.php:124
 * @route '/app/documents/{document}/reindex'
 */
        reindexForm.post = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reindex.url(args, options),
            method: 'post',
        })
    
    reindex.form = reindexForm
const KnowledgeController = { index, reindex }

export default KnowledgeController