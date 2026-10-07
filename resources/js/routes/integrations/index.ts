import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import slack from './slack'
import webhooks from './webhooks'
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
const integrations = {
    index: Object.assign(index, index),
slack: Object.assign(slack, slack),
webhooks: Object.assign(webhooks, webhooks),
destroy: Object.assign(destroy, destroy),
}

export default integrations