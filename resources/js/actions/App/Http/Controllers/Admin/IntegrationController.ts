import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\IntegrationController::index
 * @see app/Http/Controllers/Admin/IntegrationController.php:32
 * @route '/app/integrations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/app/integrations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\IntegrationController::index
 * @see app/Http/Controllers/Admin/IntegrationController.php:32
 * @route '/app/integrations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\IntegrationController::index
 * @see app/Http/Controllers/Admin/IntegrationController.php:32
 * @route '/app/integrations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\IntegrationController::index
 * @see app/Http/Controllers/Admin/IntegrationController.php:32
 * @route '/app/integrations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\IntegrationController::index
 * @see app/Http/Controllers/Admin/IntegrationController.php:32
 * @route '/app/integrations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\IntegrationController::index
 * @see app/Http/Controllers/Admin/IntegrationController.php:32
 * @route '/app/integrations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\IntegrationController::index
 * @see app/Http/Controllers/Admin/IntegrationController.php:32
 * @route '/app/integrations'
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
* @see \App\Http\Controllers\Admin\IntegrationController::storeSlack
 * @see app/Http/Controllers/Admin/IntegrationController.php:98
 * @route '/app/integrations/slack'
 */
export const storeSlack = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeSlack.url(options),
    method: 'post',
})

storeSlack.definition = {
    methods: ["post"],
    url: '/app/integrations/slack',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\IntegrationController::storeSlack
 * @see app/Http/Controllers/Admin/IntegrationController.php:98
 * @route '/app/integrations/slack'
 */
storeSlack.url = (options?: RouteQueryOptions) => {
    return storeSlack.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\IntegrationController::storeSlack
 * @see app/Http/Controllers/Admin/IntegrationController.php:98
 * @route '/app/integrations/slack'
 */
storeSlack.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeSlack.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\IntegrationController::storeSlack
 * @see app/Http/Controllers/Admin/IntegrationController.php:98
 * @route '/app/integrations/slack'
 */
    const storeSlackForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeSlack.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\IntegrationController::storeSlack
 * @see app/Http/Controllers/Admin/IntegrationController.php:98
 * @route '/app/integrations/slack'
 */
        storeSlackForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeSlack.url(options),
            method: 'post',
        })
    
    storeSlack.form = storeSlackForm
/**
* @see \App\Http\Controllers\Admin\IntegrationController::storeWebhook
 * @see app/Http/Controllers/Admin/IntegrationController.php:135
 * @route '/app/integrations/webhooks'
 */
export const storeWebhook = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeWebhook.url(options),
    method: 'post',
})

storeWebhook.definition = {
    methods: ["post"],
    url: '/app/integrations/webhooks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\IntegrationController::storeWebhook
 * @see app/Http/Controllers/Admin/IntegrationController.php:135
 * @route '/app/integrations/webhooks'
 */
storeWebhook.url = (options?: RouteQueryOptions) => {
    return storeWebhook.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\IntegrationController::storeWebhook
 * @see app/Http/Controllers/Admin/IntegrationController.php:135
 * @route '/app/integrations/webhooks'
 */
storeWebhook.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeWebhook.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\IntegrationController::storeWebhook
 * @see app/Http/Controllers/Admin/IntegrationController.php:135
 * @route '/app/integrations/webhooks'
 */
    const storeWebhookForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeWebhook.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\IntegrationController::storeWebhook
 * @see app/Http/Controllers/Admin/IntegrationController.php:135
 * @route '/app/integrations/webhooks'
 */
        storeWebhookForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeWebhook.url(options),
            method: 'post',
        })
    
    storeWebhook.form = storeWebhookForm
/**
* @see \App\Http\Controllers\Admin\IntegrationController::updateWebhook
 * @see app/Http/Controllers/Admin/IntegrationController.php:154
 * @route '/app/integrations/webhooks/{webhookSubscription}'
 */
export const updateWebhook = (args: { webhookSubscription: string | number | { id: string | number } } | [webhookSubscription: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateWebhook.url(args, options),
    method: 'patch',
})

