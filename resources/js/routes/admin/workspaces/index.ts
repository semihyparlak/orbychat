import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Platform\WorkspaceController::index
 * @see app/Http/Controllers/Admin/Platform/WorkspaceController.php:16
 * @route '/admin/workspaces'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/workspaces',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\WorkspaceController::index
 * @see app/Http/Controllers/Admin/Platform/WorkspaceController.php:16
 * @route '/admin/workspaces'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\WorkspaceController::index
 * @see app/Http/Controllers/Admin/Platform/WorkspaceController.php:16
 * @route '/admin/workspaces'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\WorkspaceController::index
 * @see app/Http/Controllers/Admin/Platform/WorkspaceController.php:16
 * @route '/admin/workspaces'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\WorkspaceController::index
 * @see app/Http/Controllers/Admin/Platform/WorkspaceController.php:16
 * @route '/admin/workspaces'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\WorkspaceController::index
 * @see app/Http/Controllers/Admin/Platform/WorkspaceController.php:16
 * @route '/admin/workspaces'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\WorkspaceController::index
 * @see app/Http/Controllers/Admin/Platform/WorkspaceController.php:16
 * @route '/admin/workspaces'
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
* @see \App\Http\Controllers\Admin\Platform\WorkspaceController::show
 * @see app/Http/Controllers/Admin/Platform/WorkspaceController.php:58
 * @route '/admin/workspaces/{workspace}'
 */
export const show = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/workspaces/{workspace}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\WorkspaceController::show
 * @see app/Http/Controllers/Admin/Platform/WorkspaceController.php:58
 * @route '/admin/workspaces/{workspace}'
 */
show.url = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workspace: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { workspace: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    workspace: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        workspace: typeof args.workspace === 'object'
                ? args.workspace.id
                : args.workspace,
                }

    return show.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\WorkspaceController::show
 * @see app/Http/Controllers/Admin/Platform/WorkspaceController.php:58
 * @route '/admin/workspaces/{workspace}'
 */
show.get = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\WorkspaceController::show
 * @see app/Http/Controllers/Admin/Platform/WorkspaceController.php:58
 * @route '/admin/workspaces/{workspace}'
 */
show.head = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\WorkspaceController::show
 * @see app/Http/Controllers/Admin/Platform/WorkspaceController.php:58
 * @route '/admin/workspaces/{workspace}'
 */
    const showForm = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\WorkspaceController::show
 * @see app/Http/Controllers/Admin/Platform/WorkspaceController.php:58
 * @route '/admin/workspaces/{workspace}'
 */
        showForm.get = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\WorkspaceController::show
 * @see app/Http/Controllers/Admin/Platform/WorkspaceController.php:58
 * @route '/admin/workspaces/{workspace}'
 */
        showForm.head = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const workspaces = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
}

export default workspaces