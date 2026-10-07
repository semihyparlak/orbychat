import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::index
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:23
 * @route '/admin/changelog'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/changelog',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::index
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:23
 * @route '/admin/changelog'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::index
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:23
 * @route '/admin/changelog'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::index
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:23
 * @route '/admin/changelog'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::index
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:23
 * @route '/admin/changelog'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::index
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:23
 * @route '/admin/changelog'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::index
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:23
 * @route '/admin/changelog'
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
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::create
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:31
 * @route '/admin/changelog/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/changelog/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::create
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:31
 * @route '/admin/changelog/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::create
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:31
 * @route '/admin/changelog/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::create
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:31
 * @route '/admin/changelog/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::create
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:31
 * @route '/admin/changelog/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::create
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:31
 * @route '/admin/changelog/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::create
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:31
 * @route '/admin/changelog/create'
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
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::store
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:36
 * @route '/admin/changelog'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/changelog',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::store
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:36
 * @route '/admin/changelog'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::store
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:36
 * @route '/admin/changelog'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::store
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:36
 * @route '/admin/changelog'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::store
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:36
 * @route '/admin/changelog'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::edit
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:56
 * @route '/admin/changelog/{entry}/edit'
 */
export const edit = (args: { entry: string | number } | [entry: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/changelog/{entry}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::edit
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:56
 * @route '/admin/changelog/{entry}/edit'
 */
edit.url = (args: { entry: string | number } | [entry: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { entry: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    entry: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        entry: args.entry,
                }

    return edit.definition.url
            .replace('{entry}', parsedArgs.entry.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::edit
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:56
 * @route '/admin/changelog/{entry}/edit'
 */
edit.get = (args: { entry: string | number } | [entry: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::edit
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:56
 * @route '/admin/changelog/{entry}/edit'
 */
edit.head = (args: { entry: string | number } | [entry: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::edit
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:56
 * @route '/admin/changelog/{entry}/edit'
 */
    const editForm = (args: { entry: string | number } | [entry: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::edit
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:56
 * @route '/admin/changelog/{entry}/edit'
 */
        editForm.get = (args: { entry: string | number } | [entry: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::edit
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:56
 * @route '/admin/changelog/{entry}/edit'
 */
        editForm.head = (args: { entry: string | number } | [entry: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::update
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:63
 * @route '/admin/changelog/{entry}'
 */
export const update = (args: { entry: string | number } | [entry: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/admin/changelog/{entry}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::update
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:63
 * @route '/admin/changelog/{entry}'
 */
update.url = (args: { entry: string | number } | [entry: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { entry: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    entry: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        entry: args.entry,
                }

    return update.definition.url
            .replace('{entry}', parsedArgs.entry.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::update
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:63
 * @route '/admin/changelog/{entry}'
 */
update.patch = (args: { entry: string | number } | [entry: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::update
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:63
 * @route '/admin/changelog/{entry}'
 */
    const updateForm = (args: { entry: string | number } | [entry: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::update
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:63
 * @route '/admin/changelog/{entry}'
 */
        updateForm.patch = (args: { entry: string | number } | [entry: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::publish
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:100
 * @route '/admin/changelog/{entry}/publish'
 */
export const publish = (args: { entry: string | number } | [entry: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

publish.definition = {
    methods: ["post"],
    url: '/admin/changelog/{entry}/publish',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::publish
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:100
 * @route '/admin/changelog/{entry}/publish'
 */
publish.url = (args: { entry: string | number } | [entry: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { entry: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    entry: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        entry: args.entry,
                }

    return publish.definition.url
            .replace('{entry}', parsedArgs.entry.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::publish
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:100
 * @route '/admin/changelog/{entry}/publish'
 */
publish.post = (args: { entry: string | number } | [entry: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: publish.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::publish
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:100
 * @route '/admin/changelog/{entry}/publish'
 */
    const publishForm = (args: { entry: string | number } | [entry: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: publish.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::publish
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:100
 * @route '/admin/changelog/{entry}/publish'
 */
        publishForm.post = (args: { entry: string | number } | [entry: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: publish.url(args, options),
            method: 'post',
        })
    
    publish.form = publishForm
/**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::destroy
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:116
 * @route '/admin/changelog/{entry}'
 */
export const destroy = (args: { entry: string | number } | [entry: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/changelog/{entry}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::destroy
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:116
 * @route '/admin/changelog/{entry}'
 */
destroy.url = (args: { entry: string | number } | [entry: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { entry: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    entry: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        entry: args.entry,
                }

    return destroy.definition.url
            .replace('{entry}', parsedArgs.entry.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::destroy
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:116
 * @route '/admin/changelog/{entry}'
 */
destroy.delete = (args: { entry: string | number } | [entry: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::destroy
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:116
 * @route '/admin/changelog/{entry}'
 */
    const destroyForm = (args: { entry: string | number } | [entry: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\ChangelogController::destroy
 * @see app/Http/Controllers/Admin/Platform/ChangelogController.php:116
 * @route '/admin/changelog/{entry}'
 */
        destroyForm.delete = (args: { entry: string | number } | [entry: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const changelog = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
publish: Object.assign(publish, publish),
destroy: Object.assign(destroy, destroy),
}

export default changelog