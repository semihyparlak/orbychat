import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Billing\WebhookController::handleWebhook
 * @see app/Http/Controllers/Billing/WebhookController.php:40
 * @route '/billing/webhook'
 */
export const handleWebhook = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleWebhook.url(options),
    method: 'post',
})

handleWebhook.definition = {
    methods: ["post"],
    url: '/billing/webhook',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Billing\WebhookController::handleWebhook
 * @see app/Http/Controllers/Billing/WebhookController.php:40
 * @route '/billing/webhook'
 */
handleWebhook.url = (options?: RouteQueryOptions) => {
    return handleWebhook.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Billing\WebhookController::handleWebhook
 * @see app/Http/Controllers/Billing/WebhookController.php:40
 * @route '/billing/webhook'
 */
handleWebhook.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handleWebhook.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Billing\WebhookController::handleWebhook
 * @see app/Http/Controllers/Billing/WebhookController.php:40
 * @route '/billing/webhook'
 */
    const handleWebhookForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: handleWebhook.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Billing\WebhookController::handleWebhook
 * @see app/Http/Controllers/Billing/WebhookController.php:40
 * @route '/billing/webhook'
 */
        handleWebhookForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: handleWebhook.url(options),
            method: 'post',
        })
    
    handleWebhook.form = handleWebhookForm
const WebhookController = { handleWebhook }

export default WebhookController