import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Vertical\ApplyController::__invoke
 * @see app/Http/Controllers/Admin/Vertical/ApplyController.php:26
 * @route '/app/agents/{agent}/vertical/apply'
 */
const ApplyController = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ApplyController.url(args, options),
    method: 'post',
})

ApplyController.definition = {
    methods: ["post"],
    url: '/app/agents/{agent}/vertical/apply',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Vertical\ApplyController::__invoke
 * @see app/Http/Controllers/Admin/Vertical/ApplyController.php:26
 * @route '/app/agents/{agent}/vertical/apply'
 */
ApplyController.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return ApplyController.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Vertical\ApplyController::__invoke
 * @see app/Http/Controllers/Admin/Vertical/ApplyController.php:26
 * @route '/app/agents/{agent}/vertical/apply'
 */
ApplyController.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ApplyController.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Vertical\ApplyController::__invoke
 * @see app/Http/Controllers/Admin/Vertical/ApplyController.php:26
 * @route '/app/agents/{agent}/vertical/apply'
 */
    const ApplyControllerForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: ApplyController.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Vertical\ApplyController::__invoke
 * @see app/Http/Controllers/Admin/Vertical/ApplyController.php:26
 * @route '/app/agents/{agent}/vertical/apply'
 */
        ApplyControllerForm.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: ApplyController.url(args, options),
            method: 'post',
        })
    
    ApplyController.form = ApplyControllerForm
export default ApplyController