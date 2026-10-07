import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\WorkflowController::index
 * @see app/Http/Controllers/Admin/WorkflowController.php:27
 * @route '/app/workflows'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/app/workflows',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\WorkflowController::index
 * @see app/Http/Controllers/Admin/WorkflowController.php:27
 * @route '/app/workflows'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WorkflowController::index
 * @see app/Http/Controllers/Admin/WorkflowController.php:27
 * @route '/app/workflows'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\WorkflowController::index
 * @see app/Http/Controllers/Admin/WorkflowController.php:27
 * @route '/app/workflows'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\WorkflowController::index
 * @see app/Http/Controllers/Admin/WorkflowController.php:27
 * @route '/app/workflows'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\WorkflowController::index
 * @see app/Http/Controllers/Admin/WorkflowController.php:27
 * @route '/app/workflows'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\WorkflowController::index
 * @see app/Http/Controllers/Admin/WorkflowController.php:27
 * @route '/app/workflows'
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
* @see \App\Http\Controllers\Admin\WorkflowController::create
 * @see app/Http/Controllers/Admin/WorkflowController.php:82
 * @route '/app/workflows/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/app/workflows/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\WorkflowController::create
 * @see app/Http/Controllers/Admin/WorkflowController.php:82
 * @route '/app/workflows/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WorkflowController::create
 * @see app/Http/Controllers/Admin/WorkflowController.php:82
 * @route '/app/workflows/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\WorkflowController::create
 * @see app/Http/Controllers/Admin/WorkflowController.php:82
 * @route '/app/workflows/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\WorkflowController::create
 * @see app/Http/Controllers/Admin/WorkflowController.php:82
 * @route '/app/workflows/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\WorkflowController::create
 * @see app/Http/Controllers/Admin/WorkflowController.php:82
 * @route '/app/workflows/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\WorkflowController::create
 * @see app/Http/Controllers/Admin/WorkflowController.php:82
 * @route '/app/workflows/create'
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
* @see \App\Http\Controllers\Admin\WorkflowController::store
 * @see app/Http/Controllers/Admin/WorkflowController.php:91
 * @route '/app/workflows'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/app/workflows',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\WorkflowController::store
 * @see app/Http/Controllers/Admin/WorkflowController.php:91
 * @route '/app/workflows'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WorkflowController::store
 * @see app/Http/Controllers/Admin/WorkflowController.php:91
 * @route '/app/workflows'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\WorkflowController::store
 * @see app/Http/Controllers/Admin/WorkflowController.php:91
 * @route '/app/workflows'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\WorkflowController::store
 * @see app/Http/Controllers/Admin/WorkflowController.php:91
 * @route '/app/workflows'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\WorkflowController::edit
 * @see app/Http/Controllers/Admin/WorkflowController.php:120
 * @route '/app/workflows/{workflow}/edit'
 */
export const edit = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/app/workflows/{workflow}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\WorkflowController::edit
 * @see app/Http/Controllers/Admin/WorkflowController.php:120
 * @route '/app/workflows/{workflow}/edit'
 */
edit.url = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workflow: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { workflow: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    workflow: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        workflow: typeof args.workflow === 'object'
                ? args.workflow.id
                : args.workflow,
                }

    return edit.definition.url
            .replace('{workflow}', parsedArgs.workflow.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WorkflowController::edit
 * @see app/Http/Controllers/Admin/WorkflowController.php:120
 * @route '/app/workflows/{workflow}/edit'
 */
edit.get = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\WorkflowController::edit
 * @see app/Http/Controllers/Admin/WorkflowController.php:120
 * @route '/app/workflows/{workflow}/edit'
 */
edit.head = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\WorkflowController::edit
 * @see app/Http/Controllers/Admin/WorkflowController.php:120
 * @route '/app/workflows/{workflow}/edit'
 */
    const editForm = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\WorkflowController::edit
 * @see app/Http/Controllers/Admin/WorkflowController.php:120
 * @route '/app/workflows/{workflow}/edit'
 */
        editForm.get = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\WorkflowController::edit
 * @see app/Http/Controllers/Admin/WorkflowController.php:120
 * @route '/app/workflows/{workflow}/edit'
 */
        editForm.head = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\WorkflowController::canvas
 * @see app/Http/Controllers/Admin/WorkflowController.php:135
 * @route '/app/workflows/{workflow}/canvas'
 */
export const canvas = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: canvas.url(args, options),
    method: 'get',
})

