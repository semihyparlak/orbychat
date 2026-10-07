import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import sync22cd6d from './sync'
/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::index
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:42
 * @route '/admin/plans'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/plans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::index
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:42
 * @route '/admin/plans'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::index
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:42
 * @route '/admin/plans'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::index
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:42
 * @route '/admin/plans'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\PlanController::index
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:42
 * @route '/admin/plans'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\PlanController::index
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:42
 * @route '/admin/plans'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\PlanController::index
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:42
 * @route '/admin/plans'
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
* @see \App\Http\Controllers\Admin\Platform\PlanController::create
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:58
 * @route '/admin/plans/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/plans/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::create
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:58
 * @route '/admin/plans/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::create
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:58
 * @route '/admin/plans/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::create
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:58
 * @route '/admin/plans/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\PlanController::create
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:58
 * @route '/admin/plans/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\PlanController::create
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:58
 * @route '/admin/plans/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\PlanController::create
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:58
 * @route '/admin/plans/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::store
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:65
 * @route '/admin/plans'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/plans',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::store
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:65
 * @route '/admin/plans'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::store
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:65
 * @route '/admin/plans'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\PlanController::store
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:65
 * @route '/admin/plans'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\PlanController::store
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:65
 * @route '/admin/plans'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::edit
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:79
 * @route '/admin/plans/{plan}/edit'
 */
export const edit = (args: { plan: string | number | { id: string | number } } | [plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/plans/{plan}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::edit
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:79
 * @route '/admin/plans/{plan}/edit'
 */
edit.url = (args: { plan: string | number | { id: string | number } } | [plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { plan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { plan: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        plan: typeof args.plan === 'object'
                ? args.plan.id
                : args.plan,
                }

    return edit.definition.url
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::edit
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:79
 * @route '/admin/plans/{plan}/edit'
 */
edit.get = (args: { plan: string | number | { id: string | number } } | [plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::edit
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:79
 * @route '/admin/plans/{plan}/edit'
 */
edit.head = (args: { plan: string | number | { id: string | number } } | [plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\PlanController::edit
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:79
 * @route '/admin/plans/{plan}/edit'
 */
    const editForm = (args: { plan: string | number | { id: string | number } } | [plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\PlanController::edit
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:79
 * @route '/admin/plans/{plan}/edit'
 */
        editForm.get = (args: { plan: string | number | { id: string | number } } | [plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\PlanController::edit
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:79
 * @route '/admin/plans/{plan}/edit'
 */
        editForm.head = (args: { plan: string | number | { id: string | number } } | [plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::update
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:87
 * @route '/admin/plans/{plan}'
 */
export const update = (args: { plan: string | number | { id: string | number } } | [plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/admin/plans/{plan}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::update
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:87
 * @route '/admin/plans/{plan}'
 */
update.url = (args: { plan: string | number | { id: string | number } } | [plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { plan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { plan: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        plan: typeof args.plan === 'object'
                ? args.plan.id
                : args.plan,
                }

    return update.definition.url
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::update
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:87
 * @route '/admin/plans/{plan}'
 */
update.patch = (args: { plan: string | number | { id: string | number } } | [plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\PlanController::update
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:87
 * @route '/admin/plans/{plan}'
 */
    const updateForm = (args: { plan: string | number | { id: string | number } } | [plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\PlanController::update
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:87
 * @route '/admin/plans/{plan}'
 */
        updateForm.patch = (args: { plan: string | number | { id: string | number } } | [plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\Platform\PlanController::sync
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:105
 * @route '/admin/plans/{plan}/sync'
 */
export const sync = (args: { plan: string | number | { id: string | number } } | [plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sync.url(args, options),
    method: 'post',
})

sync.definition = {
    methods: ["post"],
    url: '/admin/plans/{plan}/sync',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::sync
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:105
 * @route '/admin/plans/{plan}/sync'
 */
sync.url = (args: { plan: string | number | { id: string | number } } | [plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { plan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { plan: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        plan: typeof args.plan === 'object'
                ? args.plan.id
                : args.plan,
                }

    return sync.definition.url
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::sync
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:105
 * @route '/admin/plans/{plan}/sync'
 */
sync.post = (args: { plan: string | number | { id: string | number } } | [plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sync.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\PlanController::sync
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:105
 * @route '/admin/plans/{plan}/sync'
 */
    const syncForm = (args: { plan: string | number | { id: string | number } } | [plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sync.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\PlanController::sync
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:105
 * @route '/admin/plans/{plan}/sync'
 */
        syncForm.post = (args: { plan: string | number | { id: string | number } } | [plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sync.url(args, options),
            method: 'post',
        })
    
    sync.form = syncForm
/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::destroy
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:189
 * @route '/admin/plans/{plan}'
 */
export const destroy = (args: { plan: string | number | { id: string | number } } | [plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/plans/{plan}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::destroy
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:189
 * @route '/admin/plans/{plan}'
 */
destroy.url = (args: { plan: string | number | { id: string | number } } | [plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { plan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { plan: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        plan: typeof args.plan === 'object'
                ? args.plan.id
                : args.plan,
                }

    return destroy.definition.url
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\PlanController::destroy
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:189
 * @route '/admin/plans/{plan}'
 */
destroy.delete = (args: { plan: string | number | { id: string | number } } | [plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\PlanController::destroy
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:189
 * @route '/admin/plans/{plan}'
 */
    const destroyForm = (args: { plan: string | number | { id: string | number } } | [plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\PlanController::destroy
 * @see app/Http/Controllers/Admin/Platform/PlanController.php:189
 * @route '/admin/plans/{plan}'
 */
        destroyForm.delete = (args: { plan: string | number | { id: string | number } } | [plan: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const plans = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
sync: Object.assign(sync, sync22cd6d),
destroy: Object.assign(destroy, destroy),
}

export default plans