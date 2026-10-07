import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import vertical46a98a from './vertical'
import curated from './curated'
import behavior from './behavior'
import ctas from './ctas'
import knowledge from './knowledge'
import conversations from './conversations'
import sources from './sources'
import leads from './leads'
import uploads from './uploads'
import playground8c6e3b from './playground'
import experiments from './experiments'
/**
* @see \App\Http\Controllers\Admin\AgentController::index
 * @see app/Http/Controllers/Admin/AgentController.php:25
 * @route '/app/agents'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/app/agents',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AgentController::index
 * @see app/Http/Controllers/Admin/AgentController.php:25
 * @route '/app/agents'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AgentController::index
 * @see app/Http/Controllers/Admin/AgentController.php:25
 * @route '/app/agents'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AgentController::index
 * @see app/Http/Controllers/Admin/AgentController.php:25
 * @route '/app/agents'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AgentController::index
 * @see app/Http/Controllers/Admin/AgentController.php:25
 * @route '/app/agents'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AgentController::index
 * @see app/Http/Controllers/Admin/AgentController.php:25
 * @route '/app/agents'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AgentController::index
 * @see app/Http/Controllers/Admin/AgentController.php:25
 * @route '/app/agents'
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
/**
* @see \App\Http\Controllers\Admin\AgentController::create
 * @see app/Http/Controllers/Admin/AgentController.php:135
 * @route '/app/agents/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/app/agents/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AgentController::create
 * @see app/Http/Controllers/Admin/AgentController.php:135
 * @route '/app/agents/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AgentController::create
 * @see app/Http/Controllers/Admin/AgentController.php:135
 * @route '/app/agents/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AgentController::create
 * @see app/Http/Controllers/Admin/AgentController.php:135
 * @route '/app/agents/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AgentController::create
 * @see app/Http/Controllers/Admin/AgentController.php:135
 * @route '/app/agents/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AgentController::create
 * @see app/Http/Controllers/Admin/AgentController.php:135
 * @route '/app/agents/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AgentController::create
 * @see app/Http/Controllers/Admin/AgentController.php:135
 * @route '/app/agents/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Admin\AgentController::store
 * @see app/Http/Controllers/Admin/AgentController.php:144
 * @route '/app/agents'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/app/agents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AgentController::store
 * @see app/Http/Controllers/Admin/AgentController.php:144
 * @route '/app/agents'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AgentController::store
 * @see app/Http/Controllers/Admin/AgentController.php:144
 * @route '/app/agents'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AgentController::store
 * @see app/Http/Controllers/Admin/AgentController.php:144
 * @route '/app/agents'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AgentController::store
 * @see app/Http/Controllers/Admin/AgentController.php:144
 * @route '/app/agents'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\AgentController::show
 * @see app/Http/Controllers/Admin/AgentController.php:170
 * @route '/app/agents/{agent}'
 */
export const show = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/app/agents/{agent}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AgentController::show
 * @see app/Http/Controllers/Admin/AgentController.php:170
 * @route '/app/agents/{agent}'
 */
show.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AgentController::show
 * @see app/Http/Controllers/Admin/AgentController.php:170
 * @route '/app/agents/{agent}'
 */
show.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AgentController::show
 * @see app/Http/Controllers/Admin/AgentController.php:170
 * @route '/app/agents/{agent}'
 */
show.head = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AgentController::show
 * @see app/Http/Controllers/Admin/AgentController.php:170
 * @route '/app/agents/{agent}'
 */
    const showForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AgentController::show
 * @see app/Http/Controllers/Admin/AgentController.php:170
 * @route '/app/agents/{agent}'
 */
        showForm.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AgentController::show
 * @see app/Http/Controllers/Admin/AgentController.php:170
 * @route '/app/agents/{agent}'
 */
        showForm.head = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Admin\AgentController::edit
 * @see app/Http/Controllers/Admin/AgentController.php:198
 * @route '/app/agents/{agent}/settings'
 */
export const edit = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/app/agents/{agent}/settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AgentController::edit
 * @see app/Http/Controllers/Admin/AgentController.php:198
 * @route '/app/agents/{agent}/settings'
 */
edit.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AgentController::edit
 * @see app/Http/Controllers/Admin/AgentController.php:198
 * @route '/app/agents/{agent}/settings'
 */
edit.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AgentController::edit
 * @see app/Http/Controllers/Admin/AgentController.php:198
 * @route '/app/agents/{agent}/settings'
 */
