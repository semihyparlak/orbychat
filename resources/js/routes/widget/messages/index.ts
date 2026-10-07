import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Widget\MessageStreamController::__invoke
 * @see app/Http/Controllers/Widget/MessageStreamController.php:62
 * @route '/api/v1/widget/messages/stream'
 */
export const stream = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stream.url(options),
    method: 'post',
})

stream.definition = {
    methods: ["post"],
    url: '/api/v1/widget/messages/stream',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Widget\MessageStreamController::__invoke
 * @see app/Http/Controllers/Widget/MessageStreamController.php:62
 * @route '/api/v1/widget/messages/stream'
 */
stream.url = (options?: RouteQueryOptions) => {
    return stream.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Widget\MessageStreamController::__invoke
 * @see app/Http/Controllers/Widget/MessageStreamController.php:62
 * @route '/api/v1/widget/messages/stream'
 */
stream.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stream.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Widget\MessageStreamController::__invoke
 * @see app/Http/Controllers/Widget/MessageStreamController.php:62
 * @route '/api/v1/widget/messages/stream'
 */
    const streamForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: stream.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Widget\MessageStreamController::__invoke
 * @see app/Http/Controllers/Widget/MessageStreamController.php:62
 * @route '/api/v1/widget/messages/stream'
 */
        streamForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: stream.url(options),
            method: 'post',
        })
    
    stream.form = streamForm
const messages = {
    stream: Object.assign(stream, stream),
}

export default messages