import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import platform from './platform'
/**
* @see \App\Http\Controllers\Settings\WidgetController::edit
 * @see app/Http/Controllers/Settings/WidgetController.php:35
 * @route '/settings/widget'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/widget',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\WidgetController::edit
 * @see app/Http/Controllers/Settings/WidgetController.php:35
 * @route '/settings/widget'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\WidgetController::edit
 * @see app/Http/Controllers/Settings/WidgetController.php:35
 * @route '/settings/widget'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\WidgetController::edit
 * @see app/Http/Controllers/Settings/WidgetController.php:35
 * @route '/settings/widget'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\WidgetController::edit
 * @see app/Http/Controllers/Settings/WidgetController.php:35
 * @route '/settings/widget'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\WidgetController::edit
 * @see app/Http/Controllers/Settings/WidgetController.php:35
 * @route '/settings/widget'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\WidgetController::edit
 * @see app/Http/Controllers/Settings/WidgetController.php:35
 * @route '/settings/widget'
 */
        editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Settings\WidgetController::update
 * @see app/Http/Controllers/Settings/WidgetController.php:53
 * @route '/settings/widget'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/widget',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\WidgetController::update
 * @see app/Http/Controllers/Settings/WidgetController.php:53
 * @route '/settings/widget'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\WidgetController::update
 * @see app/Http/Controllers/Settings/WidgetController.php:53
 * @route '/settings/widget'
 */
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Settings\WidgetController::update
 * @see app/Http/Controllers/Settings/WidgetController.php:53
 * @route '/settings/widget'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\WidgetController::update
 * @see app/Http/Controllers/Settings/WidgetController.php:53
 * @route '/settings/widget'
 */
        updateForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Settings\WidgetController::applyToAll
 * @see app/Http/Controllers/Settings/WidgetController.php:101
 * @route '/settings/widget/apply-to-all'
 */
export const applyToAll = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: applyToAll.url(options),
    method: 'post',
})

applyToAll.definition = {
    methods: ["post"],
    url: '/settings/widget/apply-to-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\WidgetController::applyToAll
 * @see app/Http/Controllers/Settings/WidgetController.php:101
 * @route '/settings/widget/apply-to-all'
 */
applyToAll.url = (options?: RouteQueryOptions) => {
    return applyToAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\WidgetController::applyToAll
 * @see app/Http/Controllers/Settings/WidgetController.php:101
 * @route '/settings/widget/apply-to-all'
 */
applyToAll.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: applyToAll.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\WidgetController::applyToAll
 * @see app/Http/Controllers/Settings/WidgetController.php:101
 * @route '/settings/widget/apply-to-all'
 */
    const applyToAllForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: applyToAll.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\WidgetController::applyToAll
 * @see app/Http/Controllers/Settings/WidgetController.php:101
 * @route '/settings/widget/apply-to-all'
 */
        applyToAllForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: applyToAll.url(options),
            method: 'post',
        })
    
    applyToAll.form = applyToAllForm
const widget = {
    edit: Object.assign(edit, edit),
update: Object.assign(update, update),
applyToAll: Object.assign(applyToAll, applyToAll),
platform: Object.assign(platform, platform),
}

export default widget