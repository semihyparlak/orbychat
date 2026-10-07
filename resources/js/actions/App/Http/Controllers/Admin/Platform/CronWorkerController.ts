import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Platform\CronWorkerController::deploy
 * @see app/Http/Controllers/Admin/Platform/CronWorkerController.php:28
 * @route '/settings/system/cron-worker/deploy'
 */
export const deploy = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deploy.url(options),
    method: 'post',
})

deploy.definition = {
    methods: ["post"],
    url: '/settings/system/cron-worker/deploy',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\CronWorkerController::deploy
 * @see app/Http/Controllers/Admin/Platform/CronWorkerController.php:28
 * @route '/settings/system/cron-worker/deploy'
 */
deploy.url = (options?: RouteQueryOptions) => {
    return deploy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\CronWorkerController::deploy
 * @see app/Http/Controllers/Admin/Platform/CronWorkerController.php:28
 * @route '/settings/system/cron-worker/deploy'
 */
deploy.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: deploy.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\CronWorkerController::deploy
 * @see app/Http/Controllers/Admin/Platform/CronWorkerController.php:28
 * @route '/settings/system/cron-worker/deploy'
 */
    const deployForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deploy.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\CronWorkerController::deploy
 * @see app/Http/Controllers/Admin/Platform/CronWorkerController.php:28
 * @route '/settings/system/cron-worker/deploy'
 */
        deployForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deploy.url(options),
            method: 'post',
        })
    
    deploy.form = deployForm
/**
* @see \App\Http\Controllers\Admin\Platform\CronWorkerController::status
 * @see app/Http/Controllers/Admin/Platform/CronWorkerController.php:109
 * @route '/settings/system/cron-worker/status'
 */
export const status = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/settings/system/cron-worker/status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\CronWorkerController::status
 * @see app/Http/Controllers/Admin/Platform/CronWorkerController.php:109
 * @route '/settings/system/cron-worker/status'
 */
status.url = (options?: RouteQueryOptions) => {
    return status.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\CronWorkerController::status
 * @see app/Http/Controllers/Admin/Platform/CronWorkerController.php:109
 * @route '/settings/system/cron-worker/status'
 */
status.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\CronWorkerController::status
 * @see app/Http/Controllers/Admin/Platform/CronWorkerController.php:109
 * @route '/settings/system/cron-worker/status'
 */
status.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\CronWorkerController::status
 * @see app/Http/Controllers/Admin/Platform/CronWorkerController.php:109
 * @route '/settings/system/cron-worker/status'
 */
    const statusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: status.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\CronWorkerController::status
 * @see app/Http/Controllers/Admin/Platform/CronWorkerController.php:109
 * @route '/settings/system/cron-worker/status'
 */
        statusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: status.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\CronWorkerController::status
 * @see app/Http/Controllers/Admin/Platform/CronWorkerController.php:109
 * @route '/settings/system/cron-worker/status'
 */
        statusForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: status.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    status.form = statusForm
/**
* @see \App\Http\Controllers\Admin\Platform\CronWorkerController::destroy
 * @see app/Http/Controllers/Admin/Platform/CronWorkerController.php:226
 * @route '/settings/system/cron-worker'
 */
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/system/cron-worker',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Platform\CronWorkerController::destroy
 * @see app/Http/Controllers/Admin/Platform/CronWorkerController.php:226
 * @route '/settings/system/cron-worker'
 */
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\CronWorkerController::destroy
 * @see app/Http/Controllers/Admin/Platform/CronWorkerController.php:226
 * @route '/settings/system/cron-worker'
 */
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\CronWorkerController::destroy
 * @see app/Http/Controllers/Admin/Platform/CronWorkerController.php:226
 * @route '/settings/system/cron-worker'
 */
    const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\CronWorkerController::destroy
 * @see app/Http/Controllers/Admin/Platform/CronWorkerController.php:226
 * @route '/settings/system/cron-worker'
 */
        destroyForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const CronWorkerController = { deploy, status, destroy }

export default CronWorkerController