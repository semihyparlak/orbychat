import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Internal\QueueTickController::__invoke
 * @see app/Http/Controllers/Internal/QueueTickController.php:27
 * @route '/api/v1/internal/queue-tick'
 */
export const queueTick = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: queueTick.url(options),
    method: 'post',
})

queueTick.definition = {
    methods: ["post"],
    url: '/api/v1/internal/queue-tick',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Internal\QueueTickController::__invoke
 * @see app/Http/Controllers/Internal/QueueTickController.php:27
 * @route '/api/v1/internal/queue-tick'
 */
queueTick.url = (options?: RouteQueryOptions) => {
    return queueTick.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Internal\QueueTickController::__invoke
 * @see app/Http/Controllers/Internal/QueueTickController.php:27
 * @route '/api/v1/internal/queue-tick'
 */
queueTick.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: queueTick.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Internal\QueueTickController::__invoke
 * @see app/Http/Controllers/Internal/QueueTickController.php:27
 * @route '/api/v1/internal/queue-tick'
 */
    const queueTickForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: queueTick.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Internal\QueueTickController::__invoke
 * @see app/Http/Controllers/Internal/QueueTickController.php:27
 * @route '/api/v1/internal/queue-tick'
 */
        queueTickForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: queueTick.url(options),
            method: 'post',
        })
    
    queueTick.form = queueTickForm
const internal = {
    queueTick: Object.assign(queueTick, queueTick),
}

export default internal