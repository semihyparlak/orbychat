import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SourceController::index
 * @see app/Http/Controllers/Admin/SourceController.php:23
 * @route '/app/agents/{agent}/sources'
 */
export const index = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/app/agents/{agent}/sources',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SourceController::index
 * @see app/Http/Controllers/Admin/SourceController.php:23
 * @route '/app/agents/{agent}/sources'
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
* @see \App\Http\Controllers\Admin\SourceController::index
 * @see app/Http/Controllers/Admin/SourceController.php:23
 * @route '/app/agents/{agent}/sources'
 */
index.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SourceController::index
 * @see app/Http/Controllers/Admin/SourceController.php:23
 * @route '/app/agents/{agent}/sources'
 */
index.head = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SourceController::index
 * @see app/Http/Controllers/Admin/SourceController.php:23
 * @route '/app/agents/{agent}/sources'
 */
    const indexForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SourceController::index
 * @see app/Http/Controllers/Admin/SourceController.php:23
 * @route '/app/agents/{agent}/sources'
 */
        indexForm.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SourceController::index
 * @see app/Http/Controllers/Admin/SourceController.php:23
 * @route '/app/agents/{agent}/sources'
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
* @see \App\Http\Controllers\Admin\SourceController::store
 * @see app/Http/Controllers/Admin/SourceController.php:146
 * @route '/app/agents/{agent}/sources'
 */
export const store = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/app/agents/{agent}/sources',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SourceController::store
 * @see app/Http/Controllers/Admin/SourceController.php:146
 * @route '/app/agents/{agent}/sources'
 */
store.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SourceController::store
 * @see app/Http/Controllers/Admin/SourceController.php:146
 * @route '/app/agents/{agent}/sources'
 */
store.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SourceController::store
 * @see app/Http/Controllers/Admin/SourceController.php:146
 * @route '/app/agents/{agent}/sources'
 */
    const storeForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SourceController::store
 * @see app/Http/Controllers/Admin/SourceController.php:146
 * @route '/app/agents/{agent}/sources'
 */
        storeForm.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\SourceController::discover
 * @see app/Http/Controllers/Admin/SourceController.php:336
 * @route '/app/agents/{agent}/sources/discover'
 */
export const discover = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: discover.url(args, options),
    method: 'post',
})

discover.definition = {
    methods: ["post"],
    url: '/app/agents/{agent}/sources/discover',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SourceController::discover
 * @see app/Http/Controllers/Admin/SourceController.php:336
 * @route '/app/agents/{agent}/sources/discover'
 */
discover.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return discover.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SourceController::discover
 * @see app/Http/Controllers/Admin/SourceController.php:336
 * @route '/app/agents/{agent}/sources/discover'
 */
discover.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: discover.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SourceController::discover
 * @see app/Http/Controllers/Admin/SourceController.php:336
 * @route '/app/agents/{agent}/sources/discover'
 */
    const discoverForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: discover.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SourceController::discover
 * @see app/Http/Controllers/Admin/SourceController.php:336
 * @route '/app/agents/{agent}/sources/discover'
 */
        discoverForm.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: discover.url(args, options),
            method: 'post',
        })
    
    discover.form = discoverForm
/**
* @see \App\Http\Controllers\Admin\SourceController::bulk
 * @see app/Http/Controllers/Admin/SourceController.php:362
 * @route '/app/agents/{agent}/sources/bulk'
 */
export const bulk = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulk.url(args, options),
    method: 'post',
})

bulk.definition = {
    methods: ["post"],
    url: '/app/agents/{agent}/sources/bulk',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SourceController::bulk
 * @see app/Http/Controllers/Admin/SourceController.php:362
 * @route '/app/agents/{agent}/sources/bulk'
 */
bulk.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return bulk.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SourceController::bulk
 * @see app/Http/Controllers/Admin/SourceController.php:362
 * @route '/app/agents/{agent}/sources/bulk'
 */
bulk.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulk.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SourceController::bulk
 * @see app/Http/Controllers/Admin/SourceController.php:362
 * @route '/app/agents/{agent}/sources/bulk'
 */
    const bulkForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulk.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SourceController::bulk
 * @see app/Http/Controllers/Admin/SourceController.php:362
 * @route '/app/agents/{agent}/sources/bulk'
 */
        bulkForm.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulk.url(args, options),
            method: 'post',
        })
    
    bulk.form = bulkForm
