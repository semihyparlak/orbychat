import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\LeadFeedController::__invoke
 * @see app/Http/Controllers/Admin/LeadFeedController.php:28
 * @route '/app/leads/feed'
 */
export const feed = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feed.url(options),
    method: 'get',
})

feed.definition = {
    methods: ["get","head"],
    url: '/app/leads/feed',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LeadFeedController::__invoke
 * @see app/Http/Controllers/Admin/LeadFeedController.php:28
 * @route '/app/leads/feed'
 */
feed.url = (options?: RouteQueryOptions) => {
    return feed.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LeadFeedController::__invoke
 * @see app/Http/Controllers/Admin/LeadFeedController.php:28
 * @route '/app/leads/feed'
 */
feed.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: feed.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\LeadFeedController::__invoke
 * @see app/Http/Controllers/Admin/LeadFeedController.php:28
 * @route '/app/leads/feed'
 */
feed.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: feed.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\LeadFeedController::__invoke
 * @see app/Http/Controllers/Admin/LeadFeedController.php:28
 * @route '/app/leads/feed'
 */
    const feedForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: feed.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\LeadFeedController::__invoke
 * @see app/Http/Controllers/Admin/LeadFeedController.php:28
 * @route '/app/leads/feed'
 */
        feedForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: feed.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\LeadFeedController::__invoke
 * @see app/Http/Controllers/Admin/LeadFeedController.php:28
 * @route '/app/leads/feed'
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
const leads = {
    feed: Object.assign(feed, feed),
}

export default leads