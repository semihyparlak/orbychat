import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import webhookB2f11f from './webhook'
/**
* @see \App\Http\Controllers\Billing\WebhookController::webhook
 * @see app/Http/Controllers/Billing/WebhookController.php:40
 * @route '/billing/webhook'
 */
export const webhook = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: webhook.url(options),
    method: 'post',
})

webhook.definition = {
    methods: ["post"],
    url: '/billing/webhook',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Billing\WebhookController::webhook
 * @see app/Http/Controllers/Billing/WebhookController.php:40
 * @route '/billing/webhook'
 */
webhook.url = (options?: RouteQueryOptions) => {
    return webhook.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Billing\WebhookController::webhook
 * @see app/Http/Controllers/Billing/WebhookController.php:40
 * @route '/billing/webhook'
 */
webhook.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: webhook.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Billing\WebhookController::webhook
 * @see app/Http/Controllers/Billing/WebhookController.php:40
 * @route '/billing/webhook'
 */
    const webhookForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: webhook.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Billing\WebhookController::webhook
 * @see app/Http/Controllers/Billing/WebhookController.php:40
 * @route '/billing/webhook'
 */
        webhookForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: webhook.url(options),
            method: 'post',
        })
    
    webhook.form = webhookForm
/**
* @see \App\Http\Controllers\Admin\BillingController::show
 * @see app/Http/Controllers/Admin/BillingController.php:28
 * @route '/app/billing'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/app/billing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BillingController::show
 * @see app/Http/Controllers/Admin/BillingController.php:28
 * @route '/app/billing'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BillingController::show
 * @see app/Http/Controllers/Admin/BillingController.php:28
 * @route '/app/billing'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BillingController::show
 * @see app/Http/Controllers/Admin/BillingController.php:28
 * @route '/app/billing'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\BillingController::show
 * @see app/Http/Controllers/Admin/BillingController.php:28
 * @route '/app/billing'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\BillingController::show
 * @see app/Http/Controllers/Admin/BillingController.php:28
 * @route '/app/billing'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\BillingController::show
 * @see app/Http/Controllers/Admin/BillingController.php:28
 * @route '/app/billing'
 */
        showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Billing\CheckoutController::__invoke
 * @see app/Http/Controllers/Billing/CheckoutController.php:51
 * @route '/billing/checkout'
 */
export const checkout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

checkout.definition = {
    methods: ["post"],
    url: '/billing/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Billing\CheckoutController::__invoke
 * @see app/Http/Controllers/Billing/CheckoutController.php:51
 * @route '/billing/checkout'
 */
checkout.url = (options?: RouteQueryOptions) => {
    return checkout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Billing\CheckoutController::__invoke
 * @see app/Http/Controllers/Billing/CheckoutController.php:51
 * @route '/billing/checkout'
 */
checkout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Billing\CheckoutController::__invoke
 * @see app/Http/Controllers/Billing/CheckoutController.php:51
 * @route '/billing/checkout'
 */
    const checkoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Billing\CheckoutController::__invoke
 * @see app/Http/Controllers/Billing/CheckoutController.php:51
 * @route '/billing/checkout'
 */
        checkoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkout.url(options),
            method: 'post',
        })
    
    checkout.form = checkoutForm
/**
* @see \App\Http\Controllers\Admin\BillingController::portal
 * @see app/Http/Controllers/Admin/BillingController.php:96
 * @route '/billing/portal'
 */
export const portal = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: portal.url(options),
    method: 'get',
})

portal.definition = {
    methods: ["get","head"],
    url: '/billing/portal',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BillingController::portal
 * @see app/Http/Controllers/Admin/BillingController.php:96
 * @route '/billing/portal'
 */
portal.url = (options?: RouteQueryOptions) => {
    return portal.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BillingController::portal
 * @see app/Http/Controllers/Admin/BillingController.php:96
 * @route '/billing/portal'
 */
portal.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: portal.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BillingController::portal
 * @see app/Http/Controllers/Admin/BillingController.php:96
 * @route '/billing/portal'
 */
portal.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: portal.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\BillingController::portal
 * @see app/Http/Controllers/Admin/BillingController.php:96
 * @route '/billing/portal'
 */
    const portalForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: portal.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\BillingController::portal
 * @see app/Http/Controllers/Admin/BillingController.php:96
 * @route '/billing/portal'
 */
        portalForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: portal.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\BillingController::portal
 * @see app/Http/Controllers/Admin/BillingController.php:96
 * @route '/billing/portal'
 */
        portalForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: portal.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    portal.form = portalForm
const billing = {
    webhook: Object.assign(webhook, webhookB2f11f),
show: Object.assign(show, show),
checkout: Object.assign(checkout, checkout),
portal: Object.assign(portal, portal),
}

export default billing