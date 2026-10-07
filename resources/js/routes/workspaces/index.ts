import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\WorkspaceSelectController::select
 * @see app/Http/Controllers/Admin/WorkspaceSelectController.php:11
 * @route '/workspaces/{workspace}/select'
 */
export const select = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: select.url(args, options),
    method: 'post',
})

select.definition = {
    methods: ["post"],
    url: '/workspaces/{workspace}/select',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\WorkspaceSelectController::select
 * @see app/Http/Controllers/Admin/WorkspaceSelectController.php:11
 * @route '/workspaces/{workspace}/select'
 */
select.url = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return select.definition.url
            .replace('{workspace}', parsedArgs.workspace.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WorkspaceSelectController::select
 * @see app/Http/Controllers/Admin/WorkspaceSelectController.php:11
 * @route '/workspaces/{workspace}/select'
 */
select.post = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: select.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\WorkspaceSelectController::select
 * @see app/Http/Controllers/Admin/WorkspaceSelectController.php:11
 * @route '/workspaces/{workspace}/select'
 */
    const selectForm = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: select.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\WorkspaceSelectController::select
 * @see app/Http/Controllers/Admin/WorkspaceSelectController.php:11
 * @route '/workspaces/{workspace}/select'
 */
        selectForm.post = (args: { workspace: string | number | { id: string | number } } | [workspace: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: select.url(args, options),
            method: 'post',
        })
    
    select.form = selectForm
const workspaces = {
    select: Object.assign(select, select),
}

export default workspaces