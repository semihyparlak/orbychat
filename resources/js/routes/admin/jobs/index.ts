import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import failedDcbaf2 from './failed'
/**
* @see \App\Http\Controllers\Admin\Platform\JobController::failed
 * @see app/Http/Controllers/Admin/Platform/JobController.php:20
 * @route '/admin/jobs/failed'
 */
export const failed = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: failed.url(options),
    method: 'get',
})

failed.definition = {
    methods: ["get","head"],
    url: '/admin/jobs/failed',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\JobController::failed
 * @see app/Http/Controllers/Admin/Platform/JobController.php:20
 * @route '/admin/jobs/failed'
 */
failed.url = (options?: RouteQueryOptions) => {
    return failed.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\JobController::failed
 * @see app/Http/Controllers/Admin/Platform/JobController.php:20
 * @route '/admin/jobs/failed'
 */
failed.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: failed.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\JobController::failed
 * @see app/Http/Controllers/Admin/Platform/JobController.php:20
 * @route '/admin/jobs/failed'
 */
failed.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: failed.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\JobController::failed
 * @see app/Http/Controllers/Admin/Platform/JobController.php:20
 * @route '/admin/jobs/failed'
 */
    const failedForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: failed.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\JobController::failed
 * @see app/Http/Controllers/Admin/Platform/JobController.php:20
 * @route '/admin/jobs/failed'
 */
        failedForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: failed.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\JobController::failed
 * @see app/Http/Controllers/Admin/Platform/JobController.php:20
 * @route '/admin/jobs/failed'
 */
        failedForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: failed.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    failed.form = failedForm
const jobs = {
    failed: Object.assign(failed, failedDcbaf2),
}

export default jobs