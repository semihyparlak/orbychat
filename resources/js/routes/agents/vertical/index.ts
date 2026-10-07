import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Vertical\DetectController::__invoke
 * @see app/Http/Controllers/Admin/Vertical/DetectController.php:29
 * @route '/app/agents/{agent}/vertical/detect'
 */
export const detect = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: detect.url(args, options),
    method: 'post',
})

detect.definition = {
    methods: ["post"],
    url: '/app/agents/{agent}/vertical/detect',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Vertical\DetectController::__invoke
 * @see app/Http/Controllers/Admin/Vertical/DetectController.php:29
 * @route '/app/agents/{agent}/vertical/detect'
 */
detect.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return detect.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Vertical\DetectController::__invoke
 * @see app/Http/Controllers/Admin/Vertical/DetectController.php:29
 * @route '/app/agents/{agent}/vertical/detect'
 */
detect.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: detect.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Vertical\DetectController::__invoke
 * @see app/Http/Controllers/Admin/Vertical/DetectController.php:29
 * @route '/app/agents/{agent}/vertical/detect'
 */
    const detectForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: detect.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Vertical\DetectController::__invoke
 * @see app/Http/Controllers/Admin/Vertical/DetectController.php:29
 * @route '/app/agents/{agent}/vertical/detect'
 */
        detectForm.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: detect.url(args, options),
            method: 'post',
        })
    
    detect.form = detectForm
/**
* @see \App\Http\Controllers\Admin\Vertical\ApplyController::__invoke
 * @see app/Http/Controllers/Admin/Vertical/ApplyController.php:26
 * @route '/app/agents/{agent}/vertical/apply'
 */
export const apply = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(args, options),
    method: 'post',
})

apply.definition = {
    methods: ["post"],
    url: '/app/agents/{agent}/vertical/apply',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Vertical\ApplyController::__invoke
 * @see app/Http/Controllers/Admin/Vertical/ApplyController.php:26
 * @route '/app/agents/{agent}/vertical/apply'
 */
apply.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return apply.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Vertical\ApplyController::__invoke
 * @see app/Http/Controllers/Admin/Vertical/ApplyController.php:26
 * @route '/app/agents/{agent}/vertical/apply'
 */
apply.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Vertical\ApplyController::__invoke
 * @see app/Http/Controllers/Admin/Vertical/ApplyController.php:26
 * @route '/app/agents/{agent}/vertical/apply'
 */
    const applyForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: apply.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Vertical\ApplyController::__invoke
 * @see app/Http/Controllers/Admin/Vertical/ApplyController.php:26
 * @route '/app/agents/{agent}/vertical/apply'
 */
        applyForm.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: apply.url(args, options),
            method: 'post',
        })
    
    apply.form = applyForm
const vertical = {
    detect: Object.assign(detect, detect),
apply: Object.assign(apply, apply),
}

export default vertical