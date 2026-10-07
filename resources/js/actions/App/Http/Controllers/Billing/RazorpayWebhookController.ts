import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Billing\RazorpayWebhookController::__invoke
 * @see app/Http/Controllers/Billing/RazorpayWebhookController.php:43
 * @route '/billing/webhook/razorpay'
 */
const RazorpayWebhookController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: RazorpayWebhookController.url(options),
    method: 'post',
})

RazorpayWebhookController.definition = {
    methods: ["post"],
    url: '/billing/webhook/razorpay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Billing\RazorpayWebhookController::__invoke
 * @see app/Http/Controllers/Billing/RazorpayWebhookController.php:43
 * @route '/billing/webhook/razorpay'
 */
RazorpayWebhookController.url = (options?: RouteQueryOptions) => {
    return RazorpayWebhookController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Billing\RazorpayWebhookController::__invoke
 * @see app/Http/Controllers/Billing/RazorpayWebhookController.php:43
 * @route '/billing/webhook/razorpay'
 */
RazorpayWebhookController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: RazorpayWebhookController.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Billing\RazorpayWebhookController::__invoke
 * @see app/Http/Controllers/Billing/RazorpayWebhookController.php:43
 * @route '/billing/webhook/razorpay'
 */
    const RazorpayWebhookControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: RazorpayWebhookController.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Billing\RazorpayWebhookController::__invoke
 * @see app/Http/Controllers/Billing/RazorpayWebhookController.php:43
 * @route '/billing/webhook/razorpay'
 */
        RazorpayWebhookControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RazorpayWebhookController.url(options),
            method: 'post',
        })
    
    RazorpayWebhookController.form = RazorpayWebhookControllerForm
export default RazorpayWebhookController