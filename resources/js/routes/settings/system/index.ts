import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import test from './test'
import cronWorker from './cron-worker'
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
const system = {
    index: Object.assign(index, index),
update: Object.assign(update, update),
test: Object.assign(test, test),
cronWorker: Object.assign(cronWorker, cronWorker),
}

export default system