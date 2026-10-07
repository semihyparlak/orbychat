import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::mail
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:220
 * @route '/settings/system/test/mail'
 */
export const mail = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: mail.url(options),
    method: 'post',
})

mail.definition = {
    methods: ["post"],
    url: '/settings/system/test/mail',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::mail
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:220
 * @route '/settings/system/test/mail'
 */
mail.url = (options?: RouteQueryOptions) => {
    return mail.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::mail
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:220
 * @route '/settings/system/test/mail'
 */
mail.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: mail.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::mail
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:220
 * @route '/settings/system/test/mail'
 */
    const mailForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: mail.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::mail
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:220
 * @route '/settings/system/test/mail'
 */
        mailForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: mail.url(options),
            method: 'post',
        })
    
    mail.form = mailForm
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::leadEmail
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:253
 * @route '/settings/system/test/lead-email'
 */
export const leadEmail = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: leadEmail.url(options),
    method: 'post',
})

leadEmail.definition = {
    methods: ["post"],
    url: '/settings/system/test/lead-email',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::leadEmail
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:253
 * @route '/settings/system/test/lead-email'
 */
leadEmail.url = (options?: RouteQueryOptions) => {
    return leadEmail.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::leadEmail
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:253
 * @route '/settings/system/test/lead-email'
 */
leadEmail.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: leadEmail.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::leadEmail
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:253
 * @route '/settings/system/test/lead-email'
 */
    const leadEmailForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: leadEmail.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::leadEmail
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:253
 * @route '/settings/system/test/lead-email'
 */
        leadEmailForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: leadEmail.url(options),
            method: 'post',
        })
    
    leadEmail.form = leadEmailForm
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::stripe
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:291
 * @route '/settings/system/test/stripe'
 */
export const stripe = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stripe.url(options),
    method: 'post',
})

stripe.definition = {
    methods: ["post"],
    url: '/settings/system/test/stripe',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::stripe
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:291
 * @route '/settings/system/test/stripe'
 */
stripe.url = (options?: RouteQueryOptions) => {
    return stripe.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::stripe
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:291
 * @route '/settings/system/test/stripe'
 */
stripe.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stripe.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::stripe
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:291
 * @route '/settings/system/test/stripe'
 */
    const stripeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: stripe.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::stripe
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:291
 * @route '/settings/system/test/stripe'
 */
        stripeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: stripe.url(options),
            method: 'post',
        })
    
    stripe.form = stripeForm
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::paypal
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:309
 * @route '/settings/system/test/paypal'
 */
export const paypal = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: paypal.url(options),
    method: 'post',
})

paypal.definition = {
    methods: ["post"],
    url: '/settings/system/test/paypal',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::paypal
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:309
 * @route '/settings/system/test/paypal'
 */
paypal.url = (options?: RouteQueryOptions) => {
    return paypal.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::paypal
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:309
 * @route '/settings/system/test/paypal'
 */
paypal.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: paypal.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::paypal
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:309
 * @route '/settings/system/test/paypal'
 */
    const paypalForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: paypal.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::paypal
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:309
 * @route '/settings/system/test/paypal'
 */
        paypalForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: paypal.url(options),
            method: 'post',
        })
    
    paypal.form = paypalForm
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::razorpay
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:337
 * @route '/settings/system/test/razorpay'
 */
export const razorpay = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: razorpay.url(options),
    method: 'post',
})

razorpay.definition = {
    methods: ["post"],
    url: '/settings/system/test/razorpay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::razorpay
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:337
 * @route '/settings/system/test/razorpay'
 */
razorpay.url = (options?: RouteQueryOptions) => {
    return razorpay.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::razorpay
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:337
 * @route '/settings/system/test/razorpay'
 */
razorpay.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: razorpay.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::razorpay
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:337
 * @route '/settings/system/test/razorpay'
 */
    const razorpayForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: razorpay.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::razorpay
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:337
 * @route '/settings/system/test/razorpay'
 */
        razorpayForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: razorpay.url(options),
            method: 'post',
        })
    
    razorpay.form = razorpayForm
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::llm
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:364
 * @route '/settings/system/test/llm'
 */
export const llm = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: llm.url(options),
    method: 'post',
})

llm.definition = {
    methods: ["post"],
    url: '/settings/system/test/llm',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::llm
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:364
 * @route '/settings/system/test/llm'
 */
llm.url = (options?: RouteQueryOptions) => {
    return llm.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::llm
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:364
 * @route '/settings/system/test/llm'
 */
llm.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: llm.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::llm
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:364
 * @route '/settings/system/test/llm'
 */
    const llmForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: llm.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::llm
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:364
 * @route '/settings/system/test/llm'
 */
        llmForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: llm.url(options),
            method: 'post',
        })
    
    llm.form = llmForm
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::embed
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:393
 * @route '/settings/system/test/embed'
 */
export const embed = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: embed.url(options),
    method: 'post',
})

embed.definition = {
    methods: ["post"],
    url: '/settings/system/test/embed',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::embed
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:393
 * @route '/settings/system/test/embed'
 */
embed.url = (options?: RouteQueryOptions) => {
    return embed.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::embed
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:393
 * @route '/settings/system/test/embed'
 */
embed.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: embed.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::embed
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:393
 * @route '/settings/system/test/embed'
 */
    const embedForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: embed.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::embed
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:393
 * @route '/settings/system/test/embed'
 */
        embedForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: embed.url(options),
            method: 'post',
        })
    
    embed.form = embedForm
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::cache
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:409
 * @route '/settings/system/test/cache'
 */
export const cache = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cache.url(options),
    method: 'post',
})

cache.definition = {
    methods: ["post"],
    url: '/settings/system/test/cache',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::cache
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:409
 * @route '/settings/system/test/cache'
 */
cache.url = (options?: RouteQueryOptions) => {
    return cache.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::cache
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:409
 * @route '/settings/system/test/cache'
 */
cache.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cache.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::cache
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:409
 * @route '/settings/system/test/cache'
 */
    const cacheForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cache.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::cache
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:409
 * @route '/settings/system/test/cache'
 */
        cacheForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cache.url(options),
            method: 'post',
        })
    
    cache.form = cacheForm
const test = {
    mail: Object.assign(mail, mail),
leadEmail: Object.assign(leadEmail, leadEmail),
stripe: Object.assign(stripe, stripe),
paypal: Object.assign(paypal, paypal),
razorpay: Object.assign(razorpay, razorpay),
llm: Object.assign(llm, llm),
embed: Object.assign(embed, embed),
cache: Object.assign(cache, cache),
}

export default test