edit.head = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AgentController::edit
 * @see app/Http/Controllers/Admin/AgentController.php:198
 * @route '/app/agents/{agent}/settings'
 */
    const editForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AgentController::edit
 * @see app/Http/Controllers/Admin/AgentController.php:198
 * @route '/app/agents/{agent}/settings'
 */
        editForm.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AgentController::edit
 * @see app/Http/Controllers/Admin/AgentController.php:198
 * @route '/app/agents/{agent}/settings'
 */
        editForm.head = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
 * @see routes/web.php:157
 * @route '/app/agents/{agent}/customize'
 */
export const customize = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: customize.url(args, options),
    method: 'get',
})

customize.definition = {
    methods: ["get","head"],
    url: '/app/agents/{agent}/customize',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:157
 * @route '/app/agents/{agent}/customize'
 */
customize.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return customize.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see routes/web.php:157
 * @route '/app/agents/{agent}/customize'
 */
customize.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: customize.url(args, options),
    method: 'get',
})
/**
 * @see routes/web.php:157
 * @route '/app/agents/{agent}/customize'
 */
customize.head = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: customize.url(args, options),
    method: 'head',
})

    /**
 * @see routes/web.php:157
 * @route '/app/agents/{agent}/customize'
 */
    const customizeForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: customize.url(args, options),
        method: 'get',
    })

            /**
 * @see routes/web.php:157
 * @route '/app/agents/{agent}/customize'
 */
        customizeForm.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: customize.url(args, options),
            method: 'get',
        })
            /**
 * @see routes/web.php:157
 * @route '/app/agents/{agent}/customize'
 */
        customizeForm.head = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: customize.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    customize.form = customizeForm
/**
 * @see routes/web.php:169
 * @route '/app/agents/{agent}/vertical'
 */
export const vertical = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vertical.url(args, options),
    method: 'get',
})

vertical.definition = {
    methods: ["get","head"],
    url: '/app/agents/{agent}/vertical',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:169
 * @route '/app/agents/{agent}/vertical'
 */
vertical.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return vertical.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see routes/web.php:169
 * @route '/app/agents/{agent}/vertical'
 */
vertical.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vertical.url(args, options),
    method: 'get',
})
/**
 * @see routes/web.php:169
 * @route '/app/agents/{agent}/vertical'
 */
vertical.head = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: vertical.url(args, options),
    method: 'head',
})

    /**
 * @see routes/web.php:169
 * @route '/app/agents/{agent}/vertical'
 */
    const verticalForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: vertical.url(args, options),
        method: 'get',
    })

            /**
 * @see routes/web.php:169
 * @route '/app/agents/{agent}/vertical'
 */
        verticalForm.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vertical.url(args, options),
            method: 'get',
        })
            /**
 * @see routes/web.php:169
 * @route '/app/agents/{agent}/vertical'
 */
        verticalForm.head = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vertical.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    vertical.form = verticalForm
/**
* @see \App\Http\Controllers\Admin\AgentController::update
 * @see app/Http/Controllers/Admin/AgentController.php:213
 * @route '/app/agents/{agent}'
 */
export const update = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/app/agents/{agent}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\AgentController::update
 * @see app/Http/Controllers/Admin/AgentController.php:213
 * @route '/app/agents/{agent}'
 */
update.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AgentController::update
 * @see app/Http/Controllers/Admin/AgentController.php:213
 * @route '/app/agents/{agent}'
 */
update.patch = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\AgentController::update
 * @see app/Http/Controllers/Admin/AgentController.php:213
 * @route '/app/agents/{agent}'
 */
    const updateForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AgentController::update
 * @see app/Http/Controllers/Admin/AgentController.php:213
 * @route '/app/agents/{agent}'
 */
        updateForm.patch = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\AgentController::destroy
 * @see app/Http/Controllers/Admin/AgentController.php:222
 * @route '/app/agents/{agent}'
 */
export const destroy = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/app/agents/{agent}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AgentController::destroy
 * @see app/Http/Controllers/Admin/AgentController.php:222
 * @route '/app/agents/{agent}'
 */
destroy.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AgentController::destroy
 * @see app/Http/Controllers/Admin/AgentController.php:222
 * @route '/app/agents/{agent}'
 */
destroy.delete = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\AgentController::destroy
 * @see app/Http/Controllers/Admin/AgentController.php:222
 * @route '/app/agents/{agent}'
 */
    const destroyForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AgentController::destroy
 * @see app/Http/Controllers/Admin/AgentController.php:222
 * @route '/app/agents/{agent}'
 */
        destroyForm.delete = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\AgentController::publish
 * @see app/Http/Controllers/Admin/AgentController.php:231
 * @route '/app/agents/{agent}/publish'
 */
