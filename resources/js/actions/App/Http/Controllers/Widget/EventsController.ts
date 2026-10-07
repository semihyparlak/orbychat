import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Widget\EventsController::__invoke
 * @see app/Http/Controllers/Widget/EventsController.php:14
 * @route '/api/v1/widget/events'
 */
const EventsController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: EventsController.url(options),
    method: 'post',
})

EventsController.definition = {
    methods: ["post"],
    url: '/api/v1/widget/events',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Widget\EventsController::__invoke
 * @see app/Http/Controllers/Widget/EventsController.php:14
 * @route '/api/v1/widget/events'
 */
EventsController.url = (options?: RouteQueryOptions) => {
    return EventsController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Widget\EventsController::__invoke
 * @see app/Http/Controllers/Widget/EventsController.php:14
 * @route '/api/v1/widget/events'
 */
EventsController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: EventsController.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Widget\EventsController::__invoke
 * @see app/Http/Controllers/Widget/EventsController.php:14
 * @route '/api/v1/widget/events'
 */
    const EventsControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: EventsController.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Widget\EventsController::__invoke
 * @see app/Http/Controllers/Widget/EventsController.php:14
 * @route '/api/v1/widget/events'
 */
        EventsControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: EventsController.url(options),
            method: 'post',
        })
    
    EventsController.form = EventsControllerForm
export default EventsController