import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ChangelogController::show
 * @see app/Http/Controllers/ChangelogController.php:26
 * @route '/changelog'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/changelog',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ChangelogController::show
 * @see app/Http/Controllers/ChangelogController.php:26
 * @route '/changelog'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ChangelogController::show
 * @see app/Http/Controllers/ChangelogController.php:26
 * @route '/changelog'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ChangelogController::show
 * @see app/Http/Controllers/ChangelogController.php:26
 * @route '/changelog'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ChangelogController::show
 * @see app/Http/Controllers/ChangelogController.php:26
 * @route '/changelog'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ChangelogController::show
 * @see app/Http/Controllers/ChangelogController.php:26
 * @route '/changelog'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ChangelogController::show
 * @see app/Http/Controllers/ChangelogController.php:26
 * @route '/changelog'
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
* @see \App\Http\Controllers\ChangelogController::feed
 * @see app/Http/Controllers/ChangelogController.php:59
 * @route '/changelog.json'
 */
export const feed = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feed.url(options),
    method: 'get',
})

feed.definition = {
    methods: ["get","head"],
    url: '/changelog.json',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ChangelogController::feed
 * @see app/Http/Controllers/ChangelogController.php:59
 * @route '/changelog.json'
 */
feed.url = (options?: RouteQueryOptions) => {
    return feed.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ChangelogController::feed
 * @see app/Http/Controllers/ChangelogController.php:59
 * @route '/changelog.json'
 */
feed.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feed.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ChangelogController::feed
 * @see app/Http/Controllers/ChangelogController.php:59
 * @route '/changelog.json'
 */
feed.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: feed.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ChangelogController::feed
 * @see app/Http/Controllers/ChangelogController.php:59
 * @route '/changelog.json'
 */
    const feedForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: feed.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ChangelogController::feed
 * @see app/Http/Controllers/ChangelogController.php:59
 * @route '/changelog.json'
 */
        feedForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: feed.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ChangelogController::feed
 * @see app/Http/Controllers/ChangelogController.php:59
 * @route '/changelog.json'
 */
        feedForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: feed.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    feed.form = feedForm
const ChangelogController = { show, feed }

export default ChangelogController