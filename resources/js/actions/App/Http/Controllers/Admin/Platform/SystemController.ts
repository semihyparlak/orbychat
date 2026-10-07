import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::index
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:51
 * @route '/settings/system'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/settings/system',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::index
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:51
 * @route '/settings/system'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::index
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:51
 * @route '/settings/system'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::index
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:51
 * @route '/settings/system'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::index
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:51
 * @route '/settings/system'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::index
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:51
 * @route '/settings/system'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::index
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:51
 * @route '/settings/system'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::branding
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:56
 * @route '/settings/branding'
 */
export const branding = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: branding.url(options),
    method: 'get',
})

branding.definition = {
    methods: ["get","head"],
    url: '/settings/branding',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::branding
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:56
 * @route '/settings/branding'
 */
branding.url = (options?: RouteQueryOptions) => {
    return branding.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::branding
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:56
 * @route '/settings/branding'
 */
branding.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: branding.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::branding
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:56
 * @route '/settings/branding'
 */
branding.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: branding.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::branding
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:56
 * @route '/settings/branding'
 */
    const brandingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: branding.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::branding
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:56
 * @route '/settings/branding'
 */
        brandingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: branding.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::branding
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:56
 * @route '/settings/branding'
 */
        brandingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: branding.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    branding.form = brandingForm
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::marketing
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:61
 * @route '/settings/marketing'
 */
export const marketing = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: marketing.url(options),
    method: 'get',
})

marketing.definition = {
    methods: ["get","head"],
    url: '/settings/marketing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::marketing
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:61
 * @route '/settings/marketing'
 */
marketing.url = (options?: RouteQueryOptions) => {
    return marketing.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::marketing
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:61
 * @route '/settings/marketing'
 */
marketing.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: marketing.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::marketing
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:61
 * @route '/settings/marketing'
 */
marketing.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: marketing.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::marketing
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:61
 * @route '/settings/marketing'
 */
    const marketingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: marketing.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::marketing
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:61
 * @route '/settings/marketing'
 */
        marketingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: marketing.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::marketing
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:61
 * @route '/settings/marketing'
 */
        marketingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: marketing.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    marketing.form = marketingForm
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::privacy
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:66
 * @route '/settings/privacy'
 */
export const privacy = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: privacy.url(options),
    method: 'get',
})

