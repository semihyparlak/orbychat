import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Widget\ConversationMessagesController::__invoke
 * @see app/Http/Controllers/Widget/ConversationMessagesController.php:27
 * @route '/api/v1/widget/conversation/messages'
 */
const ConversationMessagesController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ConversationMessagesController.url(options),
    method: 'get',
})

ConversationMessagesController.definition = {
    methods: ["get","head"],
    url: '/api/v1/widget/conversation/messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Widget\ConversationMessagesController::__invoke
 * @see app/Http/Controllers/Widget/ConversationMessagesController.php:27
 * @route '/api/v1/widget/conversation/messages'
 */
ConversationMessagesController.url = (options?: RouteQueryOptions) => {
    return ConversationMessagesController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Widget\ConversationMessagesController::__invoke
 * @see app/Http/Controllers/Widget/ConversationMessagesController.php:27
 * @route '/api/v1/widget/conversation/messages'
 */
ConversationMessagesController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ConversationMessagesController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Widget\ConversationMessagesController::__invoke
 * @see app/Http/Controllers/Widget/ConversationMessagesController.php:27
 * @route '/api/v1/widget/conversation/messages'
 */
ConversationMessagesController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ConversationMessagesController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Widget\ConversationMessagesController::__invoke
 * @see app/Http/Controllers/Widget/ConversationMessagesController.php:27
 * @route '/api/v1/widget/conversation/messages'
 */
    const ConversationMessagesControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ConversationMessagesController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Widget\ConversationMessagesController::__invoke
 * @see app/Http/Controllers/Widget/ConversationMessagesController.php:27
 * @route '/api/v1/widget/conversation/messages'
 */
        ConversationMessagesControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ConversationMessagesController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Widget\ConversationMessagesController::__invoke
 * @see app/Http/Controllers/Widget/ConversationMessagesController.php:27
 * @route '/api/v1/widget/conversation/messages'
 */
        ConversationMessagesControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ConversationMessagesController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ConversationMessagesController.form = ConversationMessagesControllerForm
export default ConversationMessagesController