import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\CtaRuleController::index
 * @see app/Http/Controllers/Admin/CtaRuleController.php:12
 * @route '/app/agents/{agent}/ctas'
 */
export const index = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/app/agents/{agent}/ctas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CtaRuleController::index
 * @see app/Http/Controllers/Admin/CtaRuleController.php:12
 * @route '/app/agents/{agent}/ctas'
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
* @see \App\Http\Controllers\Admin\CtaRuleController::index
 * @see app/Http/Controllers/Admin/CtaRuleController.php:12
 * @route '/app/agents/{agent}/ctas'
 */
index.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CtaRuleController::index
 * @see app/Http/Controllers/Admin/CtaRuleController.php:12
 * @route '/app/agents/{agent}/ctas'
 */
index.head = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\CtaRuleController::index
 * @see app/Http/Controllers/Admin/CtaRuleController.php:12
 * @route '/app/agents/{agent}/ctas'
 */
    const indexForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\CtaRuleController::index
 * @see app/Http/Controllers/Admin/CtaRuleController.php:12
 * @route '/app/agents/{agent}/ctas'
 */
        indexForm.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\CtaRuleController::index
 * @see app/Http/Controllers/Admin/CtaRuleController.php:12
 * @route '/app/agents/{agent}/ctas'
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
* @see \App\Http\Controllers\Admin\CtaRuleController::store
 * @see app/Http/Controllers/Admin/CtaRuleController.php:22
 * @route '/app/agents/{agent}/ctas'
 */
export const store = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/app/agents/{agent}/ctas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CtaRuleController::store
 * @see app/Http/Controllers/Admin/CtaRuleController.php:22
 * @route '/app/agents/{agent}/ctas'
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
* @see \App\Http\Controllers\Admin\CtaRuleController::store
 * @see app/Http/Controllers/Admin/CtaRuleController.php:22
 * @route '/app/agents/{agent}/ctas'
 */
store.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\CtaRuleController::store
 * @see app/Http/Controllers/Admin/CtaRuleController.php:22
 * @route '/app/agents/{agent}/ctas'
 */
    const storeForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CtaRuleController::store
 * @see app/Http/Controllers/Admin/CtaRuleController.php:22
 * @route '/app/agents/{agent}/ctas'
 */
        storeForm.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\CtaRuleController::update
 * @see app/Http/Controllers/Admin/CtaRuleController.php:41
 * @route '/app/cta-rules/{ctaRule}'
 */
export const update = (args: { ctaRule: string | number | { id: string | number } } | [ctaRule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/app/cta-rules/{ctaRule}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\CtaRuleController::update
 * @see app/Http/Controllers/Admin/CtaRuleController.php:41
 * @route '/app/cta-rules/{ctaRule}'
 */
update.url = (args: { ctaRule: string | number | { id: string | number } } | [ctaRule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ctaRule: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ctaRule: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ctaRule: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ctaRule: typeof args.ctaRule === 'object'
                ? args.ctaRule.id
                : args.ctaRule,
                }

    return update.definition.url
            .replace('{ctaRule}', parsedArgs.ctaRule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CtaRuleController::update
 * @see app/Http/Controllers/Admin/CtaRuleController.php:41
 * @route '/app/cta-rules/{ctaRule}'
 */
update.patch = (args: { ctaRule: string | number | { id: string | number } } | [ctaRule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\CtaRuleController::update
 * @see app/Http/Controllers/Admin/CtaRuleController.php:41
 * @route '/app/cta-rules/{ctaRule}'
 */
    const updateForm = (args: { ctaRule: string | number | { id: string | number } } | [ctaRule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CtaRuleController::update
 * @see app/Http/Controllers/Admin/CtaRuleController.php:41
 * @route '/app/cta-rules/{ctaRule}'
 */
        updateForm.patch = (args: { ctaRule: string | number | { id: string | number } } | [ctaRule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\CtaRuleController::destroy
 * @see app/Http/Controllers/Admin/CtaRuleController.php:59
 * @route '/app/cta-rules/{ctaRule}'
 */
export const destroy = (args: { ctaRule: string | number | { id: string | number } } | [ctaRule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/app/cta-rules/{ctaRule}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\CtaRuleController::destroy
 * @see app/Http/Controllers/Admin/CtaRuleController.php:59
 * @route '/app/cta-rules/{ctaRule}'
 */
destroy.url = (args: { ctaRule: string | number | { id: string | number } } | [ctaRule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ctaRule: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ctaRule: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ctaRule: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ctaRule: typeof args.ctaRule === 'object'
                ? args.ctaRule.id
                : args.ctaRule,
                }

    return destroy.definition.url
            .replace('{ctaRule}', parsedArgs.ctaRule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CtaRuleController::destroy
 * @see app/Http/Controllers/Admin/CtaRuleController.php:59
 * @route '/app/cta-rules/{ctaRule}'
 */
destroy.delete = (args: { ctaRule: string | number | { id: string | number } } | [ctaRule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\CtaRuleController::destroy
 * @see app/Http/Controllers/Admin/CtaRuleController.php:59
 * @route '/app/cta-rules/{ctaRule}'
 */
    const destroyForm = (args: { ctaRule: string | number | { id: string | number } } | [ctaRule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CtaRuleController::destroy
 * @see app/Http/Controllers/Admin/CtaRuleController.php:59
 * @route '/app/cta-rules/{ctaRule}'
 */
        destroyForm.delete = (args: { ctaRule: string | number | { id: string | number } } | [ctaRule: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const CtaRuleController = { index, store, update, destroy }

export default CtaRuleController