privacy.definition = {
    methods: ["get","head"],
    url: '/settings/privacy',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::privacy
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:66
 * @route '/settings/privacy'
 */
privacy.url = (options?: RouteQueryOptions) => {
    return privacy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::privacy
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:66
 * @route '/settings/privacy'
 */
privacy.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: privacy.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::privacy
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:66
 * @route '/settings/privacy'
 */
privacy.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: privacy.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::privacy
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:66
 * @route '/settings/privacy'
 */
    const privacyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: privacy.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::privacy
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:66
 * @route '/settings/privacy'
 */
        privacyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: privacy.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::privacy
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:66
 * @route '/settings/privacy'
 */
        privacyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: privacy.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    privacy.form = privacyForm
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::update
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:174
 * @route '/settings/system/{section}'
 */
export const update = (args: { section: string | number } | [section: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/system/{section}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::update
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:174
 * @route '/settings/system/{section}'
 */
update.url = (args: { section: string | number } | [section: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { section: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    section: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        section: args.section,
                }

    return update.definition.url
            .replace('{section}', parsedArgs.section.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::update
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:174
 * @route '/settings/system/{section}'
 */
update.patch = (args: { section: string | number } | [section: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::update
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:174
 * @route '/settings/system/{section}'
 */
    const updateForm = (args: { section: string | number } | [section: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::update
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:174
 * @route '/settings/system/{section}'
 */
        updateForm.patch = (args: { section: string | number } | [section: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testMail
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:220
 * @route '/settings/system/test/mail'
 */
export const testMail = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testMail.url(options),
    method: 'post',
})

testMail.definition = {
    methods: ["post"],
    url: '/settings/system/test/mail',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testMail
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:220
 * @route '/settings/system/test/mail'
 */
testMail.url = (options?: RouteQueryOptions) => {
    return testMail.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testMail
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:220
 * @route '/settings/system/test/mail'
 */
testMail.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testMail.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testMail
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:220
 * @route '/settings/system/test/mail'
 */
    const testMailForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: testMail.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testMail
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:220
 * @route '/settings/system/test/mail'
 */
        testMailForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: testMail.url(options),
            method: 'post',
        })
    
    testMail.form = testMailForm
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testLeadEmail
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:253
 * @route '/settings/system/test/lead-email'
 */
export const testLeadEmail = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testLeadEmail.url(options),
    method: 'post',
})

testLeadEmail.definition = {
    methods: ["post"],
    url: '/settings/system/test/lead-email',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testLeadEmail
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:253
 * @route '/settings/system/test/lead-email'
 */
testLeadEmail.url = (options?: RouteQueryOptions) => {
    return testLeadEmail.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testLeadEmail
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:253
 * @route '/settings/system/test/lead-email'
 */
testLeadEmail.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testLeadEmail.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testLeadEmail
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:253
 * @route '/settings/system/test/lead-email'
 */
    const testLeadEmailForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: testLeadEmail.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testLeadEmail
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:253
 * @route '/settings/system/test/lead-email'
 */
        testLeadEmailForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: testLeadEmail.url(options),
            method: 'post',
        })
    
    testLeadEmail.form = testLeadEmailForm
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testStripe
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:291
 * @route '/settings/system/test/stripe'
 */
export const testStripe = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testStripe.url(options),
    method: 'post',
})

testStripe.definition = {
    methods: ["post"],
    url: '/settings/system/test/stripe',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testStripe
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:291
 * @route '/settings/system/test/stripe'
 */
testStripe.url = (options?: RouteQueryOptions) => {
    return testStripe.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testStripe
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:291
 * @route '/settings/system/test/stripe'
 */
testStripe.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testStripe.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testStripe
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:291
 * @route '/settings/system/test/stripe'
 */
    const testStripeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: testStripe.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testStripe
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:291
 * @route '/settings/system/test/stripe'
 */
        testStripeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: testStripe.url(options),
            method: 'post',
        })
    
    testStripe.form = testStripeForm
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testPayPal
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:309
 * @route '/settings/system/test/paypal'
 */
export const testPayPal = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testPayPal.url(options),
    method: 'post',
})

testPayPal.definition = {
    methods: ["post"],
    url: '/settings/system/test/paypal',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testPayPal
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:309
 * @route '/settings/system/test/paypal'
 */
testPayPal.url = (options?: RouteQueryOptions) => {
    return testPayPal.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testPayPal
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:309
 * @route '/settings/system/test/paypal'
 */
testPayPal.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testPayPal.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testPayPal
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:309
 * @route '/settings/system/test/paypal'
 */
    const testPayPalForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: testPayPal.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testPayPal
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:309
 * @route '/settings/system/test/paypal'
 */
        testPayPalForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: testPayPal.url(options),
            method: 'post',
        })
    
    testPayPal.form = testPayPalForm
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testRazorpay
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:337
 * @route '/settings/system/test/razorpay'
 */
export const testRazorpay = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testRazorpay.url(options),
    method: 'post',
})

testRazorpay.definition = {
    methods: ["post"],
    url: '/settings/system/test/razorpay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testRazorpay
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:337
 * @route '/settings/system/test/razorpay'
 */
testRazorpay.url = (options?: RouteQueryOptions) => {
    return testRazorpay.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testRazorpay
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:337
 * @route '/settings/system/test/razorpay'
 */
testRazorpay.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testRazorpay.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testRazorpay
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:337
 * @route '/settings/system/test/razorpay'
 */
    const testRazorpayForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: testRazorpay.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testRazorpay
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:337
 * @route '/settings/system/test/razorpay'
 */
        testRazorpayForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: testRazorpay.url(options),
            method: 'post',
        })
    
    testRazorpay.form = testRazorpayForm
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testLlm
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:364
 * @route '/settings/system/test/llm'
 */
export const testLlm = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testLlm.url(options),
    method: 'post',
})

testLlm.definition = {
    methods: ["post"],
    url: '/settings/system/test/llm',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testLlm
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:364
 * @route '/settings/system/test/llm'
 */
testLlm.url = (options?: RouteQueryOptions) => {
    return testLlm.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testLlm
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:364
 * @route '/settings/system/test/llm'
 */
testLlm.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testLlm.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testLlm
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:364
 * @route '/settings/system/test/llm'
 */
    const testLlmForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: testLlm.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testLlm
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:364
 * @route '/settings/system/test/llm'
 */
        testLlmForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: testLlm.url(options),
            method: 'post',
        })
    
    testLlm.form = testLlmForm
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testEmbed
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:393
 * @route '/settings/system/test/embed'
 */
export const testEmbed = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testEmbed.url(options),
    method: 'post',
})

testEmbed.definition = {
    methods: ["post"],
    url: '/settings/system/test/embed',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testEmbed
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:393
 * @route '/settings/system/test/embed'
 */
testEmbed.url = (options?: RouteQueryOptions) => {
    return testEmbed.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testEmbed
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:393
 * @route '/settings/system/test/embed'
 */
testEmbed.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testEmbed.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testEmbed
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:393
 * @route '/settings/system/test/embed'
 */
    const testEmbedForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: testEmbed.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testEmbed
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:393
 * @route '/settings/system/test/embed'
 */
        testEmbedForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: testEmbed.url(options),
            method: 'post',
        })
    
    testEmbed.form = testEmbedForm
/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testCache
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:409
 * @route '/settings/system/test/cache'
 */
export const testCache = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testCache.url(options),
    method: 'post',
})

testCache.definition = {
    methods: ["post"],
    url: '/settings/system/test/cache',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testCache
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:409
 * @route '/settings/system/test/cache'
 */
testCache.url = (options?: RouteQueryOptions) => {
    return testCache.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testCache
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:409
 * @route '/settings/system/test/cache'
 */
testCache.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testCache.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testCache
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:409
 * @route '/settings/system/test/cache'
 */
    const testCacheForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: testCache.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SystemController::testCache
 * @see app/Http/Controllers/Admin/Platform/SystemController.php:409
 * @route '/settings/system/test/cache'
 */
        testCacheForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: testCache.url(options),
            method: 'post',
        })
    
    testCache.form = testCacheForm
const SystemController = { index, branding, marketing, privacy, update, testMail, testLeadEmail, testStripe, testPayPal, testRazorpay, testLlm, testEmbed, testCache }

export default SystemController