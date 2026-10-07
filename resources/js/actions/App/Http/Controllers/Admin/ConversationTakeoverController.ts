import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
const ConversationTakeoverController = { claim, release, reply }

export default ConversationTakeoverController