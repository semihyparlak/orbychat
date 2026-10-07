import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SourceController::destroy
 * @see app/Http/Controllers/Admin/SourceController.php:322
 * @route '/app/sources/{source}'
 */
export const destroy = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/app/sources/{source}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\SourceController::destroy
 * @see app/Http/Controllers/Admin/SourceController.php:322
 * @route '/app/sources/{source}'
 */
destroy.url = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { source: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { source: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    source: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        source: typeof args.source === 'object'
                ? args.source.id
                : args.source,
                }

    return destroy.definition.url
            .replace('{source}', parsedArgs.source.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SourceController::destroy
 * @see app/Http/Controllers/Admin/SourceController.php:322
 * @route '/app/sources/{source}'
 */
destroy.delete = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\SourceController::destroy
 * @see app/Http/Controllers/Admin/SourceController.php:322
 * @route '/app/sources/{source}'
 */
    const destroyForm = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SourceController::destroy
 * @see app/Http/Controllers/Admin/SourceController.php:322
 * @route '/app/sources/{source}'
 */
        destroyForm.delete = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\Admin\SourceController::reindex
 * @see app/Http/Controllers/Admin/SourceController.php:384
 * @route '/app/sources/{source}/reindex'
 */
export const reindex = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reindex.url(args, options),
    method: 'post',
})

reindex.definition = {
    methods: ["post"],
    url: '/app/sources/{source}/reindex',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SourceController::reindex
 * @see app/Http/Controllers/Admin/SourceController.php:384
 * @route '/app/sources/{source}/reindex'
 */
reindex.url = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { source: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { source: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    source: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        source: typeof args.source === 'object'
                ? args.source.id
                : args.source,
                }

    return reindex.definition.url
            .replace('{source}', parsedArgs.source.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SourceController::reindex
 * @see app/Http/Controllers/Admin/SourceController.php:384
 * @route '/app/sources/{source}/reindex'
 */
reindex.post = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reindex.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\SourceController::reindex
 * @see app/Http/Controllers/Admin/SourceController.php:384
 * @route '/app/sources/{source}/reindex'
 */
    const reindexForm = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reindex.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\SourceController::reindex
 * @see app/Http/Controllers/Admin/SourceController.php:384
 * @route '/app/sources/{source}/reindex'
 */
        reindexForm.post = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reindex.url(args, options),
            method: 'post',
        })
    
    reindex.form = reindexForm
/**
* @see \App\Http\Controllers\Admin\SourceController::preview
 * @see app/Http/Controllers/Admin/SourceController.php:399
 * @route '/app/sources/{source}/preview'
 */
export const preview = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/app/sources/{source}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SourceController::preview
 * @see app/Http/Controllers/Admin/SourceController.php:399
 * @route '/app/sources/{source}/preview'
 */
preview.url = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { source: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { source: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    source: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        source: typeof args.source === 'object'
                ? args.source.id
                : args.source,
                }

    return preview.definition.url
            .replace('{source}', parsedArgs.source.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SourceController::preview
 * @see app/Http/Controllers/Admin/SourceController.php:399
 * @route '/app/sources/{source}/preview'
 */
preview.get = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SourceController::preview
 * @see app/Http/Controllers/Admin/SourceController.php:399
 * @route '/app/sources/{source}/preview'
 */
preview.head = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SourceController::preview
 * @see app/Http/Controllers/Admin/SourceController.php:399
 * @route '/app/sources/{source}/preview'
 */
    const previewForm = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SourceController::preview
 * @see app/Http/Controllers/Admin/SourceController.php:399
 * @route '/app/sources/{source}/preview'
 */
        previewForm.get = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SourceController::preview
 * @see app/Http/Controllers/Admin/SourceController.php:399
 * @route '/app/sources/{source}/preview'
 */
        previewForm.head = (args: { source: string | number | { id: string | number } } | [source: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preview.form = previewForm
const sources = {
    destroy: Object.assign(destroy, destroy),
reindex: Object.assign(reindex, reindex),
preview: Object.assign(preview, preview),
}

export default sources