import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\MarketingController::home
 * @see app/Http/Controllers/MarketingController.php:21
 * @route '/'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MarketingController::home
 * @see app/Http/Controllers/MarketingController.php:21
 * @route '/'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarketingController::home
 * @see app/Http/Controllers/MarketingController.php:21
 * @route '/'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MarketingController::home
 * @see app/Http/Controllers/MarketingController.php:21
 * @route '/'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MarketingController::home
 * @see app/Http/Controllers/MarketingController.php:21
 * @route '/'
 */
    const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: home.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MarketingController::home
 * @see app/Http/Controllers/MarketingController.php:21
 * @route '/'
 */
        homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MarketingController::home
 * @see app/Http/Controllers/MarketingController.php:21
 * @route '/'
 */
        homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: home.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    home.form = homeForm
/**
* @see \App\Http\Controllers\MarketingController::pricing
 * @see app/Http/Controllers/MarketingController.php:36
 * @route '/pricing'
 */
export const pricing = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pricing.url(options),
    method: 'get',
})

pricing.definition = {
    methods: ["get","head"],
    url: '/pricing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MarketingController::pricing
 * @see app/Http/Controllers/MarketingController.php:36
 * @route '/pricing'
 */
pricing.url = (options?: RouteQueryOptions) => {
    return pricing.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarketingController::pricing
 * @see app/Http/Controllers/MarketingController.php:36
 * @route '/pricing'
 */
pricing.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pricing.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MarketingController::pricing
 * @see app/Http/Controllers/MarketingController.php:36
 * @route '/pricing'
 */
pricing.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pricing.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MarketingController::pricing
 * @see app/Http/Controllers/MarketingController.php:36
 * @route '/pricing'
 */
    const pricingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pricing.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MarketingController::pricing
 * @see app/Http/Controllers/MarketingController.php:36
 * @route '/pricing'
 */
        pricingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pricing.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MarketingController::pricing
 * @see app/Http/Controllers/MarketingController.php:36
 * @route '/pricing'
 */
        pricingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pricing.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pricing.form = pricingForm
/**
* @see \App\Http\Controllers\MarketingController::howItWorks
 * @see app/Http/Controllers/MarketingController.php:50
 * @route '/how-it-works'
 */
export const howItWorks = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: howItWorks.url(options),
    method: 'get',
})

howItWorks.definition = {
    methods: ["get","head"],
    url: '/how-it-works',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MarketingController::howItWorks
 * @see app/Http/Controllers/MarketingController.php:50
 * @route '/how-it-works'
 */
howItWorks.url = (options?: RouteQueryOptions) => {
    return howItWorks.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarketingController::howItWorks
 * @see app/Http/Controllers/MarketingController.php:50
 * @route '/how-it-works'
 */
howItWorks.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: howItWorks.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MarketingController::howItWorks
 * @see app/Http/Controllers/MarketingController.php:50
 * @route '/how-it-works'
 */
howItWorks.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: howItWorks.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MarketingController::howItWorks
 * @see app/Http/Controllers/MarketingController.php:50
 * @route '/how-it-works'
 */
    const howItWorksForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: howItWorks.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MarketingController::howItWorks
 * @see app/Http/Controllers/MarketingController.php:50
 * @route '/how-it-works'
 */
        howItWorksForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: howItWorks.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MarketingController::howItWorks
 * @see app/Http/Controllers/MarketingController.php:50
 * @route '/how-it-works'
 */
        howItWorksForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: howItWorks.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    howItWorks.form = howItWorksForm
/**
* @see \App\Http\Controllers\MarketingController::integrations
 * @see app/Http/Controllers/MarketingController.php:62
 * @route '/integrations'
 */
export const integrations = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: integrations.url(options),
    method: 'get',
})

