import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import messages4ba6e9 from './messages'
import gdpr from './gdpr'
import conversation from './conversation'
/**
* @see \App\Http\Controllers\Widget\InitController::__invoke
 * @see app/Http/Controllers/Widget/InitController.php:29
 * @route '/api/v1/widget/init'
 */
export const init = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: init.url(options),
    method: 'post',
})

init.definition = {
    methods: ["post"],
    url: '/api/v1/widget/init',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Widget\InitController::__invoke
 * @see app/Http/Controllers/Widget/InitController.php:29
 * @route '/api/v1/widget/init'
 */
init.url = (options?: RouteQueryOptions) => {
    return init.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Widget\InitController::__invoke
 * @see app/Http/Controllers/Widget/InitController.php:29
 * @route '/api/v1/widget/init'
 */
init.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: init.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Widget\InitController::__invoke
 * @see app/Http/Controllers/Widget/InitController.php:29
 * @route '/api/v1/widget/init'
 */
    const initForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: init.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Widget\InitController::__invoke
 * @see app/Http/Controllers/Widget/InitController.php:29
 * @route '/api/v1/widget/init'
 */
        initForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: init.url(options),
            method: 'post',
        })
    
    init.form = initForm
/**
* @see \App\Http\Controllers\Widget\MessageController::__invoke
 * @see app/Http/Controllers/Widget/MessageController.php:18
 * @route '/api/v1/widget/messages'
 */
export const messages = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: messages.url(options),
    method: 'post',
})

messages.definition = {
    methods: ["post"],
    url: '/api/v1/widget/messages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Widget\MessageController::__invoke
 * @see app/Http/Controllers/Widget/MessageController.php:18
 * @route '/api/v1/widget/messages'
 */
messages.url = (options?: RouteQueryOptions) => {
    return messages.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Widget\MessageController::__invoke
 * @see app/Http/Controllers/Widget/MessageController.php:18
 * @route '/api/v1/widget/messages'
 */
messages.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: messages.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Widget\MessageController::__invoke
 * @see app/Http/Controllers/Widget/MessageController.php:18
 * @route '/api/v1/widget/messages'
 */
    const messagesForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: messages.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Widget\MessageController::__invoke
 * @see app/Http/Controllers/Widget/MessageController.php:18
 * @route '/api/v1/widget/messages'
 */
        messagesForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: messages.url(options),
            method: 'post',
        })
    
    messages.form = messagesForm
/**
* @see \App\Http\Controllers\Widget\EventsController::__invoke
 * @see app/Http/Controllers/Widget/EventsController.php:14
 * @route '/api/v1/widget/events'
 */
export const events = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: events.url(options),
    method: 'post',
})

events.definition = {
    methods: ["post"],
    url: '/api/v1/widget/events',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Widget\EventsController::__invoke
 * @see app/Http/Controllers/Widget/EventsController.php:14
 * @route '/api/v1/widget/events'
 */
events.url = (options?: RouteQueryOptions) => {
    return events.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Widget\EventsController::__invoke
 * @see app/Http/Controllers/Widget/EventsController.php:14
 * @route '/api/v1/widget/events'
 */
events.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: events.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Widget\EventsController::__invoke
 * @see app/Http/Controllers/Widget/EventsController.php:14
 * @route '/api/v1/widget/events'
 */
    const eventsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: events.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Widget\EventsController::__invoke
 * @see app/Http/Controllers/Widget/EventsController.php:14
 * @route '/api/v1/widget/events'
 */
        eventsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: events.url(options),
            method: 'post',
        })
    
    events.form = eventsForm
/**
* @see \App\Http\Controllers\Widget\LeadController::__invoke
 * @see app/Http/Controllers/Widget/LeadController.php:16
 * @route '/api/v1/widget/leads'
 */
export const leads = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: leads.url(options),
    method: 'post',
})

leads.definition = {
    methods: ["post"],
    url: '/api/v1/widget/leads',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Widget\LeadController::__invoke
 * @see app/Http/Controllers/Widget/LeadController.php:16
 * @route '/api/v1/widget/leads'
 */
leads.url = (options?: RouteQueryOptions) => {
    return leads.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Widget\LeadController::__invoke
 * @see app/Http/Controllers/Widget/LeadController.php:16
 * @route '/api/v1/widget/leads'
 */
leads.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: leads.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Widget\LeadController::__invoke
 * @see app/Http/Controllers/Widget/LeadController.php:16
 * @route '/api/v1/widget/leads'
 */
    const leadsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: leads.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Widget\LeadController::__invoke
 * @see app/Http/Controllers/Widget/LeadController.php:16
 * @route '/api/v1/widget/leads'
 */
        leadsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: leads.url(options),
            method: 'post',
        })
    
    leads.form = leadsForm
const widget = {
    init: Object.assign(init, init),
messages: Object.assign(messages, messages4ba6e9),
events: Object.assign(events, events),
gdpr: Object.assign(gdpr, gdpr),
conversation: Object.assign(conversation, conversation),
leads: Object.assign(leads, leads),
}

export default widget