import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\WidgetController::edit
 * @see app/Http/Controllers/Settings/WidgetController.php:68
 * @route '/settings/widget-defaults'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/widget-defaults',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\WidgetController::edit
 * @see app/Http/Controllers/Settings/WidgetController.php:68
 * @route '/settings/widget-defaults'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\WidgetController::edit
 * @see app/Http/Controllers/Settings/WidgetController.php:68
 * @route '/settings/widget-defaults'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\WidgetController::edit
 * @see app/Http/Controllers/Settings/WidgetController.php:68
 * @route '/settings/widget-defaults'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\WidgetController::edit
 * @see app/Http/Controllers/Settings/WidgetController.php:68
 * @route '/settings/widget-defaults'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\WidgetController::edit
 * @see app/Http/Controllers/Settings/WidgetController.php:68
 * @route '/settings/widget-defaults'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\WidgetController::edit
 * @see app/Http/Controllers/Settings/WidgetController.php:68
 * @route '/settings/widget-defaults'
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
 * @see app/Http/Controllers/Settings/WidgetController.php:85
 * @route '/settings/widget-defaults'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/widget-defaults',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Settings\WidgetController::update
 * @see app/Http/Controllers/Settings/WidgetController.php:85
 * @route '/settings/widget-defaults'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\WidgetController::update
 * @see app/Http/Controllers/Settings/WidgetController.php:85
 * @route '/settings/widget-defaults'
 */
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Settings\WidgetController::update
 * @see app/Http/Controllers/Settings/WidgetController.php:85
 * @route '/settings/widget-defaults'
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
 * @see app/Http/Controllers/Settings/WidgetController.php:85
 * @route '/settings/widget-defaults'
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
const platform = {
    edit: Object.assign(edit, edit),
update: Object.assign(update, update),
}

export default platform