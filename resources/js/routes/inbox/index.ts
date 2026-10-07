import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\LeadController::index
 * @see app/Http/Controllers/Admin/LeadController.php:78
 * @route '/app/inbox'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/app/inbox',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LeadController::index
 * @see app/Http/Controllers/Admin/LeadController.php:78
 * @route '/app/inbox'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LeadController::index
 * @see app/Http/Controllers/Admin/LeadController.php:78
 * @route '/app/inbox'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\LeadController::index
 * @see app/Http/Controllers/Admin/LeadController.php:78
 * @route '/app/inbox'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\LeadController::index
 * @see app/Http/Controllers/Admin/LeadController.php:78
 * @route '/app/inbox'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\LeadController::index
 * @see app/Http/Controllers/Admin/LeadController.php:78
 * @route '/app/inbox'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\LeadController::index
 * @see app/Http/Controllers/Admin/LeadController.php:78
 * @route '/app/inbox'
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
* @see \App\Http\Controllers\Admin\LeadController::show
 * @see app/Http/Controllers/Admin/LeadController.php:155
 * @route '/app/inbox/{lead}'
 */
export const show = (args: { lead: string | number | { id: string | number } } | [lead: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/app/inbox/{lead}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LeadController::show
 * @see app/Http/Controllers/Admin/LeadController.php:155
 * @route '/app/inbox/{lead}'
 */
show.url = (args: { lead: string | number | { id: string | number } } | [lead: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lead: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { lead: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    lead: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lead: typeof args.lead === 'object'
                ? args.lead.id
                : args.lead,
                }

    return show.definition.url
            .replace('{lead}', parsedArgs.lead.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LeadController::show
 * @see app/Http/Controllers/Admin/LeadController.php:155
 * @route '/app/inbox/{lead}'
 */
show.get = (args: { lead: string | number | { id: string | number } } | [lead: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\LeadController::show
 * @see app/Http/Controllers/Admin/LeadController.php:155
 * @route '/app/inbox/{lead}'
 */
show.head = (args: { lead: string | number | { id: string | number } } | [lead: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\LeadController::show
 * @see app/Http/Controllers/Admin/LeadController.php:155
 * @route '/app/inbox/{lead}'
 */
    const showForm = (args: { lead: string | number | { id: string | number } } | [lead: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\LeadController::show
 * @see app/Http/Controllers/Admin/LeadController.php:155
 * @route '/app/inbox/{lead}'
 */
        showForm.get = (args: { lead: string | number | { id: string | number } } | [lead: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\LeadController::show
 * @see app/Http/Controllers/Admin/LeadController.php:155
 * @route '/app/inbox/{lead}'
 */
        showForm.head = (args: { lead: string | number | { id: string | number } } | [lead: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Admin\LeadController::update
 * @see app/Http/Controllers/Admin/LeadController.php:180
 * @route '/app/inbox/{lead}'
 */
export const update = (args: { lead: string | number | { id: string | number } } | [lead: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/app/inbox/{lead}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\LeadController::update
 * @see app/Http/Controllers/Admin/LeadController.php:180
 * @route '/app/inbox/{lead}'
 */
update.url = (args: { lead: string | number | { id: string | number } } | [lead: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lead: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { lead: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    lead: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lead: typeof args.lead === 'object'
                ? args.lead.id
                : args.lead,
                }

    return update.definition.url
            .replace('{lead}', parsedArgs.lead.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LeadController::update
 * @see app/Http/Controllers/Admin/LeadController.php:180
 * @route '/app/inbox/{lead}'
 */
update.patch = (args: { lead: string | number | { id: string | number } } | [lead: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\LeadController::update
 * @see app/Http/Controllers/Admin/LeadController.php:180
 * @route '/app/inbox/{lead}'
 */
    const updateForm = (args: { lead: string | number | { id: string | number } } | [lead: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\LeadController::update
 * @see app/Http/Controllers/Admin/LeadController.php:180
 * @route '/app/inbox/{lead}'
 */
        updateForm.patch = (args: { lead: string | number | { id: string | number } } | [lead: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const inbox = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
update: Object.assign(update, update),
}

export default inbox