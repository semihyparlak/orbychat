import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
* @see \App\Http\Controllers\Admin\SourceController::destroy
 * @see app/Http/Controllers/Admin/SourceController.php:322
 * @route '/app/sources/{source}'
 */
export const destroy = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/app/sources/{source}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\SourceController::destroy
 * @see app/Http/Controllers/Admin/SourceController.php:322
 * @route '/app/sources/{source}'
 */
destroy.url = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { source: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { source: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    source: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        source: typeof args.source === 'object'
                ? args.source.id
                : args.source,
                }

    return destroy.definition.url
            .replace('{source}', parsedArgs.source.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SourceController::destroy
 * @see app/Http/Controllers/Admin/SourceController.php:322
 * @route '/app/sources/{source}'
 */
destroy.delete = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\SourceController::destroy
 * @see app/Http/Controllers/Admin/SourceController.php:322
 * @route '/app/sources/{source}'
 */
    const destroyForm = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SourceController::destroy
 * @see app/Http/Controllers/Admin/SourceController.php:322
 * @route '/app/sources/{source}'
 */
        destroyForm.delete = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\Admin\SourceController::reindex
 * @see app/Http/Controllers/Admin/SourceController.php:384
 * @route '/app/sources/{source}/reindex'
 */
export const reindex = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reindex.url(args, options),
    method: 'post',
})

reindex.definition = {
    methods: ["post"],
    url: '/app/sources/{source}/reindex',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SourceController::reindex
 * @see app/Http/Controllers/Admin/SourceController.php:384
 * @route '/app/sources/{source}/reindex'
 */
reindex.url = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { source: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { source: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    source: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        source: typeof args.source === 'object'
                ? args.source.id
                : args.source,
                }

    return reindex.definition.url
            .replace('{source}', parsedArgs.source.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SourceController::reindex
 * @see app/Http/Controllers/Admin/SourceController.php:384
 * @route '/app/sources/{source}/reindex'
 */
reindex.post = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reindex.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SourceController::reindex
 * @see app/Http/Controllers/Admin/SourceController.php:384
 * @route '/app/sources/{source}/reindex'
 */
    const reindexForm = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reindex.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SourceController::reindex
 * @see app/Http/Controllers/Admin/SourceController.php:384
 * @route '/app/sources/{source}/reindex'
 */
        reindexForm.post = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reindex.url(args, options),
            method: 'post',
        })
    
    reindex.form = reindexForm
/**
* @see \App\Http\Controllers\Admin\SourceController::preview
 * @see app/Http/Controllers/Admin/SourceController.php:399
 * @route '/app/sources/{source}/preview'
 */
export const preview = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/app/sources/{source}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SourceController::preview
 * @see app/Http/Controllers/Admin/SourceController.php:399
 * @route '/app/sources/{source}/preview'
 */
preview.url = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { source: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { source: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    source: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        source: typeof args.source === 'object'
                ? args.source.id
                : args.source,
                }

    return preview.definition.url
            .replace('{source}', parsedArgs.source.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SourceController::preview
 * @see app/Http/Controllers/Admin/SourceController.php:399
 * @route '/app/sources/{source}/preview'
 */
preview.get = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SourceController::preview
 * @see app/Http/Controllers/Admin/SourceController.php:399
 * @route '/app/sources/{source}/preview'
 */
preview.head = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SourceController::preview
 * @see app/Http/Controllers/Admin/SourceController.php:399
 * @route '/app/sources/{source}/preview'
 */
    const previewForm = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SourceController::preview
 * @see app/Http/Controllers/Admin/SourceController.php:399
 * @route '/app/sources/{source}/preview'
 */
        previewForm.get = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SourceController::preview
 * @see app/Http/Controllers/Admin/SourceController.php:399
 * @route '/app/sources/{source}/preview'
 */
        previewForm.head = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preview.form = previewForm
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
* @see \App\Http\Controllers\Admin\SourceController::bulkStore
 * @see app/Http/Controllers/Admin/SourceController.php:362
 * @route '/app/agents/{agent}/sources/bulk'
 */
export const bulkStore = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkStore.url(args, options),
    method: 'post',
})

bulkStore.definition = {
    methods: ["post"],
    url: '/app/agents/{agent}/sources/bulk',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SourceController::bulkStore
 * @see app/Http/Controllers/Admin/SourceController.php:362
 * @route '/app/agents/{agent}/sources/bulk'
 */
bulkStore.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return bulkStore.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SourceController::bulkStore
 * @see app/Http/Controllers/Admin/SourceController.php:362
 * @route '/app/agents/{agent}/sources/bulk'
 */
bulkStore.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkStore.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SourceController::bulkStore
 * @see app/Http/Controllers/Admin/SourceController.php:362
 * @route '/app/agents/{agent}/sources/bulk'
 */
    const bulkStoreForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulkStore.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SourceController::bulkStore
 * @see app/Http/Controllers/Admin/SourceController.php:362
 * @route '/app/agents/{agent}/sources/bulk'
 */
        bulkStoreForm.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkStore.url(args, options),
            method: 'post',
        })
    
    bulkStore.form = bulkStoreForm
