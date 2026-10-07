import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Internal\QueueTickController::__invoke
 * @see app/Http/Controllers/Internal/QueueTickController.php:27
 * @route '/api/v1/internal/queue-tick'
 */
const QueueTickController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: QueueTickController.url(options),
    method: 'post',
})

QueueTickController.definition = {
    methods: ["post"],
    url: '/api/v1/internal/queue-tick',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Internal\QueueTickController::__invoke
 * @see app/Http/Controllers/Internal/QueueTickController.php:27
 * @route '/api/v1/internal/queue-tick'
 */
QueueTickController.url = (options?: RouteQueryOptions) => {
    return QueueTickController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Internal\QueueTickController::__invoke
 * @see app/Http/Controllers/Internal/QueueTickController.php:27
 * @route '/api/v1/internal/queue-tick'
 */
QueueTickController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: QueueTickController.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Internal\QueueTickController::__invoke
 * @see app/Http/Controllers/Internal/QueueTickController.php:27
 * @route '/api/v1/internal/queue-tick'
 */
    const QueueTickControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: QueueTickController.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Internal\QueueTickController::__invoke
 * @see app/Http/Controllers/Internal/QueueTickController.php:27
 * @route '/api/v1/internal/queue-tick'
 */
        QueueTickControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: QueueTickController.url(options),
            method: 'post',
        })
    
    QueueTickController.form = QueueTickControllerForm
export default QueueTickController