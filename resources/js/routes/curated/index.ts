import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\CuratedAnswerController::update
 * @see app/Http/Controllers/Admin/CuratedAnswerController.php:51
 * @route '/app/curated-answers/{curatedAnswer}'
 */
export const update = (args: { curatedAnswer: string | number | { id: string | number } } | [curatedAnswer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/app/curated-answers/{curatedAnswer}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\CuratedAnswerController::update
 * @see app/Http/Controllers/Admin/CuratedAnswerController.php:51
 * @route '/app/curated-answers/{curatedAnswer}'
 */
update.url = (args: { curatedAnswer: string | number | { id: string | number } } | [curatedAnswer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { curatedAnswer: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { curatedAnswer: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    curatedAnswer: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        curatedAnswer: typeof args.curatedAnswer === 'object'
                ? args.curatedAnswer.id
                : args.curatedAnswer,
                }

    return update.definition.url
            .replace('{curatedAnswer}', parsedArgs.curatedAnswer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CuratedAnswerController::update
 * @see app/Http/Controllers/Admin/CuratedAnswerController.php:51
 * @route '/app/curated-answers/{curatedAnswer}'
 */
update.patch = (args: { curatedAnswer: string | number | { id: string | number } } | [curatedAnswer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\CuratedAnswerController::update
 * @see app/Http/Controllers/Admin/CuratedAnswerController.php:51
 * @route '/app/curated-answers/{curatedAnswer}'
 */
    const updateForm = (args: { curatedAnswer: string | number | { id: string | number } } | [curatedAnswer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CuratedAnswerController::update
 * @see app/Http/Controllers/Admin/CuratedAnswerController.php:51
 * @route '/app/curated-answers/{curatedAnswer}'
 */
        updateForm.patch = (args: { curatedAnswer: string | number | { id: string | number } } | [curatedAnswer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\CuratedAnswerController::approve
 * @see app/Http/Controllers/Admin/CuratedAnswerController.php:74
 * @route '/app/curated-answers/{curatedAnswer}/approve'
 */
export const approve = (args: { curatedAnswer: string | number | { id: string | number } } | [curatedAnswer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/app/curated-answers/{curatedAnswer}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CuratedAnswerController::approve
 * @see app/Http/Controllers/Admin/CuratedAnswerController.php:74
 * @route '/app/curated-answers/{curatedAnswer}/approve'
 */
approve.url = (args: { curatedAnswer: string | number | { id: string | number } } | [curatedAnswer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { curatedAnswer: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { curatedAnswer: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    curatedAnswer: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        curatedAnswer: typeof args.curatedAnswer === 'object'
                ? args.curatedAnswer.id
                : args.curatedAnswer,
                }

    return approve.definition.url
            .replace('{curatedAnswer}', parsedArgs.curatedAnswer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CuratedAnswerController::approve
 * @see app/Http/Controllers/Admin/CuratedAnswerController.php:74
 * @route '/app/curated-answers/{curatedAnswer}/approve'
 */
approve.post = (args: { curatedAnswer: string | number | { id: string | number } } | [curatedAnswer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\CuratedAnswerController::approve
 * @see app/Http/Controllers/Admin/CuratedAnswerController.php:74
 * @route '/app/curated-answers/{curatedAnswer}/approve'
 */
    const approveForm = (args: { curatedAnswer: string | number | { id: string | number } } | [curatedAnswer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CuratedAnswerController::approve
 * @see app/Http/Controllers/Admin/CuratedAnswerController.php:74
 * @route '/app/curated-answers/{curatedAnswer}/approve'
 */
        approveForm.post = (args: { curatedAnswer: string | number | { id: string | number } } | [curatedAnswer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\Admin\CuratedAnswerController::destroy
 * @see app/Http/Controllers/Admin/CuratedAnswerController.php:92
 * @route '/app/curated-answers/{curatedAnswer}'
 */
export const destroy = (args: { curatedAnswer: string | number | { id: string | number } } | [curatedAnswer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/app/curated-answers/{curatedAnswer}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\CuratedAnswerController::destroy
 * @see app/Http/Controllers/Admin/CuratedAnswerController.php:92
 * @route '/app/curated-answers/{curatedAnswer}'
 */
destroy.url = (args: { curatedAnswer: string | number | { id: string | number } } | [curatedAnswer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { curatedAnswer: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { curatedAnswer: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    curatedAnswer: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        curatedAnswer: typeof args.curatedAnswer === 'object'
                ? args.curatedAnswer.id
                : args.curatedAnswer,
                }

    return destroy.definition.url
            .replace('{curatedAnswer}', parsedArgs.curatedAnswer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CuratedAnswerController::destroy
 * @see app/Http/Controllers/Admin/CuratedAnswerController.php:92
 * @route '/app/curated-answers/{curatedAnswer}'
 */
destroy.delete = (args: { curatedAnswer: string | number | { id: string | number } } | [curatedAnswer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\CuratedAnswerController::destroy
 * @see app/Http/Controllers/Admin/CuratedAnswerController.php:92
 * @route '/app/curated-answers/{curatedAnswer}'
 */
    const destroyForm = (args: { curatedAnswer: string | number | { id: string | number } } | [curatedAnswer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CuratedAnswerController::destroy
 * @see app/Http/Controllers/Admin/CuratedAnswerController.php:92
 * @route '/app/curated-answers/{curatedAnswer}'
 */
        destroyForm.delete = (args: { curatedAnswer: string | number | { id: string | number } } | [curatedAnswer: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\CuratedAnswerController::reorder
 * @see app/Http/Controllers/Admin/CuratedAnswerController.php:106
 * @route '/app/agents/{agent}/curated/reorder'
 */
export const reorder = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

reorder.definition = {
    methods: ["post"],
    url: '/app/agents/{agent}/curated/reorder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CuratedAnswerController::reorder
 * @see app/Http/Controllers/Admin/CuratedAnswerController.php:106
 * @route '/app/agents/{agent}/curated/reorder'
 */
reorder.url = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { agent: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { agent: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    agent: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        agent: typeof args.agent === 'object'
                ? args.agent.id
                : args.agent,
                }

    return reorder.definition.url
            .replace('{agent}', parsedArgs.agent.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CuratedAnswerController::reorder
 * @see app/Http/Controllers/Admin/CuratedAnswerController.php:106
 * @route '/app/agents/{agent}/curated/reorder'
 */
reorder.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\CuratedAnswerController::reorder
 * @see app/Http/Controllers/Admin/CuratedAnswerController.php:106
 * @route '/app/agents/{agent}/curated/reorder'
 */
    const reorderForm = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reorder.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\CuratedAnswerController::reorder
 * @see app/Http/Controllers/Admin/CuratedAnswerController.php:106
 * @route '/app/agents/{agent}/curated/reorder'
 */
        reorderForm.post = (args: { agent: string | number | { id: string | number } } | [agent: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reorder.url(args, options),
            method: 'post',
        })
    
    reorder.form = reorderForm
const curated = {
    update: Object.assign(update, update),
approve: Object.assign(approve, approve),
destroy: Object.assign(destroy, destroy),
reorder: Object.assign(reorder, reorder),
}

export default curated