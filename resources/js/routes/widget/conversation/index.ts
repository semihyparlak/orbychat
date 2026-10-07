import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Widget\ConversationMessagesController::__invoke
 * @see app/Http/Controllers/Widget/ConversationMessagesController.php:27
 * @route '/api/v1/widget/conversation/messages'
 */
export const messages = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: messages.url(options),
    method: 'get',
})

messages.definition = {
    methods: ["get","head"],
    url: '/api/v1/widget/conversation/messages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Widget\ConversationMessagesController::__invoke
 * @see app/Http/Controllers/Widget/ConversationMessagesController.php:27
 * @route '/api/v1/widget/conversation/messages'
 */
messages.url = (options?: RouteQueryOptions) => {
    return messages.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Widget\ConversationMessagesController::__invoke
 * @see app/Http/Controllers/Widget/ConversationMessagesController.php:27
 * @route '/api/v1/widget/conversation/messages'
 */
messages.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: messages.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Widget\ConversationMessagesController::__invoke
 * @see app/Http/Controllers/Widget/ConversationMessagesController.php:27
 * @route '/api/v1/widget/conversation/messages'
 */
messages.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: messages.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Widget\ConversationMessagesController::__invoke
 * @see app/Http/Controllers/Widget/ConversationMessagesController.php:27
 * @route '/api/v1/widget/conversation/messages'
 */
    const messagesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: messages.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Widget\ConversationMessagesController::__invoke
 * @see app/Http/Controllers/Widget/ConversationMessagesController.php:27
 * @route '/api/v1/widget/conversation/messages'
 */
        messagesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: messages.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Widget\ConversationMessagesController::__invoke
 * @see app/Http/Controllers/Widget/ConversationMessagesController.php:27
 * @route '/api/v1/widget/conversation/messages'
 */
        messagesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: messages.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    messages.form = messagesForm
/**
* @see \App\Http\Controllers\Widget\ConversationClearController::__invoke
 * @see app/Http/Controllers/Widget/ConversationClearController.php:24
 * @route '/api/v1/widget/conversation/clear'
 */
export const clear = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clear.url(options),
    method: 'post',
})

clear.definition = {
    methods: ["post"],
    url: '/api/v1/widget/conversation/clear',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Widget\ConversationClearController::__invoke
 * @see app/Http/Controllers/Widget/ConversationClearController.php:24
 * @route '/api/v1/widget/conversation/clear'
 */
clear.url = (options?: RouteQueryOptions) => {
    return clear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Widget\ConversationClearController::__invoke
 * @see app/Http/Controllers/Widget/ConversationClearController.php:24
 * @route '/api/v1/widget/conversation/clear'
 */
clear.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clear.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Widget\ConversationClearController::__invoke
 * @see app/Http/Controllers/Widget/ConversationClearController.php:24
 * @route '/api/v1/widget/conversation/clear'
 */
    const clearForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: clear.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Widget\ConversationClearController::__invoke
 * @see app/Http/Controllers/Widget/ConversationClearController.php:24
 * @route '/api/v1/widget/conversation/clear'
 */
        clearForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: clear.url(options),
            method: 'post',
        })
    
    clear.form = clearForm
const conversation = {
    messages: Object.assign(messages, messages),
clear: Object.assign(clear, clear),
}

export default conversation