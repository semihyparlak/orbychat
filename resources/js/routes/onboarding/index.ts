import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\OnboardingController::status
 * @see app/Http/Controllers/Admin/OnboardingController.php:100
 * @route '/api/v1/agents/{agent}/onboarding-status'
 */
export const status = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/api/v1/agents/{agent}/onboarding-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\OnboardingController::status
 * @see app/Http/Controllers/Admin/OnboardingController.php:100
 * @route '/api/v1/agents/{agent}/onboarding-status'
 */
status.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return status.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OnboardingController::status
 * @see app/Http/Controllers/Admin/OnboardingController.php:100
 * @route '/api/v1/agents/{agent}/onboarding-status'
 */
status.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\OnboardingController::status
 * @see app/Http/Controllers/Admin/OnboardingController.php:100
 * @route '/api/v1/agents/{agent}/onboarding-status'
 */
status.head = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\OnboardingController::status
 * @see app/Http/Controllers/Admin/OnboardingController.php:100
 * @route '/api/v1/agents/{agent}/onboarding-status'
 */
    const statusForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: status.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\OnboardingController::status
 * @see app/Http/Controllers/Admin/OnboardingController.php:100
 * @route '/api/v1/agents/{agent}/onboarding-status'
 */
        statusForm.get = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: status.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\OnboardingController::status
 * @see app/Http/Controllers/Admin/OnboardingController.php:100
 * @route '/api/v1/agents/{agent}/onboarding-status'
 */
        statusForm.head = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: status.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    status.form = statusForm
const onboarding = {
    status: Object.assign(status, status),
}

export default onboarding