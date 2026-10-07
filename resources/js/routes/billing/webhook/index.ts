import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Billing\PayPalWebhookController::__invoke
 * @see app/Http/Controllers/Billing/PayPalWebhookController.php:47
 * @route '/billing/webhook/paypal'
 */
export const paypal = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: paypal.url(options),
    method: 'post',
})

paypal.definition = {
    methods: ["post"],
    url: '/billing/webhook/paypal',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Billing\PayPalWebhookController::__invoke
 * @see app/Http/Controllers/Billing/PayPalWebhookController.php:47
 * @route '/billing/webhook/paypal'
 */
paypal.url = (options?: RouteQueryOptions) => {
    return paypal.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Billing\PayPalWebhookController::__invoke
 * @see app/Http/Controllers/Billing/PayPalWebhookController.php:47
 * @route '/billing/webhook/paypal'
 */
paypal.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: paypal.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Billing\PayPalWebhookController::__invoke
 * @see app/Http/Controllers/Billing/PayPalWebhookController.php:47
 * @route '/billing/webhook/paypal'
 */
    const paypalForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: paypal.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Billing\PayPalWebhookController::__invoke
 * @see app/Http/Controllers/Billing/PayPalWebhookController.php:47
 * @route '/billing/webhook/paypal'
 */
        paypalForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: paypal.url(options),
            method: 'post',
        })
    
    paypal.form = paypalForm
/**
* @see \App\Http\Controllers\Billing\RazorpayWebhookController::__invoke
 * @see app/Http/Controllers/Billing/RazorpayWebhookController.php:43
 * @route '/billing/webhook/razorpay'
 */
export const razorpay = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: razorpay.url(options),
    method: 'post',
})

razorpay.definition = {
    methods: ["post"],
    url: '/billing/webhook/razorpay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Billing\RazorpayWebhookController::__invoke
 * @see app/Http/Controllers/Billing/RazorpayWebhookController.php:43
 * @route '/billing/webhook/razorpay'
 */
razorpay.url = (options?: RouteQueryOptions) => {
    return razorpay.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Billing\RazorpayWebhookController::__invoke
 * @see app/Http/Controllers/Billing/RazorpayWebhookController.php:43
 * @route '/billing/webhook/razorpay'
 */
razorpay.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: razorpay.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Billing\RazorpayWebhookController::__invoke
 * @see app/Http/Controllers/Billing/RazorpayWebhookController.php:43
 * @route '/billing/webhook/razorpay'
 */
    const razorpayForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: razorpay.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Billing\RazorpayWebhookController::__invoke
 * @see app/Http/Controllers/Billing/RazorpayWebhookController.php:43
 * @route '/billing/webhook/razorpay'
 */
        razorpayForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: razorpay.url(options),
            method: 'post',
        })
    
    razorpay.form = razorpayForm
const webhook = {
    paypal: Object.assign(paypal, paypal),
razorpay: Object.assign(razorpay, razorpay),
}

export default webhook