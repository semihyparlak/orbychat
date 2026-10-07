import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ExperimentController::index
 * @see app/Http/Controllers/Admin/ExperimentController.php:15
 * @route '/app/agents/{agent}/experiments'
 */
export const index = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/app/agents/{agent}/experiments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ExperimentController::index
 * @see app/Http/Controllers/Admin/ExperimentController.php:15
 * @route '/app/agents/{agent}/experiments'
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
* @see \App\Http\Controllers\Admin\ExperimentController::index
 * @see app/Http/Controllers/Admin/ExperimentController.php:15
 * @route '/app/agents/{agent}/experiments'
 */
index.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ExperimentController::index
 * @see app/Http/Controllers/Admin/ExperimentController.php:15
 * @route '/app/agents/{agent}/experiments'
 */
index.head = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ExperimentController::index
 * @see app/Http/Controllers/Admin/ExperimentController.php:15
 * @route '/app/agents/{agent}/experiments'
 */
    const indexForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ExperimentController::index
 * @see app/Http/Controllers/Admin/ExperimentController.php:15
 * @route '/app/agents/{agent}/experiments'
 */
        indexForm.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ExperimentController::index
 * @see app/Http/Controllers/Admin/ExperimentController.php:15
 * @route '/app/agents/{agent}/experiments'
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
* @see \App\Http\Controllers\Admin\ExperimentController::store
 * @see app/Http/Controllers/Admin/ExperimentController.php:42
 * @route '/app/agents/{agent}/experiments'
 */
export const store = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/app/agents/{agent}/experiments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ExperimentController::store
 * @see app/Http/Controllers/Admin/ExperimentController.php:42
 * @route '/app/agents/{agent}/experiments'
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
* @see \App\Http\Controllers\Admin\ExperimentController::store
 * @see app/Http/Controllers/Admin/ExperimentController.php:42
 * @route '/app/agents/{agent}/experiments'
 */
store.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ExperimentController::store
 * @see app/Http/Controllers/Admin/ExperimentController.php:42
 * @route '/app/agents/{agent}/experiments'
 */
    const storeForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ExperimentController::store
 * @see app/Http/Controllers/Admin/ExperimentController.php:42
 * @route '/app/agents/{agent}/experiments'
 */
        storeForm.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\ExperimentController::start
 * @see app/Http/Controllers/Admin/ExperimentController.php:73
 * @route '/app/experiments/{experiment}/start'
 */
export const start = (args: { experiment: string | number | { id: string | number } } | [experiment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/app/experiments/{experiment}/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ExperimentController::start
 * @see app/Http/Controllers/Admin/ExperimentController.php:73
 * @route '/app/experiments/{experiment}/start'
 */
start.url = (args: { experiment: string | number | { id: string | number } } | [experiment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { experiment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { experiment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    experiment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        experiment: typeof args.experiment === 'object'
                ? args.experiment.id
                : args.experiment,
                }

    return start.definition.url
            .replace('{experiment}', parsedArgs.experiment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExperimentController::start
 * @see app/Http/Controllers/Admin/ExperimentController.php:73
 * @route '/app/experiments/{experiment}/start'
 */
start.post = (args: { experiment: string | number | { id: string | number } } | [experiment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ExperimentController::start
 * @see app/Http/Controllers/Admin/ExperimentController.php:73
 * @route '/app/experiments/{experiment}/start'
 */
    const startForm = (args: { experiment: string | number | { id: string | number } } | [experiment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: start.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ExperimentController::start
 * @see app/Http/Controllers/Admin/ExperimentController.php:73
 * @route '/app/experiments/{experiment}/start'
 */
        startForm.post = (args: { experiment: string | number | { id: string | number } } | [experiment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: start.url(args, options),
            method: 'post',
        })
    
    start.form = startForm
/**
* @see \App\Http\Controllers\Admin\ExperimentController::stop
 * @see app/Http/Controllers/Admin/ExperimentController.php:83
 * @route '/app/experiments/{experiment}/stop'
 */
export const stop = (args: { experiment: string | number | { id: string | number } } | [experiment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stop.url(args, options),
    method: 'post',
})

stop.definition = {
    methods: ["post"],
    url: '/app/experiments/{experiment}/stop',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ExperimentController::stop
 * @see app/Http/Controllers/Admin/ExperimentController.php:83
 * @route '/app/experiments/{experiment}/stop'
 */
stop.url = (args: { experiment: string | number | { id: string | number } } | [experiment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { experiment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { experiment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    experiment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        experiment: typeof args.experiment === 'object'
                ? args.experiment.id
                : args.experiment,
                }

    return stop.definition.url
            .replace('{experiment}', parsedArgs.experiment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExperimentController::stop
 * @see app/Http/Controllers/Admin/ExperimentController.php:83
 * @route '/app/experiments/{experiment}/stop'
 */
stop.post = (args: { experiment: string | number | { id: string | number } } | [experiment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stop.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ExperimentController::stop
 * @see app/Http/Controllers/Admin/ExperimentController.php:83
 * @route '/app/experiments/{experiment}/stop'
 */
    const stopForm = (args: { experiment: string | number | { id: string | number } } | [experiment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: stop.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ExperimentController::stop
 * @see app/Http/Controllers/Admin/ExperimentController.php:83
 * @route '/app/experiments/{experiment}/stop'
 */
        stopForm.post = (args: { experiment: string | number | { id: string | number } } | [experiment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: stop.url(args, options),
            method: 'post',
        })
    
    stop.form = stopForm
/**
* @see \App\Http\Controllers\Admin\ExperimentController::destroy
 * @see app/Http/Controllers/Admin/ExperimentController.php:93
 * @route '/app/experiments/{experiment}'
 */
export const destroy = (args: { experiment: string | number | { id: string | number } } | [experiment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/app/experiments/{experiment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\ExperimentController::destroy
 * @see app/Http/Controllers/Admin/ExperimentController.php:93
 * @route '/app/experiments/{experiment}'
 */
destroy.url = (args: { experiment: string | number | { id: string | number } } | [experiment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { experiment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { experiment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    experiment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        experiment: typeof args.experiment === 'object'
                ? args.experiment.id
                : args.experiment,
                }

    return destroy.definition.url
            .replace('{experiment}', parsedArgs.experiment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ExperimentController::destroy
 * @see app/Http/Controllers/Admin/ExperimentController.php:93
 * @route '/app/experiments/{experiment}'
 */
destroy.delete = (args: { experiment: string | number | { id: string | number } } | [experiment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\ExperimentController::destroy
 * @see app/Http/Controllers/Admin/ExperimentController.php:93
 * @route '/app/experiments/{experiment}'
 */
    const destroyForm = (args: { experiment: string | number | { id: string | number } } | [experiment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ExperimentController::destroy
 * @see app/Http/Controllers/Admin/ExperimentController.php:93
 * @route '/app/experiments/{experiment}'
 */
        destroyForm.delete = (args: { experiment: string | number | { id: string | number } } | [experiment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ExperimentController = { index, store, start, stop, destroy }

export default ExperimentController