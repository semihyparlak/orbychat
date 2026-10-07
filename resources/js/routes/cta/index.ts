import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
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
const cta = {
    update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default cta