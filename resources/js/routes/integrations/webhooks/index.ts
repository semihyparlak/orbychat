import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\IntegrationController::store
 * @see app/Http/Controllers/Admin/IntegrationController.php:135
 * @route '/app/integrations/webhooks'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/app/integrations/webhooks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\IntegrationController::store
 * @see app/Http/Controllers/Admin/IntegrationController.php:135
 * @route '/app/integrations/webhooks'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\IntegrationController::store
 * @see app/Http/Controllers/Admin/IntegrationController.php:135
 * @route '/app/integrations/webhooks'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\IntegrationController::store
 * @see app/Http/Controllers/Admin/IntegrationController.php:135
 * @route '/app/integrations/webhooks'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\IntegrationController::store
 * @see app/Http/Controllers/Admin/IntegrationController.php:135
 * @route '/app/integrations/webhooks'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\IntegrationController::update
 * @see app/Http/Controllers/Admin/IntegrationController.php:154
 * @route '/app/integrations/webhooks/{webhookSubscription}'
 */
export const update = (args: { webhookSubscription: string | number | { id: string | number } } | [webhookSubscription: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/app/integrations/webhooks/{webhookSubscription}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\IntegrationController::update
 * @see app/Http/Controllers/Admin/IntegrationController.php:154
 * @route '/app/integrations/webhooks/{webhookSubscription}'
 */
update.url = (args: { webhookSubscription: string | number | { id: string | number } } | [webhookSubscription: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { webhookSubscription: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { webhookSubscription: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    webhookSubscription: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        webhookSubscription: typeof args.webhookSubscription === 'object'
                ? args.webhookSubscription.id
                : args.webhookSubscription,
                }

    return update.definition.url
            .replace('{webhookSubscription}', parsedArgs.webhookSubscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\IntegrationController::update
 * @see app/Http/Controllers/Admin/IntegrationController.php:154
 * @route '/app/integrations/webhooks/{webhookSubscription}'
 */
update.patch = (args: { webhookSubscription: string | number | { id: string | number } } | [webhookSubscription: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\IntegrationController::update
 * @see app/Http/Controllers/Admin/IntegrationController.php:154
 * @route '/app/integrations/webhooks/{webhookSubscription}'
 */
    const updateForm = (args: { webhookSubscription: string | number | { id: string | number } } | [webhookSubscription: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\IntegrationController::update
 * @see app/Http/Controllers/Admin/IntegrationController.php:154
 * @route '/app/integrations/webhooks/{webhookSubscription}'
 */
        updateForm.patch = (args: { webhookSubscription: string | number | { id: string | number } } | [webhookSubscription: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\IntegrationController::destroy
 * @see app/Http/Controllers/Admin/IntegrationController.php:190
 * @route '/app/integrations/webhooks/{webhookSubscription}'
 */
export const destroy = (args: { webhookSubscription: string | number | { id: string | number } } | [webhookSubscription: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/app/integrations/webhooks/{webhookSubscription}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\IntegrationController::destroy
 * @see app/Http/Controllers/Admin/IntegrationController.php:190
 * @route '/app/integrations/webhooks/{webhookSubscription}'
 */
destroy.url = (args: { webhookSubscription: string | number | { id: string | number } } | [webhookSubscription: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { webhookSubscription: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { webhookSubscription: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    webhookSubscription: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        webhookSubscription: typeof args.webhookSubscription === 'object'
                ? args.webhookSubscription.id
                : args.webhookSubscription,
                }

    return destroy.definition.url
            .replace('{webhookSubscription}', parsedArgs.webhookSubscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\IntegrationController::destroy
 * @see app/Http/Controllers/Admin/IntegrationController.php:190
 * @route '/app/integrations/webhooks/{webhookSubscription}'
 */
destroy.delete = (args: { webhookSubscription: string | number | { id: string | number } } | [webhookSubscription: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\IntegrationController::destroy
 * @see app/Http/Controllers/Admin/IntegrationController.php:190
 * @route '/app/integrations/webhooks/{webhookSubscription}'
 */
    const destroyForm = (args: { webhookSubscription: string | number | { id: string | number } } | [webhookSubscription: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\IntegrationController::destroy
 * @see app/Http/Controllers/Admin/IntegrationController.php:190
 * @route '/app/integrations/webhooks/{webhookSubscription}'
 */
        destroyForm.delete = (args: { webhookSubscription: string | number | { id: string | number } } | [webhookSubscription: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const webhooks = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default webhooks