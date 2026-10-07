import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Platform\KanbanBoardController::index
 * @see app/Http/Controllers/Admin/Platform/KanbanBoardController.php:30
 * @route '/admin/board'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/board',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\KanbanBoardController::index
 * @see app/Http/Controllers/Admin/Platform/KanbanBoardController.php:30
 * @route '/admin/board'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\KanbanBoardController::index
 * @see app/Http/Controllers/Admin/Platform/KanbanBoardController.php:30
 * @route '/admin/board'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\KanbanBoardController::index
 * @see app/Http/Controllers/Admin/Platform/KanbanBoardController.php:30
 * @route '/admin/board'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\KanbanBoardController::index
 * @see app/Http/Controllers/Admin/Platform/KanbanBoardController.php:30
 * @route '/admin/board'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\KanbanBoardController::index
 * @see app/Http/Controllers/Admin/Platform/KanbanBoardController.php:30
 * @route '/admin/board'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\KanbanBoardController::index
 * @see app/Http/Controllers/Admin/Platform/KanbanBoardController.php:30
 * @route '/admin/board'
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
* @see \App\Http\Controllers\Admin\Platform\KanbanBoardController::store
 * @see app/Http/Controllers/Admin/Platform/KanbanBoardController.php:38
 * @route '/admin/board'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/board',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\KanbanBoardController::store
 * @see app/Http/Controllers/Admin/Platform/KanbanBoardController.php:38
 * @route '/admin/board'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\KanbanBoardController::store
 * @see app/Http/Controllers/Admin/Platform/KanbanBoardController.php:38
 * @route '/admin/board'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\KanbanBoardController::store
 * @see app/Http/Controllers/Admin/Platform/KanbanBoardController.php:38
 * @route '/admin/board'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\KanbanBoardController::store
 * @see app/Http/Controllers/Admin/Platform/KanbanBoardController.php:38
 * @route '/admin/board'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\Platform\KanbanBoardController::update
 * @see app/Http/Controllers/Admin/Platform/KanbanBoardController.php:63
 * @route '/admin/board/{taskId}'
 */
export const update = (args: { taskId: string | number } | [taskId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/admin/board/{taskId}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\Platform\KanbanBoardController::update
 * @see app/Http/Controllers/Admin/Platform/KanbanBoardController.php:63
 * @route '/admin/board/{taskId}'
 */
update.url = (args: { taskId: string | number } | [taskId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { taskId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    taskId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        taskId: args.taskId,
                }

    return update.definition.url
            .replace('{taskId}', parsedArgs.taskId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\KanbanBoardController::update
 * @see app/Http/Controllers/Admin/Platform/KanbanBoardController.php:63
 * @route '/admin/board/{taskId}'
 */
update.patch = (args: { taskId: string | number } | [taskId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\KanbanBoardController::update
 * @see app/Http/Controllers/Admin/Platform/KanbanBoardController.php:63
 * @route '/admin/board/{taskId}'
 */
    const updateForm = (args: { taskId: string | number } | [taskId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\KanbanBoardController::update
 * @see app/Http/Controllers/Admin/Platform/KanbanBoardController.php:63
 * @route '/admin/board/{taskId}'
 */
        updateForm.patch = (args: { taskId: string | number } | [taskId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\Platform\KanbanBoardController::destroy
 * @see app/Http/Controllers/Admin/Platform/KanbanBoardController.php:94
 * @route '/admin/board/{taskId}'
 */
export const destroy = (args: { taskId: string | number } | [taskId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/board/{taskId}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Platform\KanbanBoardController::destroy
 * @see app/Http/Controllers/Admin/Platform/KanbanBoardController.php:94
 * @route '/admin/board/{taskId}'
 */
destroy.url = (args: { taskId: string | number } | [taskId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { taskId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    taskId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        taskId: args.taskId,
                }

    return destroy.definition.url
            .replace('{taskId}', parsedArgs.taskId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\KanbanBoardController::destroy
 * @see app/Http/Controllers/Admin/Platform/KanbanBoardController.php:94
 * @route '/admin/board/{taskId}'
 */
destroy.delete = (args: { taskId: string | number } | [taskId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\KanbanBoardController::destroy
 * @see app/Http/Controllers/Admin/Platform/KanbanBoardController.php:94
 * @route '/admin/board/{taskId}'
 */
    const destroyForm = (args: { taskId: string | number } | [taskId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\KanbanBoardController::destroy
 * @see app/Http/Controllers/Admin/Platform/KanbanBoardController.php:94
 * @route '/admin/board/{taskId}'
 */
        destroyForm.delete = (args: { taskId: string | number } | [taskId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const board = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default board