canvas.definition = {
    methods: ["get","head"],
    url: '/app/workflows/{workflow}/canvas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\WorkflowController::canvas
 * @see app/Http/Controllers/Admin/WorkflowController.php:135
 * @route '/app/workflows/{workflow}/canvas'
 */
canvas.url = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workflow: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { workflow: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    workflow: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        workflow: typeof args.workflow === 'object'
                ? args.workflow.id
                : args.workflow,
                }

    return canvas.definition.url
            .replace('{workflow}', parsedArgs.workflow.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WorkflowController::canvas
 * @see app/Http/Controllers/Admin/WorkflowController.php:135
 * @route '/app/workflows/{workflow}/canvas'
 */
canvas.get = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: canvas.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\WorkflowController::canvas
 * @see app/Http/Controllers/Admin/WorkflowController.php:135
 * @route '/app/workflows/{workflow}/canvas'
 */
canvas.head = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: canvas.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\WorkflowController::canvas
 * @see app/Http/Controllers/Admin/WorkflowController.php:135
 * @route '/app/workflows/{workflow}/canvas'
 */
    const canvasForm = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: canvas.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\WorkflowController::canvas
 * @see app/Http/Controllers/Admin/WorkflowController.php:135
 * @route '/app/workflows/{workflow}/canvas'
 */
        canvasForm.get = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: canvas.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\WorkflowController::canvas
 * @see app/Http/Controllers/Admin/WorkflowController.php:135
 * @route '/app/workflows/{workflow}/canvas'
 */
        canvasForm.head = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: canvas.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    canvas.form = canvasForm
/**
* @see \App\Http\Controllers\Admin\WorkflowController::update
 * @see app/Http/Controllers/Admin/WorkflowController.php:143
 * @route '/app/workflows/{workflow}'
 */
export const update = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/app/workflows/{workflow}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\WorkflowController::update
 * @see app/Http/Controllers/Admin/WorkflowController.php:143
 * @route '/app/workflows/{workflow}'
 */
update.url = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workflow: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { workflow: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    workflow: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        workflow: typeof args.workflow === 'object'
                ? args.workflow.id
                : args.workflow,
                }

    return update.definition.url
            .replace('{workflow}', parsedArgs.workflow.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WorkflowController::update
 * @see app/Http/Controllers/Admin/WorkflowController.php:143
 * @route '/app/workflows/{workflow}'
 */
update.patch = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\WorkflowController::update
 * @see app/Http/Controllers/Admin/WorkflowController.php:143
 * @route '/app/workflows/{workflow}'
 */
    const updateForm = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\WorkflowController::update
 * @see app/Http/Controllers/Admin/WorkflowController.php:143
 * @route '/app/workflows/{workflow}'
 */
        updateForm.patch = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\WorkflowController::destroy
 * @see app/Http/Controllers/Admin/WorkflowController.php:166
 * @route '/app/workflows/{workflow}'
 */
export const destroy = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/app/workflows/{workflow}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\WorkflowController::destroy
 * @see app/Http/Controllers/Admin/WorkflowController.php:166
 * @route '/app/workflows/{workflow}'
 */
destroy.url = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workflow: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { workflow: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    workflow: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        workflow: typeof args.workflow === 'object'
                ? args.workflow.id
                : args.workflow,
                }

    return destroy.definition.url
            .replace('{workflow}', parsedArgs.workflow.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WorkflowController::destroy
 * @see app/Http/Controllers/Admin/WorkflowController.php:166
 * @route '/app/workflows/{workflow}'
 */
destroy.delete = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\WorkflowController::destroy
 * @see app/Http/Controllers/Admin/WorkflowController.php:166
 * @route '/app/workflows/{workflow}'
 */
    const destroyForm = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\WorkflowController::destroy
 * @see app/Http/Controllers/Admin/WorkflowController.php:166
 * @route '/app/workflows/{workflow}'
 */
        destroyForm.delete = (args: { workflow: string | { id: string } } | [workflow: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const workflows = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
edit: Object.assign(edit, edit),
canvas: Object.assign(canvas, canvas),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default workflows