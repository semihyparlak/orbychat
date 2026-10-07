import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Platform\JobController::show
 * @see app/Http/Controllers/Admin/Platform/JobController.php:50
 * @route '/admin/jobs/failed/{uuid}'
 */
export const show = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/jobs/failed/{uuid}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\JobController::show
 * @see app/Http/Controllers/Admin/Platform/JobController.php:50
 * @route '/admin/jobs/failed/{uuid}'
 */
show.url = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { uuid: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    uuid: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        uuid: args.uuid,
                }

    return show.definition.url
            .replace('{uuid}', parsedArgs.uuid.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\JobController::show
 * @see app/Http/Controllers/Admin/Platform/JobController.php:50
 * @route '/admin/jobs/failed/{uuid}'
 */
show.get = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\JobController::show
 * @see app/Http/Controllers/Admin/Platform/JobController.php:50
 * @route '/admin/jobs/failed/{uuid}'
 */
show.head = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\JobController::show
 * @see app/Http/Controllers/Admin/Platform/JobController.php:50
 * @route '/admin/jobs/failed/{uuid}'
 */
    const showForm = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\JobController::show
 * @see app/Http/Controllers/Admin/Platform/JobController.php:50
 * @route '/admin/jobs/failed/{uuid}'
 */
        showForm.get = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\JobController::show
 * @see app/Http/Controllers/Admin/Platform/JobController.php:50
 * @route '/admin/jobs/failed/{uuid}'
 */
        showForm.head = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Admin\Platform\JobController::retry
 * @see app/Http/Controllers/Admin/Platform/JobController.php:72
 * @route '/admin/jobs/failed/{uuid}/retry'
 */
export const retry = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

retry.definition = {
    methods: ["post"],
    url: '/admin/jobs/failed/{uuid}/retry',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\JobController::retry
 * @see app/Http/Controllers/Admin/Platform/JobController.php:72
 * @route '/admin/jobs/failed/{uuid}/retry'
 */
retry.url = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { uuid: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    uuid: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        uuid: args.uuid,
                }

    return retry.definition.url
            .replace('{uuid}', parsedArgs.uuid.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\JobController::retry
 * @see app/Http/Controllers/Admin/Platform/JobController.php:72
 * @route '/admin/jobs/failed/{uuid}/retry'
 */
retry.post = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\JobController::retry
 * @see app/Http/Controllers/Admin/Platform/JobController.php:72
 * @route '/admin/jobs/failed/{uuid}/retry'
 */
    const retryForm = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: retry.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\JobController::retry
 * @see app/Http/Controllers/Admin/Platform/JobController.php:72
 * @route '/admin/jobs/failed/{uuid}/retry'
 */
        retryForm.post = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: retry.url(args, options),
            method: 'post',
        })
    
    retry.form = retryForm
/**
* @see \App\Http\Controllers\Admin\Platform\JobController::forget
 * @see app/Http/Controllers/Admin/Platform/JobController.php:86
 * @route '/admin/jobs/failed/{uuid}/forget'
 */
export const forget = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: forget.url(args, options),
    method: 'post',
})

forget.definition = {
    methods: ["post"],
    url: '/admin/jobs/failed/{uuid}/forget',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\JobController::forget
 * @see app/Http/Controllers/Admin/Platform/JobController.php:86
 * @route '/admin/jobs/failed/{uuid}/forget'
 */
forget.url = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { uuid: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    uuid: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        uuid: args.uuid,
                }

    return forget.definition.url
            .replace('{uuid}', parsedArgs.uuid.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\JobController::forget
 * @see app/Http/Controllers/Admin/Platform/JobController.php:86
 * @route '/admin/jobs/failed/{uuid}/forget'
 */
forget.post = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: forget.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\JobController::forget
 * @see app/Http/Controllers/Admin/Platform/JobController.php:86
 * @route '/admin/jobs/failed/{uuid}/forget'
 */
    const forgetForm = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: forget.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\JobController::forget
 * @see app/Http/Controllers/Admin/Platform/JobController.php:86
 * @route '/admin/jobs/failed/{uuid}/forget'
 */
        forgetForm.post = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: forget.url(args, options),
            method: 'post',
        })
    
    forget.form = forgetForm
/**
* @see \App\Http\Controllers\Admin\Platform\JobController::retryAll
 * @see app/Http/Controllers/Admin/Platform/JobController.php:79
 * @route '/admin/jobs/failed/retry-all'
 */
export const retryAll = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryAll.url(options),
    method: 'post',
})

retryAll.definition = {
    methods: ["post"],
    url: '/admin/jobs/failed/retry-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\JobController::retryAll
 * @see app/Http/Controllers/Admin/Platform/JobController.php:79
 * @route '/admin/jobs/failed/retry-all'
 */
retryAll.url = (options?: RouteQueryOptions) => {
    return retryAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\JobController::retryAll
 * @see app/Http/Controllers/Admin/Platform/JobController.php:79
 * @route '/admin/jobs/failed/retry-all'
 */
retryAll.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryAll.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\JobController::retryAll
 * @see app/Http/Controllers/Admin/Platform/JobController.php:79
 * @route '/admin/jobs/failed/retry-all'
 */
    const retryAllForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: retryAll.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\JobController::retryAll
 * @see app/Http/Controllers/Admin/Platform/JobController.php:79
 * @route '/admin/jobs/failed/retry-all'
 */
        retryAllForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: retryAll.url(options),
            method: 'post',
        })
    
    retryAll.form = retryAllForm
/**
* @see \App\Http\Controllers\Admin\Platform\JobController::flush
 * @see app/Http/Controllers/Admin/Platform/JobController.php:93
 * @route '/admin/jobs/failed/flush'
 */
export const flush = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: flush.url(options),
    method: 'post',
})

flush.definition = {
    methods: ["post"],
    url: '/admin/jobs/failed/flush',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\JobController::flush
 * @see app/Http/Controllers/Admin/Platform/JobController.php:93
 * @route '/admin/jobs/failed/flush'
 */
flush.url = (options?: RouteQueryOptions) => {
    return flush.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\JobController::flush
 * @see app/Http/Controllers/Admin/Platform/JobController.php:93
 * @route '/admin/jobs/failed/flush'
 */
flush.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: flush.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\JobController::flush
 * @see app/Http/Controllers/Admin/Platform/JobController.php:93
 * @route '/admin/jobs/failed/flush'
 */
    const flushForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: flush.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\JobController::flush
 * @see app/Http/Controllers/Admin/Platform/JobController.php:93
 * @route '/admin/jobs/failed/flush'
 */
        flushForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: flush.url(options),
            method: 'post',
        })
    
    flush.form = flushForm
const failed = {
    show: Object.assign(show, show),
retry: Object.assign(retry, retry),
forget: Object.assign(forget, forget),
retryAll: Object.assign(retryAll, retryAll),
flush: Object.assign(flush, flush),
}

export default failed