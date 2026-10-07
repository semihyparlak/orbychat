import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Widget\MessageStreamController::__invoke
 * @see app/Http/Controllers/Widget/MessageStreamController.php:62
 * @route '/api/v1/widget/messages/stream'
 */
const MessageStreamController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: MessageStreamController.url(options),
    method: 'post',
})

MessageStreamController.definition = {
    methods: ["post"],
    url: '/api/v1/widget/messages/stream',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Widget\MessageStreamController::__invoke
 * @see app/Http/Controllers/Widget/MessageStreamController.php:62
 * @route '/api/v1/widget/messages/stream'
 */
MessageStreamController.url = (options?: RouteQueryOptions) => {
    return MessageStreamController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Widget\MessageStreamController::__invoke
 * @see app/Http/Controllers/Widget/MessageStreamController.php:62
 * @route '/api/v1/widget/messages/stream'
 */
MessageStreamController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: MessageStreamController.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Widget\MessageStreamController::__invoke
 * @see app/Http/Controllers/Widget/MessageStreamController.php:62
 * @route '/api/v1/widget/messages/stream'
 */
    const MessageStreamControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: MessageStreamController.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Widget\MessageStreamController::__invoke
 * @see app/Http/Controllers/Widget/MessageStreamController.php:62
 * @route '/api/v1/widget/messages/stream'
 */
        MessageStreamControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: MessageStreamController.url(options),
            method: 'post',
        })
    
    MessageStreamController.form = MessageStreamControllerForm
export default MessageStreamController