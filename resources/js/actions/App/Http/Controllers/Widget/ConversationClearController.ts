import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Widget\ConversationClearController::__invoke
 * @see app/Http/Controllers/Widget/ConversationClearController.php:24
 * @route '/api/v1/widget/conversation/clear'
 */
const ConversationClearController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ConversationClearController.url(options),
    method: 'post',
})

ConversationClearController.definition = {
    methods: ["post"],
    url: '/api/v1/widget/conversation/clear',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Widget\ConversationClearController::__invoke
 * @see app/Http/Controllers/Widget/ConversationClearController.php:24
 * @route '/api/v1/widget/conversation/clear'
 */
ConversationClearController.url = (options?: RouteQueryOptions) => {
    return ConversationClearController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Widget\ConversationClearController::__invoke
 * @see app/Http/Controllers/Widget/ConversationClearController.php:24
 * @route '/api/v1/widget/conversation/clear'
 */
ConversationClearController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ConversationClearController.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Widget\ConversationClearController::__invoke
 * @see app/Http/Controllers/Widget/ConversationClearController.php:24
 * @route '/api/v1/widget/conversation/clear'
 */
    const ConversationClearControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: ConversationClearController.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Widget\ConversationClearController::__invoke
 * @see app/Http/Controllers/Widget/ConversationClearController.php:24
 * @route '/api/v1/widget/conversation/clear'
 */
        ConversationClearControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: ConversationClearController.url(options),
            method: 'post',
        })
    
    ConversationClearController.form = ConversationClearControllerForm
export default ConversationClearController