/**
* @see \App\Http\Controllers\Admin\SourceController::text
 * @see app/Http/Controllers/Admin/SourceController.php:181
 * @route '/app/agents/{agent}/sources/text'
 */
export const text = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: text.url(args, options),
    method: 'post',
})

text.definition = {
    methods: ["post"],
    url: '/app/agents/{agent}/sources/text',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SourceController::text
 * @see app/Http/Controllers/Admin/SourceController.php:181
 * @route '/app/agents/{agent}/sources/text'
 */
text.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return text.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SourceController::text
 * @see app/Http/Controllers/Admin/SourceController.php:181
 * @route '/app/agents/{agent}/sources/text'
 */
text.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: text.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SourceController::text
 * @see app/Http/Controllers/Admin/SourceController.php:181
 * @route '/app/agents/{agent}/sources/text'
 */
    const textForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: text.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SourceController::text
 * @see app/Http/Controllers/Admin/SourceController.php:181
 * @route '/app/agents/{agent}/sources/text'
 */
        textForm.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: text.url(args, options),
            method: 'post',
        })
    
    text.form = textForm
/**
* @see \App\Http\Controllers\Admin\SourceController::notion
 * @see app/Http/Controllers/Admin/SourceController.php:218
 * @route '/app/agents/{agent}/sources/notion'
 */
export const notion = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: notion.url(args, options),
    method: 'post',
})

notion.definition = {
    methods: ["post"],
    url: '/app/agents/{agent}/sources/notion',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SourceController::notion
 * @see app/Http/Controllers/Admin/SourceController.php:218
 * @route '/app/agents/{agent}/sources/notion'
 */
notion.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return notion.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SourceController::notion
 * @see app/Http/Controllers/Admin/SourceController.php:218
 * @route '/app/agents/{agent}/sources/notion'
 */
notion.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: notion.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SourceController::notion
 * @see app/Http/Controllers/Admin/SourceController.php:218
 * @route '/app/agents/{agent}/sources/notion'
 */
    const notionForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: notion.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SourceController::notion
 * @see app/Http/Controllers/Admin/SourceController.php:218
 * @route '/app/agents/{agent}/sources/notion'
 */
        notionForm.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: notion.url(args, options),
            method: 'post',
        })
    
    notion.form = notionForm
/**
* @see \App\Http\Controllers\Admin\SourceController::googleDoc
 * @see app/Http/Controllers/Admin/SourceController.php:258
 * @route '/app/agents/{agent}/sources/google-doc'
 */
export const googleDoc = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: googleDoc.url(args, options),
    method: 'post',
})

googleDoc.definition = {
    methods: ["post"],
    url: '/app/agents/{agent}/sources/google-doc',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SourceController::googleDoc
 * @see app/Http/Controllers/Admin/SourceController.php:258
 * @route '/app/agents/{agent}/sources/google-doc'
 */
googleDoc.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return googleDoc.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SourceController::googleDoc
 * @see app/Http/Controllers/Admin/SourceController.php:258
 * @route '/app/agents/{agent}/sources/google-doc'
 */
googleDoc.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: googleDoc.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SourceController::googleDoc
 * @see app/Http/Controllers/Admin/SourceController.php:258
 * @route '/app/agents/{agent}/sources/google-doc'
 */
    const googleDocForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: googleDoc.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SourceController::googleDoc
 * @see app/Http/Controllers/Admin/SourceController.php:258
 * @route '/app/agents/{agent}/sources/google-doc'
 */
        googleDocForm.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: googleDoc.url(args, options),
            method: 'post',
        })
    
    googleDoc.form = googleDocForm
const sources = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
discover: Object.assign(discover, discover),
bulk: Object.assign(bulk, bulk),
text: Object.assign(text, text),
notion: Object.assign(notion, notion),
googleDoc: Object.assign(googleDoc, googleDoc),
}

export default sources