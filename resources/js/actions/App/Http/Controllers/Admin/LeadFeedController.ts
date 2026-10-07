import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\LeadFeedController::__invoke
 * @see app/Http/Controllers/Admin/LeadFeedController.php:28
 * @route '/app/leads/feed'
 */
const LeadFeedController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: LeadFeedController.url(options),
    method: 'get',
})

LeadFeedController.definition = {
    methods: ["get","head"],
    url: '/app/leads/feed',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LeadFeedController::__invoke
 * @see app/Http/Controllers/Admin/LeadFeedController.php:28
 * @route '/app/leads/feed'
 */
LeadFeedController.url = (options?: RouteQueryOptions) => {
    return LeadFeedController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LeadFeedController::__invoke
 * @see app/Http/Controllers/Admin/LeadFeedController.php:28
 * @route '/app/leads/feed'
 */
LeadFeedController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: LeadFeedController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\LeadFeedController::__invoke
 * @see app/Http/Controllers/Admin/LeadFeedController.php:28
 * @route '/app/leads/feed'
 */
LeadFeedController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: LeadFeedController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\LeadFeedController::__invoke
 * @see app/Http/Controllers/Admin/LeadFeedController.php:28
 * @route '/app/leads/feed'
 */
    const LeadFeedControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: LeadFeedController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\LeadFeedController::__invoke
 * @see app/Http/Controllers/Admin/LeadFeedController.php:28
 * @route '/app/leads/feed'
 */
        LeadFeedControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: LeadFeedController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\LeadFeedController::__invoke
 * @see app/Http/Controllers/Admin/LeadFeedController.php:28
 * @route '/app/leads/feed'
 */
        LeadFeedControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: LeadFeedController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    LeadFeedController.form = LeadFeedControllerForm
export default LeadFeedController