import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::gateway
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:105
 * @route '/admin/plans/{plan}/sync/{gateway}'
 */
export const gateway = (args: { plan: string | number | { id: string | number }, gateway: string | number } | [plan: string | number | { id: string | number }, gateway: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: gateway.url(args, options),
    method: 'post',
})

gateway.definition = {
    methods: ["post"],
    url: '/admin/plans/{plan}/sync/{gateway}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::gateway
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:105
 * @route '/admin/plans/{plan}/sync/{gateway}'
 */
gateway.url = (args: { plan: string | number | { id: string | number }, gateway: string | number } | [plan: string | number | { id: string | number }, gateway: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    plan: args[0],
                    gateway: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        plan: typeof args.plan === 'object'
                ? args.plan.id
                : args.plan,
                                gateway: args.gateway,
                }

    return gateway.definition.url
            .replace('{plan}', parsedArgs.plan.toString())
            .replace('{gateway}', parsedArgs.gateway.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::gateway
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:105
 * @route '/admin/plans/{plan}/sync/{gateway}'
 */
gateway.post = (args: { plan: string | number | { id: string | number }, gateway: string | number } | [plan: string | number | { id: string | number }, gateway: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: gateway.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\PlanController::gateway
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:105
 * @route '/admin/plans/{plan}/sync/{gateway}'
 */
    const gatewayForm = (args: { plan: string | number | { id: string | number }, gateway: string | number } | [plan: string | number | { id: string | number }, gateway: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: gateway.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\PlanController::gateway
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:105
 * @route '/admin/plans/{plan}/sync/{gateway}'
 */
        gatewayForm.post = (args: { plan: string | number | { id: string | number }, gateway: string | number } | [plan: string | number | { id: string | number }, gateway: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: gateway.url(args, options),
            method: 'post',
        })
    
    gateway.form = gatewayForm
const sync = {
    gateway: Object.assign(gateway, gateway),
}

export default sync