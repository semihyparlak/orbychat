import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\BehaviorRuleController::index
 * @see app/Http/Controllers/Admin/BehaviorRuleController.php:12
 * @route '/app/agents/{agent}/behavior'
 */
export const index = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/app/agents/{agent}/behavior',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BehaviorRuleController::index
 * @see app/Http/Controllers/Admin/BehaviorRuleController.php:12
 * @route '/app/agents/{agent}/behavior'
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
* @see \App\Http\Controllers\Admin\BehaviorRuleController::index
 * @see app/Http/Controllers/Admin/BehaviorRuleController.php:12
 * @route '/app/agents/{agent}/behavior'
 */
index.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BehaviorRuleController::index
 * @see app/Http/Controllers/Admin/BehaviorRuleController.php:12
 * @route '/app/agents/{agent}/behavior'
 */
index.head = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\BehaviorRuleController::index
 * @see app/Http/Controllers/Admin/BehaviorRuleController.php:12
 * @route '/app/agents/{agent}/behavior'
 */
    const indexForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\BehaviorRuleController::index
 * @see app/Http/Controllers/Admin/BehaviorRuleController.php:12
 * @route '/app/agents/{agent}/behavior'
 */
        indexForm.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\BehaviorRuleController::index
 * @see app/Http/Controllers/Admin/BehaviorRuleController.php:12
 * @route '/app/agents/{agent}/behavior'
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
* @see \App\Http\Controllers\Admin\BehaviorRuleController::store
 * @see app/Http/Controllers/Admin/BehaviorRuleController.php:22
 * @route '/app/agents/{agent}/behavior'
 */
export const store = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/app/agents/{agent}/behavior',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BehaviorRuleController::store
 * @see app/Http/Controllers/Admin/BehaviorRuleController.php:22
 * @route '/app/agents/{agent}/behavior'
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
* @see \App\Http\Controllers\Admin\BehaviorRuleController::store
 * @see app/Http/Controllers/Admin/BehaviorRuleController.php:22
 * @route '/app/agents/{agent}/behavior'
 */
store.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\BehaviorRuleController::store
 * @see app/Http/Controllers/Admin/BehaviorRuleController.php:22
 * @route '/app/agents/{agent}/behavior'
 */
    const storeForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\BehaviorRuleController::store
 * @see app/Http/Controllers/Admin/BehaviorRuleController.php:22
 * @route '/app/agents/{agent}/behavior'
 */
        storeForm.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\BehaviorRuleController::update
 * @see app/Http/Controllers/Admin/BehaviorRuleController.php:41
 * @route '/app/behavior-rules/{behaviorRule}'
 */
export const update = (args: { behaviorRule: string | number | { id: string | number } } | [behaviorRule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/app/behavior-rules/{behaviorRule}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\BehaviorRuleController::update
 * @see app/Http/Controllers/Admin/BehaviorRuleController.php:41
 * @route '/app/behavior-rules/{behaviorRule}'
 */
update.url = (args: { behaviorRule: string | number | { id: string | number } } | [behaviorRule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { behaviorRule: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { behaviorRule: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    behaviorRule: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        behaviorRule: typeof args.behaviorRule === 'object'
                ? args.behaviorRule.id
                : args.behaviorRule,
                }

    return update.definition.url
            .replace('{behaviorRule}', parsedArgs.behaviorRule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BehaviorRuleController::update
 * @see app/Http/Controllers/Admin/BehaviorRuleController.php:41
 * @route '/app/behavior-rules/{behaviorRule}'
 */
update.patch = (args: { behaviorRule: string | number | { id: string | number } } | [behaviorRule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\BehaviorRuleController::update
 * @see app/Http/Controllers/Admin/BehaviorRuleController.php:41
 * @route '/app/behavior-rules/{behaviorRule}'
 */
    const updateForm = (args: { behaviorRule: string | number | { id: string | number } } | [behaviorRule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\BehaviorRuleController::update
 * @see app/Http/Controllers/Admin/BehaviorRuleController.php:41
 * @route '/app/behavior-rules/{behaviorRule}'
 */
        updateForm.patch = (args: { behaviorRule: string | number | { id: string | number } } | [behaviorRule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\BehaviorRuleController::destroy
 * @see app/Http/Controllers/Admin/BehaviorRuleController.php:59
 * @route '/app/behavior-rules/{behaviorRule}'
 */
export const destroy = (args: { behaviorRule: string | number | { id: string | number } } | [behaviorRule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/app/behavior-rules/{behaviorRule}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\BehaviorRuleController::destroy
 * @see app/Http/Controllers/Admin/BehaviorRuleController.php:59
 * @route '/app/behavior-rules/{behaviorRule}'
 */
destroy.url = (args: { behaviorRule: string | number | { id: string | number } } | [behaviorRule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { behaviorRule: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { behaviorRule: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    behaviorRule: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        behaviorRule: typeof args.behaviorRule === 'object'
                ? args.behaviorRule.id
                : args.behaviorRule,
                }

    return destroy.definition.url
            .replace('{behaviorRule}', parsedArgs.behaviorRule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BehaviorRuleController::destroy
 * @see app/Http/Controllers/Admin/BehaviorRuleController.php:59
 * @route '/app/behavior-rules/{behaviorRule}'
 */
destroy.delete = (args: { behaviorRule: string | number | { id: string | number } } | [behaviorRule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\BehaviorRuleController::destroy
 * @see app/Http/Controllers/Admin/BehaviorRuleController.php:59
 * @route '/app/behavior-rules/{behaviorRule}'
 */
    const destroyForm = (args: { behaviorRule: string | number | { id: string | number } } | [behaviorRule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\BehaviorRuleController::destroy
 * @see app/Http/Controllers/Admin/BehaviorRuleController.php:59
 * @route '/app/behavior-rules/{behaviorRule}'
 */
        destroyForm.delete = (args: { behaviorRule: string | number | { id: string | number } } | [behaviorRule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const BehaviorRuleController = { index, store, update, destroy }

export default BehaviorRuleController