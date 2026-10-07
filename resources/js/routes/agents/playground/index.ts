import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PlaygroundController::send
 * @see app/Http/Controllers/Admin/PlaygroundController.php:26
 * @route '/app/agents/{agent}/playground'
 */
export const send = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/app/agents/{agent}/playground',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PlaygroundController::send
 * @see app/Http/Controllers/Admin/PlaygroundController.php:26
 * @route '/app/agents/{agent}/playground'
 */
send.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return send.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PlaygroundController::send
 * @see app/Http/Controllers/Admin/PlaygroundController.php:26
 * @route '/app/agents/{agent}/playground'
 */
send.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\PlaygroundController::send
 * @see app/Http/Controllers/Admin/PlaygroundController.php:26
 * @route '/app/agents/{agent}/playground'
 */
    const sendForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: send.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\PlaygroundController::send
 * @see app/Http/Controllers/Admin/PlaygroundController.php:26
 * @route '/app/agents/{agent}/playground'
 */
        sendForm.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: send.url(args, options),
            method: 'post',
        })
    
    send.form = sendForm
const playground = {
    send: Object.assign(send, send),
}

export default playground