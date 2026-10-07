import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Billing\CheckoutController::__invoke
 * @see app/Http/Controllers/Billing/CheckoutController.php:51
 * @route '/billing/checkout'
 */
const CheckoutController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: CheckoutController.url(options),
    method: 'post',
})

CheckoutController.definition = {
    methods: ["post"],
    url: '/billing/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Billing\CheckoutController::__invoke
 * @see app/Http/Controllers/Billing/CheckoutController.php:51
 * @route '/billing/checkout'
 */
CheckoutController.url = (options?: RouteQueryOptions) => {
    return CheckoutController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Billing\CheckoutController::__invoke
 * @see app/Http/Controllers/Billing/CheckoutController.php:51
 * @route '/billing/checkout'
 */
CheckoutController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: CheckoutController.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Billing\CheckoutController::__invoke
 * @see app/Http/Controllers/Billing/CheckoutController.php:51
 * @route '/billing/checkout'
 */
    const CheckoutControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: CheckoutController.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Billing\CheckoutController::__invoke
 * @see app/Http/Controllers/Billing/CheckoutController.php:51
 * @route '/billing/checkout'
 */
        CheckoutControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: CheckoutController.url(options),
            method: 'post',
        })
    
    CheckoutController.form = CheckoutControllerForm
export default CheckoutController