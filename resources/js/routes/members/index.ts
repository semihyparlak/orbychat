import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\MemberController::index
 * @see app/Http/Controllers/Admin/MemberController.php:22
 * @route '/app/members'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/app/members',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\MemberController::index
 * @see app/Http/Controllers/Admin/MemberController.php:22
 * @route '/app/members'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MemberController::index
 * @see app/Http/Controllers/Admin/MemberController.php:22
 * @route '/app/members'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\MemberController::index
 * @see app/Http/Controllers/Admin/MemberController.php:22
 * @route '/app/members'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\MemberController::index
 * @see app/Http/Controllers/Admin/MemberController.php:22
 * @route '/app/members'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\MemberController::index
 * @see app/Http/Controllers/Admin/MemberController.php:22
 * @route '/app/members'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\MemberController::index
 * @see app/Http/Controllers/Admin/MemberController.php:22
 * @route '/app/members'
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
* @see \App\Http\Controllers\Admin\MemberController::store
 * @see app/Http/Controllers/Admin/MemberController.php:53
 * @route '/app/members'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/app/members',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\MemberController::store
 * @see app/Http/Controllers/Admin/MemberController.php:53
 * @route '/app/members'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MemberController::store
 * @see app/Http/Controllers/Admin/MemberController.php:53
 * @route '/app/members'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\MemberController::store
 * @see app/Http/Controllers/Admin/MemberController.php:53
 * @route '/app/members'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\MemberController::store
 * @see app/Http/Controllers/Admin/MemberController.php:53
 * @route '/app/members'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\MemberController::destroy
 * @see app/Http/Controllers/Admin/MemberController.php:99
 * @route '/app/members/{member}'
 */
export const destroy = (args: { member: string | number | { id: string | number } } | [member: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/app/members/{member}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\MemberController::destroy
 * @see app/Http/Controllers/Admin/MemberController.php:99
 * @route '/app/members/{member}'
 */
destroy.url = (args: { member: string | number | { id: string | number } } | [member: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { member: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { member: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    member: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        member: typeof args.member === 'object'
                ? args.member.id
                : args.member,
                }

    return destroy.definition.url
            .replace('{member}', parsedArgs.member.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\MemberController::destroy
 * @see app/Http/Controllers/Admin/MemberController.php:99
 * @route '/app/members/{member}'
 */
destroy.delete = (args: { member: string | number | { id: string | number } } | [member: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\MemberController::destroy
 * @see app/Http/Controllers/Admin/MemberController.php:99
 * @route '/app/members/{member}'
 */
    const destroyForm = (args: { member: string | number | { id: string | number } } | [member: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\MemberController::destroy
 * @see app/Http/Controllers/Admin/MemberController.php:99
 * @route '/app/members/{member}'
 */
        destroyForm.delete = (args: { member: string | number | { id: string | number } } | [member: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const members = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
destroy: Object.assign(destroy, destroy),
}

export default members