updateWebhook.definition = {
    methods: ["patch"],
    url: '/app/integrations/webhooks/{webhookSubscription}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\IntegrationController::updateWebhook
 * @see app/Http/Controllers/Admin/IntegrationController.php:154
 * @route '/app/integrations/webhooks/{webhookSubscription}'
 */
updateWebhook.url = (args: { webhookSubscription: string | number | { id: string | number } } | [webhookSubscription: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return updateWebhook.definition.url
            .replace('{webhookSubscription}', parsedArgs.webhookSubscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\IntegrationController::updateWebhook
 * @see app/Http/Controllers/Admin/IntegrationController.php:154
 * @route '/app/integrations/webhooks/{webhookSubscription}'
 */
updateWebhook.patch = (args: { webhookSubscription: string | number | { id: string | number } } | [webhookSubscription: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateWebhook.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\IntegrationController::updateWebhook
 * @see app/Http/Controllers/Admin/IntegrationController.php:154
 * @route '/app/integrations/webhooks/{webhookSubscription}'
 */
    const updateWebhookForm = (args: { webhookSubscription: string | number | { id: string | number } } | [webhookSubscription: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateWebhook.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\IntegrationController::updateWebhook
 * @see app/Http/Controllers/Admin/IntegrationController.php:154
 * @route '/app/integrations/webhooks/{webhookSubscription}'
 */
        updateWebhookForm.patch = (args: { webhookSubscription: string | number | { id: string | number } } | [webhookSubscription: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateWebhook.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateWebhook.form = updateWebhookForm
/**
* @see \App\Http\Controllers\Admin\IntegrationController::destroyWebhook
 * @see app/Http/Controllers/Admin/IntegrationController.php:190
 * @route '/app/integrations/webhooks/{webhookSubscription}'
 */
export const destroyWebhook = (args: { webhookSubscription: string | number | { id: string | number } } | [webhookSubscription: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyWebhook.url(args, options),
    method: 'delete',
})

destroyWebhook.definition = {
    methods: ["delete"],
    url: '/app/integrations/webhooks/{webhookSubscription}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\IntegrationController::destroyWebhook
 * @see app/Http/Controllers/Admin/IntegrationController.php:190
 * @route '/app/integrations/webhooks/{webhookSubscription}'
 */
destroyWebhook.url = (args: { webhookSubscription: string | number | { id: string | number } } | [webhookSubscription: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return destroyWebhook.definition.url
            .replace('{webhookSubscription}', parsedArgs.webhookSubscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\IntegrationController::destroyWebhook
 * @see app/Http/Controllers/Admin/IntegrationController.php:190
 * @route '/app/integrations/webhooks/{webhookSubscription}'
 */
destroyWebhook.delete = (args: { webhookSubscription: string | number | { id: string | number } } | [webhookSubscription: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyWebhook.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\IntegrationController::destroyWebhook
 * @see app/Http/Controllers/Admin/IntegrationController.php:190
 * @route '/app/integrations/webhooks/{webhookSubscription}'
 */
    const destroyWebhookForm = (args: { webhookSubscription: string | number | { id: string | number } } | [webhookSubscription: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyWebhook.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\IntegrationController::destroyWebhook
 * @see app/Http/Controllers/Admin/IntegrationController.php:190
 * @route '/app/integrations/webhooks/{webhookSubscription}'
 */
        destroyWebhookForm.delete = (args: { webhookSubscription: string | number | { id: string | number } } | [webhookSubscription: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyWebhook.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyWebhook.form = destroyWebhookForm
/**
* @see \App\Http\Controllers\Admin\IntegrationController::destroy
 * @see app/Http/Controllers/Admin/IntegrationController.php:178
 * @route '/app/integrations/{integration}'
 */
export const destroy = (args: { integration: string | number | { id: string | number } } | [integration: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/app/integrations/{integration}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\IntegrationController::destroy
 * @see app/Http/Controllers/Admin/IntegrationController.php:178
 * @route '/app/integrations/{integration}'
 */
destroy.url = (args: { integration: string | number | { id: string | number } } | [integration: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { integration: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { integration: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    integration: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        integration: typeof args.integration === 'object'
                ? args.integration.id
                : args.integration,
                }

    return destroy.definition.url
            .replace('{integration}', parsedArgs.integration.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\IntegrationController::destroy
 * @see app/Http/Controllers/Admin/IntegrationController.php:178
 * @route '/app/integrations/{integration}'
 */
destroy.delete = (args: { integration: string | number | { id: string | number } } | [integration: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\IntegrationController::destroy
 * @see app/Http/Controllers/Admin/IntegrationController.php:178
 * @route '/app/integrations/{integration}'
 */
    const destroyForm = (args: { integration: string | number | { id: string | number } } | [integration: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/Admin/IntegrationController.php:178
 * @route '/app/integrations/{integration}'
 */
        destroyForm.delete = (args: { integration: string | number | { id: string | number } } | [integration: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const IntegrationController = { index, storeSlack, storeWebhook, updateWebhook, destroyWebhook, destroy }

export default IntegrationController