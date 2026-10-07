import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
 * @see routes/web.php:73
 * @route '/locale/{locale}'
 */
export const change = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: change.url(args, options),
    method: 'get',
})

change.definition = {
    methods: ["get","head"],
    url: '/locale/{locale}',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:73
 * @route '/locale/{locale}'
 */
change.url = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { locale: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    locale: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        locale: args.locale,
                }

    return change.definition.url
            .replace('{locale}', parsedArgs.locale.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see routes/web.php:73
 * @route '/locale/{locale}'
 */
change.get = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: change.url(args, options),
    method: 'get',
})
/**
 * @see routes/web.php:73
 * @route '/locale/{locale}'
 */
change.head = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: change.url(args, options),
    method: 'head',
})

    /**
 * @see routes/web.php:73
 * @route '/locale/{locale}'
 */
    const changeForm = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: change.url(args, options),
        method: 'get',
    })

            /**
 * @see routes/web.php:73
 * @route '/locale/{locale}'
 */
        changeForm.get = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: change.url(args, options),
            method: 'get',
        })
            /**
 * @see routes/web.php:73
 * @route '/locale/{locale}'
 */
        changeForm.head = (args: { locale: string | number } | [locale: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: change.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    change.form = changeForm
const locale = {
    change: Object.assign(change, change),
}

export default locale