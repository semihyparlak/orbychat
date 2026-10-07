import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Widget\MessageController::__invoke
 * @see app/Http/Controllers/Widget/MessageController.php:18
 * @route '/api/v1/widget/messages'
 */
const MessageController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: MessageController.url(options),
    method: 'post',
})

MessageController.definition = {
    methods: ["post"],
    url: '/api/v1/widget/messages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Widget\MessageController::__invoke
 * @see app/Http/Controllers/Widget/MessageController.php:18
 * @route '/api/v1/widget/messages'
 */
MessageController.url = (options?: RouteQueryOptions) => {
    return MessageController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Widget\MessageController::__invoke
 * @see app/Http/Controllers/Widget/MessageController.php:18
 * @route '/api/v1/widget/messages'
 */
MessageController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: MessageController.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Widget\MessageController::__invoke
 * @see app/Http/Controllers/Widget/MessageController.php:18
 * @route '/api/v1/widget/messages'
 */
    const MessageControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: MessageController.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Widget\MessageController::__invoke
 * @see app/Http/Controllers/Widget/MessageController.php:18
 * @route '/api/v1/widget/messages'
 */
        MessageControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: MessageController.url(options),
            method: 'post',
        })
    
    MessageController.form = MessageControllerForm
export default MessageController