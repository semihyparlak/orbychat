import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Billing\PayPalWebhookController::__invoke
 * @see app/Http/Controllers/Billing/PayPalWebhookController.php:47
 * @route '/billing/webhook/paypal'
 */
const PayPalWebhookController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: PayPalWebhookController.url(options),
    method: 'post',
})

PayPalWebhookController.definition = {
    methods: ["post"],
    url: '/billing/webhook/paypal',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Billing\PayPalWebhookController::__invoke
 * @see app/Http/Controllers/Billing/PayPalWebhookController.php:47
 * @route '/billing/webhook/paypal'
 */
PayPalWebhookController.url = (options?: RouteQueryOptions) => {
    return PayPalWebhookController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Billing\PayPalWebhookController::__invoke
 * @see app/Http/Controllers/Billing/PayPalWebhookController.php:47
 * @route '/billing/webhook/paypal'
 */
PayPalWebhookController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: PayPalWebhookController.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Billing\PayPalWebhookController::__invoke
 * @see app/Http/Controllers/Billing/PayPalWebhookController.php:47
 * @route '/billing/webhook/paypal'
 */
    const PayPalWebhookControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: PayPalWebhookController.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Billing\PayPalWebhookController::__invoke
 * @see app/Http/Controllers/Billing/PayPalWebhookController.php:47
 * @route '/billing/webhook/paypal'
 */
        PayPalWebhookControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: PayPalWebhookController.url(options),
            method: 'post',
        })
    
    PayPalWebhookController.form = PayPalWebhookControllerForm
export default PayPalWebhookController