export const publish = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

publish.definition = {
    methods: ["post"],
    url: '/app/agents/{agent}/publish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AgentController::publish
 * @see app/Http/Controllers/Admin/AgentController.php:231
 * @route '/app/agents/{agent}/publish'
 */
publish.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return publish.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AgentController::publish
 * @see app/Http/Controllers/Admin/AgentController.php:231
 * @route '/app/agents/{agent}/publish'
 */
publish.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AgentController::publish
 * @see app/Http/Controllers/Admin/AgentController.php:231
 * @route '/app/agents/{agent}/publish'
 */
    const publishForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: publish.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AgentController::publish
 * @see app/Http/Controllers/Admin/AgentController.php:231
 * @route '/app/agents/{agent}/publish'
 */
        publishForm.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: publish.url(args, options),
            method: 'post',
        })
    
    publish.form = publishForm
/**
* @see \App\Http\Controllers\Admin\AgentController::rollback
 * @see app/Http/Controllers/Admin/AgentController.php:240
 * @route '/app/agents/{agent}/rollback'
 */
export const rollback = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rollback.url(args, options),
    method: 'post',
})

rollback.definition = {
    methods: ["post"],
    url: '/app/agents/{agent}/rollback',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AgentController::rollback
 * @see app/Http/Controllers/Admin/AgentController.php:240
 * @route '/app/agents/{agent}/rollback'
 */
rollback.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return rollback.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AgentController::rollback
 * @see app/Http/Controllers/Admin/AgentController.php:240
 * @route '/app/agents/{agent}/rollback'
 */
rollback.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rollback.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AgentController::rollback
 * @see app/Http/Controllers/Admin/AgentController.php:240
 * @route '/app/agents/{agent}/rollback'
 */
    const rollbackForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: rollback.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AgentController::rollback
 * @see app/Http/Controllers/Admin/AgentController.php:240
 * @route '/app/agents/{agent}/rollback'
 */
        rollbackForm.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: rollback.url(args, options),
            method: 'post',
        })
    
    rollback.form = rollbackForm
/**
* @see \App\Http\Controllers\Admin\PlaygroundController::playground
 * @see app/Http/Controllers/Admin/PlaygroundController.php:17
 * @route '/app/agents/{agent}/playground'
 */
export const playground = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: playground.url(args, options),
    method: 'get',
})

playground.definition = {
    methods: ["get","head"],
    url: '/app/agents/{agent}/playground',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PlaygroundController::playground
 * @see app/Http/Controllers/Admin/PlaygroundController.php:17
 * @route '/app/agents/{agent}/playground'
 */
playground.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return playground.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PlaygroundController::playground
 * @see app/Http/Controllers/Admin/PlaygroundController.php:17
 * @route '/app/agents/{agent}/playground'
 */
playground.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: playground.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PlaygroundController::playground
 * @see app/Http/Controllers/Admin/PlaygroundController.php:17
 * @route '/app/agents/{agent}/playground'
 */
playground.head = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: playground.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\PlaygroundController::playground
 * @see app/Http/Controllers/Admin/PlaygroundController.php:17
 * @route '/app/agents/{agent}/playground'
 */
    const playgroundForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: playground.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\PlaygroundController::playground
 * @see app/Http/Controllers/Admin/PlaygroundController.php:17
 * @route '/app/agents/{agent}/playground'
 */
        playgroundForm.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: playground.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\PlaygroundController::playground
 * @see app/Http/Controllers/Admin/PlaygroundController.php:17
 * @route '/app/agents/{agent}/playground'
 */
        playgroundForm.head = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: playground.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    playground.form = playgroundForm
const agents = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
customize: Object.assign(customize, customize),
vertical: Object.assign(vertical, vertical46a98a),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
publish: Object.assign(publish, publish),
rollback: Object.assign(rollback, rollback),
curated: Object.assign(curated, curated),
behavior: Object.assign(behavior, behavior),
ctas: Object.assign(ctas, ctas),
knowledge: Object.assign(knowledge, knowledge),
conversations: Object.assign(conversations, conversations),
sources: Object.assign(sources, sources),
leads: Object.assign(leads, leads),
uploads: Object.assign(uploads, uploads),
playground: Object.assign(playground, playground8c6e3b),
experiments: Object.assign(experiments, experiments),
}

export default agents