/**
* @see \App\Http\Controllers\Admin\SourceController::storeText
 * @see app/Http/Controllers/Admin/SourceController.php:181
 * @route '/app/agents/{agent}/sources/text'
 */
export const storeText = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeText.url(args, options),
    method: 'post',
})

storeText.definition = {
    methods: ["post"],
    url: '/app/agents/{agent}/sources/text',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SourceController::storeText
 * @see app/Http/Controllers/Admin/SourceController.php:181
 * @route '/app/agents/{agent}/sources/text'
 */
storeText.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return storeText.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SourceController::storeText
 * @see app/Http/Controllers/Admin/SourceController.php:181
 * @route '/app/agents/{agent}/sources/text'
 */
storeText.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeText.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SourceController::storeText
 * @see app/Http/Controllers/Admin/SourceController.php:181
 * @route '/app/agents/{agent}/sources/text'
 */
    const storeTextForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeText.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SourceController::storeText
 * @see app/Http/Controllers/Admin/SourceController.php:181
 * @route '/app/agents/{agent}/sources/text'
 */
        storeTextForm.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeText.url(args, options),
            method: 'post',
        })
    
    storeText.form = storeTextForm
/**
* @see \App\Http\Controllers\Admin\SourceController::storeNotion
 * @see app/Http/Controllers/Admin/SourceController.php:218
 * @route '/app/agents/{agent}/sources/notion'
 */
export const storeNotion = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeNotion.url(args, options),
    method: 'post',
})

storeNotion.definition = {
    methods: ["post"],
    url: '/app/agents/{agent}/sources/notion',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SourceController::storeNotion
 * @see app/Http/Controllers/Admin/SourceController.php:218
 * @route '/app/agents/{agent}/sources/notion'
 */
storeNotion.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return storeNotion.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SourceController::storeNotion
 * @see app/Http/Controllers/Admin/SourceController.php:218
 * @route '/app/agents/{agent}/sources/notion'
 */
storeNotion.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeNotion.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SourceController::storeNotion
 * @see app/Http/Controllers/Admin/SourceController.php:218
 * @route '/app/agents/{agent}/sources/notion'
 */
    const storeNotionForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeNotion.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SourceController::storeNotion
 * @see app/Http/Controllers/Admin/SourceController.php:218
 * @route '/app/agents/{agent}/sources/notion'
 */
        storeNotionForm.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeNotion.url(args, options),
            method: 'post',
        })
    
    storeNotion.form = storeNotionForm
/**
* @see \App\Http\Controllers\Admin\SourceController::storeGoogleDoc
 * @see app/Http/Controllers/Admin/SourceController.php:258
 * @route '/app/agents/{agent}/sources/google-doc'
 */
export const storeGoogleDoc = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeGoogleDoc.url(args, options),
    method: 'post',
})

storeGoogleDoc.definition = {
    methods: ["post"],
    url: '/app/agents/{agent}/sources/google-doc',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SourceController::storeGoogleDoc
 * @see app/Http/Controllers/Admin/SourceController.php:258
 * @route '/app/agents/{agent}/sources/google-doc'
 */
storeGoogleDoc.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return storeGoogleDoc.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SourceController::storeGoogleDoc
 * @see app/Http/Controllers/Admin/SourceController.php:258
 * @route '/app/agents/{agent}/sources/google-doc'
 */
storeGoogleDoc.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeGoogleDoc.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SourceController::storeGoogleDoc
 * @see app/Http/Controllers/Admin/SourceController.php:258
 * @route '/app/agents/{agent}/sources/google-doc'
 */
    const storeGoogleDocForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeGoogleDoc.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SourceController::storeGoogleDoc
 * @see app/Http/Controllers/Admin/SourceController.php:258
 * @route '/app/agents/{agent}/sources/google-doc'
 */
        storeGoogleDocForm.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeGoogleDoc.url(args, options),
            method: 'post',
        })
    
    storeGoogleDoc.form = storeGoogleDocForm
const SourceController = { index, store, destroy, reindex, preview, discover, bulkStore, storeText, storeNotion, storeGoogleDoc }

export default SourceController