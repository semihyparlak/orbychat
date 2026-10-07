import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ConversationTakeoverController::claim
 * @see app/Http/Controllers/Admin/ConversationTakeoverController.php:21
 * @route '/app/conversations/{conversation}/claim'
 */
export const claim = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: claim.url(args, options),
    method: 'post',
})

claim.definition = {
    methods: ["post"],
    url: '/app/conversations/{conversation}/claim',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ConversationTakeoverController::claim
 * @see app/Http/Controllers/Admin/ConversationTakeoverController.php:21
 * @route '/app/conversations/{conversation}/claim'
 */
claim.url = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conversation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { conversation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    conversation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conversation: typeof args.conversation === 'object'
                ? args.conversation.id
                : args.conversation,
                }

    return claim.definition.url
            .replace('{conversation}', parsedArgs.conversation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ConversationTakeoverController::claim
 * @see app/Http/Controllers/Admin/ConversationTakeoverController.php:21
 * @route '/app/conversations/{conversation}/claim'
 */
claim.post = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: claim.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ConversationTakeoverController::claim
 * @see app/Http/Controllers/Admin/ConversationTakeoverController.php:21
 * @route '/app/conversations/{conversation}/claim'
 */
    const claimForm = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: claim.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ConversationTakeoverController::claim
 * @see app/Http/Controllers/Admin/ConversationTakeoverController.php:21
 * @route '/app/conversations/{conversation}/claim'
 */
        claimForm.post = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: claim.url(args, options),
            method: 'post',
        })
    
    claim.form = claimForm
/**
* @see \App\Http\Controllers\Admin\ConversationTakeoverController::release
 * @see app/Http/Controllers/Admin/ConversationTakeoverController.php:57
 * @route '/app/conversations/{conversation}/release'
 */
export const release = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: release.url(args, options),
    method: 'post',
})

release.definition = {
    methods: ["post"],
    url: '/app/conversations/{conversation}/release',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ConversationTakeoverController::release
 * @see app/Http/Controllers/Admin/ConversationTakeoverController.php:57
 * @route '/app/conversations/{conversation}/release'
 */
release.url = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conversation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { conversation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    conversation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conversation: typeof args.conversation === 'object'
                ? args.conversation.id
                : args.conversation,
                }

    return release.definition.url
            .replace('{conversation}', parsedArgs.conversation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ConversationTakeoverController::release
 * @see app/Http/Controllers/Admin/ConversationTakeoverController.php:57
 * @route '/app/conversations/{conversation}/release'
 */
release.post = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: release.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ConversationTakeoverController::release
 * @see app/Http/Controllers/Admin/ConversationTakeoverController.php:57
 * @route '/app/conversations/{conversation}/release'
 */
    const releaseForm = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: release.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ConversationTakeoverController::release
 * @see app/Http/Controllers/Admin/ConversationTakeoverController.php:57
 * @route '/app/conversations/{conversation}/release'
 */
        releaseForm.post = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: release.url(args, options),
            method: 'post',
        })
    
    release.form = releaseForm
/**
* @see \App\Http\Controllers\Admin\ConversationTakeoverController::reply
 * @see app/Http/Controllers/Admin/ConversationTakeoverController.php:76
 * @route '/app/conversations/{conversation}/reply'
 */
export const reply = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reply.url(args, options),
    method: 'post',
})

reply.definition = {
    methods: ["post"],
    url: '/app/conversations/{conversation}/reply',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ConversationTakeoverController::reply
 * @see app/Http/Controllers/Admin/ConversationTakeoverController.php:76
 * @route '/app/conversations/{conversation}/reply'
 */
reply.url = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conversation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { conversation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    conversation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conversation: typeof args.conversation === 'object'
                ? args.conversation.id
                : args.conversation,
                }

    return reply.definition.url
            .replace('{conversation}', parsedArgs.conversation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ConversationTakeoverController::reply
 * @see app/Http/Controllers/Admin/ConversationTakeoverController.php:76
 * @route '/app/conversations/{conversation}/reply'
 */
reply.post = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reply.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\ConversationTakeoverController::reply
 * @see app/Http/Controllers/Admin/ConversationTakeoverController.php:76
 * @route '/app/conversations/{conversation}/reply'
 */
    const replyForm = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reply.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\ConversationTakeoverController::reply
 * @see app/Http/Controllers/Admin/ConversationTakeoverController.php:76
 * @route '/app/conversations/{conversation}/reply'
 */
        replyForm.post = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reply.url(args, options),
            method: 'post',
        })
    
    reply.form = replyForm
/**
* @see \App\Http\Controllers\Admin\ConversationController::index
 * @see app/Http/Controllers/Admin/ConversationController.php:23
 * @route '/app/conversations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/app/conversations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ConversationController::index
 * @see app/Http/Controllers/Admin/ConversationController.php:23
 * @route '/app/conversations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ConversationController::index
 * @see app/Http/Controllers/Admin/ConversationController.php:23
 * @route '/app/conversations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ConversationController::index
 * @see app/Http/Controllers/Admin/ConversationController.php:23
 * @route '/app/conversations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ConversationController::index
 * @see app/Http/Controllers/Admin/ConversationController.php:23
 * @route '/app/conversations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ConversationController::index
 * @see app/Http/Controllers/Admin/ConversationController.php:23
 * @route '/app/conversations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ConversationController::index
 * @see app/Http/Controllers/Admin/ConversationController.php:23
 * @route '/app/conversations'
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
* @see \App\Http\Controllers\Admin\ConversationController::show
 * @see app/Http/Controllers/Admin/ConversationController.php:240
 * @route '/app/conversations/{conversation}'
 */
export const show = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/app/conversations/{conversation}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ConversationController::show
 * @see app/Http/Controllers/Admin/ConversationController.php:240
 * @route '/app/conversations/{conversation}'
 */
show.url = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conversation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { conversation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    conversation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conversation: typeof args.conversation === 'object'
                ? args.conversation.id
                : args.conversation,
                }

    return show.definition.url
            .replace('{conversation}', parsedArgs.conversation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ConversationController::show
 * @see app/Http/Controllers/Admin/ConversationController.php:240
 * @route '/app/conversations/{conversation}'
 */
show.get = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ConversationController::show
 * @see app/Http/Controllers/Admin/ConversationController.php:240
 * @route '/app/conversations/{conversation}'
 */
show.head = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\ConversationController::show
 * @see app/Http/Controllers/Admin/ConversationController.php:240
 * @route '/app/conversations/{conversation}'
 */
    const showForm = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\ConversationController::show
 * @see app/Http/Controllers/Admin/ConversationController.php:240
 * @route '/app/conversations/{conversation}'
 */
        showForm.get = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\ConversationController::show
 * @see app/Http/Controllers/Admin/ConversationController.php:240
 * @route '/app/conversations/{conversation}'
 */
        showForm.head = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const conversations = {
    claim: Object.assign(claim, claim),
release: Object.assign(release, release),
reply: Object.assign(reply, reply),
index: Object.assign(index, index),
show: Object.assign(show, show),
}

export default conversations