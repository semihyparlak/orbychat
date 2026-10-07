import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Platform\ImpersonateController::start
 * @see app/Http/Controllers/Admin/Platform/ImpersonateController.php:19
 * @route '/admin/impersonate/{user}/start'
 */
export const start = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/admin/impersonate/{user}/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Platform\ImpersonateController::start
 * @see app/Http/Controllers/Admin/Platform/ImpersonateController.php:19
 * @route '/admin/impersonate/{user}/start'
 */
start.url = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return start.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\ImpersonateController::start
 * @see app/Http/Controllers/Admin/Platform/ImpersonateController.php:19
 * @route '/admin/impersonate/{user}/start'
 */
start.post = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\ImpersonateController::start
 * @see app/Http/Controllers/Admin/Platform/ImpersonateController.php:19
 * @route '/admin/impersonate/{user}/start'
 */
    const startForm = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: start.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\ImpersonateController::start
 * @see app/Http/Controllers/Admin/Platform/ImpersonateController.php:19
 * @route '/admin/impersonate/{user}/start'
 */
        startForm.post = (args: { user: string | number | { id: string | number } } | [user: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: start.url(args, options),
            method: 'post',
        })
    
    start.form = startForm
const impersonate = {
    start: Object.assign(start, start),
}

export default impersonate