integrations.definition = {
    methods: ["get","head"],
    url: '/integrations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MarketingController::integrations
 * @see app/Http/Controllers/MarketingController.php:62
 * @route '/integrations'
 */
integrations.url = (options?: RouteQueryOptions) => {
    return integrations.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarketingController::integrations
 * @see app/Http/Controllers/MarketingController.php:62
 * @route '/integrations'
 */
integrations.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: integrations.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MarketingController::integrations
 * @see app/Http/Controllers/MarketingController.php:62
 * @route '/integrations'
 */
integrations.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: integrations.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MarketingController::integrations
 * @see app/Http/Controllers/MarketingController.php:62
 * @route '/integrations'
 */
    const integrationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: integrations.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MarketingController::integrations
 * @see app/Http/Controllers/MarketingController.php:62
 * @route '/integrations'
 */
        integrationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: integrations.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MarketingController::integrations
 * @see app/Http/Controllers/MarketingController.php:62
 * @route '/integrations'
 */
        integrationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: integrations.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    integrations.form = integrationsForm
/**
* @see \App\Http\Controllers\MarketingController::privacy
 * @see app/Http/Controllers/MarketingController.php:75
 * @route '/privacy'
 */
export const privacy = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: privacy.url(options),
    method: 'get',
})

privacy.definition = {
    methods: ["get","head"],
    url: '/privacy',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MarketingController::privacy
 * @see app/Http/Controllers/MarketingController.php:75
 * @route '/privacy'
 */
privacy.url = (options?: RouteQueryOptions) => {
    return privacy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarketingController::privacy
 * @see app/Http/Controllers/MarketingController.php:75
 * @route '/privacy'
 */
privacy.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: privacy.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MarketingController::privacy
 * @see app/Http/Controllers/MarketingController.php:75
 * @route '/privacy'
 */
privacy.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: privacy.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MarketingController::privacy
 * @see app/Http/Controllers/MarketingController.php:75
 * @route '/privacy'
 */
    const privacyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: privacy.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MarketingController::privacy
 * @see app/Http/Controllers/MarketingController.php:75
 * @route '/privacy'
 */
        privacyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: privacy.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MarketingController::privacy
 * @see app/Http/Controllers/MarketingController.php:75
 * @route '/privacy'
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
* @see \App\Http\Controllers\MarketingController::terms
 * @see app/Http/Controllers/MarketingController.php:88
 * @route '/terms'
 */
export const terms = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: terms.url(options),
    method: 'get',
})

terms.definition = {
    methods: ["get","head"],
    url: '/terms',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\MarketingController::terms
 * @see app/Http/Controllers/MarketingController.php:88
 * @route '/terms'
 */
terms.url = (options?: RouteQueryOptions) => {
    return terms.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarketingController::terms
 * @see app/Http/Controllers/MarketingController.php:88
 * @route '/terms'
 */
terms.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: terms.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\MarketingController::terms
 * @see app/Http/Controllers/MarketingController.php:88
 * @route '/terms'
 */
terms.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: terms.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\MarketingController::terms
 * @see app/Http/Controllers/MarketingController.php:88
 * @route '/terms'
 */
    const termsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: terms.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\MarketingController::terms
 * @see app/Http/Controllers/MarketingController.php:88
 * @route '/terms'
 */
        termsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: terms.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\MarketingController::terms
 * @see app/Http/Controllers/MarketingController.php:88
 * @route '/terms'
 */
        termsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: terms.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    terms.form = termsForm
/**
* @see \App\Http\Controllers\MarketingController::start
 * @see app/Http/Controllers/MarketingController.php:106
 * @route '/marketing/start'
 */
export const start = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/marketing/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\MarketingController::start
 * @see app/Http/Controllers/MarketingController.php:106
 * @route '/marketing/start'
 */
start.url = (options?: RouteQueryOptions) => {
    return start.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\MarketingController::start
 * @see app/Http/Controllers/MarketingController.php:106
 * @route '/marketing/start'
 */
start.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\MarketingController::start
 * @see app/Http/Controllers/MarketingController.php:106
 * @route '/marketing/start'
 */
    const startForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: start.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\MarketingController::start
 * @see app/Http/Controllers/MarketingController.php:106
 * @route '/marketing/start'
 */
        startForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: start.url(options),
            method: 'post',
        })
    
    start.form = startForm
const MarketingController = { home, pricing, howItWorks, integrations, privacy, terms, start }

export default MarketingController