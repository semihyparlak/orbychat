import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\WorkspaceSelectController::store
 * @see app/Http/Controllers/Admin/WorkspaceSelectController.php:11
 * @route '/workspaces/{workspace}/select'
 */
export const store = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/workspaces/{workspace}/select',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\WorkspaceSelectController::store
 * @see app/Http/Controllers/Admin/WorkspaceSelectController.php:11
 * @route '/workspaces/{workspace}/select'
 */
store.url = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WorkspaceSelectController::store
 * @see app/Http/Controllers/Admin/WorkspaceSelectController.php:11
 * @route '/workspaces/{workspace}/select'
 */
store.post = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\WorkspaceSelectController::store
 * @see app/Http/Controllers/Admin/WorkspaceSelectController.php:11
 * @route '/workspaces/{workspace}/select'
 */
    const storeForm = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\WorkspaceSelectController::store
 * @see app/Http/Controllers/Admin/WorkspaceSelectController.php:11
 * @route '/workspaces/{workspace}/select'
 */
        storeForm.post = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const WorkspaceSelectController = { store }

export default WorkspaceSelectController