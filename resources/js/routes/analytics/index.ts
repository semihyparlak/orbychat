import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AnalyticsController::overview
 * @see app/Http/Controllers/Admin/AnalyticsController.php:21
 * @route '/app/analytics'
 */
export const overview = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overview.url(options),
    method: 'get',
})

overview.definition = {
    methods: ["get","head"],
    url: '/app/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AnalyticsController::overview
 * @see app/Http/Controllers/Admin/AnalyticsController.php:21
 * @route '/app/analytics'
 */
overview.url = (options?: RouteQueryOptions) => {
    return overview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AnalyticsController::overview
 * @see app/Http/Controllers/Admin/AnalyticsController.php:21
 * @route '/app/analytics'
 */
overview.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overview.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AnalyticsController::overview
 * @see app/Http/Controllers/Admin/AnalyticsController.php:21
 * @route '/app/analytics'
 */
overview.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: overview.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AnalyticsController::overview
 * @see app/Http/Controllers/Admin/AnalyticsController.php:21
 * @route '/app/analytics'
 */
    const overviewForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: overview.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AnalyticsController::overview
 * @see app/Http/Controllers/Admin/AnalyticsController.php:21
 * @route '/app/analytics'
 */
        overviewForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: overview.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AnalyticsController::overview
 * @see app/Http/Controllers/Admin/AnalyticsController.php:21
 * @route '/app/analytics'
 */
        overviewForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: overview.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    overview.form = overviewForm
/**
* @see \App\Http\Controllers\Admin\AnalyticsController::contentGaps
 * @see app/Http/Controllers/Admin/AnalyticsController.php:248
 * @route '/app/analytics/content-gaps'
 */
export const contentGaps = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contentGaps.url(options),
    method: 'get',
})

contentGaps.definition = {
    methods: ["get","head"],
    url: '/app/analytics/content-gaps',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AnalyticsController::contentGaps
 * @see app/Http/Controllers/Admin/AnalyticsController.php:248
 * @route '/app/analytics/content-gaps'
 */
contentGaps.url = (options?: RouteQueryOptions) => {
    return contentGaps.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AnalyticsController::contentGaps
 * @see app/Http/Controllers/Admin/AnalyticsController.php:248
 * @route '/app/analytics/content-gaps'
 */
contentGaps.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contentGaps.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AnalyticsController::contentGaps
 * @see app/Http/Controllers/Admin/AnalyticsController.php:248
 * @route '/app/analytics/content-gaps'
 */
contentGaps.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: contentGaps.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AnalyticsController::contentGaps
 * @see app/Http/Controllers/Admin/AnalyticsController.php:248
 * @route '/app/analytics/content-gaps'
 */
    const contentGapsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: contentGaps.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AnalyticsController::contentGaps
 * @see app/Http/Controllers/Admin/AnalyticsController.php:248
 * @route '/app/analytics/content-gaps'
 */
        contentGapsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contentGaps.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AnalyticsController::contentGaps
 * @see app/Http/Controllers/Admin/AnalyticsController.php:248
 * @route '/app/analytics/content-gaps'
 */
        contentGapsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: contentGaps.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    contentGaps.form = contentGapsForm
const analytics = {
    overview: Object.assign(overview, overview),
contentGaps: Object.assign(contentGaps, contentGaps),
}

export default analytics