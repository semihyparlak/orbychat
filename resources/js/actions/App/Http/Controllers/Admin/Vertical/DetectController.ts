import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Vertical\DetectController::__invoke
 * @see app/Http/Controllers/Admin/Vertical/DetectController.php:29
 * @route '/app/agents/{agent}/vertical/detect'
 */
const DetectController = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: DetectController.url(args, options),
    method: 'post',
})

DetectController.definition = {
    methods: ["post"],
    url: '/app/agents/{agent}/vertical/detect',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Vertical\DetectController::__invoke
 * @see app/Http/Controllers/Admin/Vertical/DetectController.php:29
 * @route '/app/agents/{agent}/vertical/detect'
 */
DetectController.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return DetectController.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Vertical\DetectController::__invoke
 * @see app/Http/Controllers/Admin/Vertical/DetectController.php:29
 * @route '/app/agents/{agent}/vertical/detect'
 */
DetectController.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: DetectController.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Vertical\DetectController::__invoke
 * @see app/Http/Controllers/Admin/Vertical/DetectController.php:29
 * @route '/app/agents/{agent}/vertical/detect'
 */
    const DetectControllerForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: DetectController.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Vertical\DetectController::__invoke
 * @see app/Http/Controllers/Admin/Vertical/DetectController.php:29
 * @route '/app/agents/{agent}/vertical/detect'
 */
        DetectControllerForm.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: DetectController.url(args, options),
            method: 'post',
        })
    
    DetectController.form = DetectControllerForm
export default DetectController