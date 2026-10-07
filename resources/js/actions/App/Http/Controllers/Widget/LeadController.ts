import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Widget\LeadController::__invoke
 * @see app/Http/Controllers/Widget/LeadController.php:16
 * @route '/api/v1/widget/leads'
 */
const LeadController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: LeadController.url(options),
    method: 'post',
})

LeadController.definition = {
    methods: ["post"],
    url: '/api/v1/widget/leads',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Widget\LeadController::__invoke
 * @see app/Http/Controllers/Widget/LeadController.php:16
 * @route '/api/v1/widget/leads'
 */
LeadController.url = (options?: RouteQueryOptions) => {
    return LeadController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Widget\LeadController::__invoke
 * @see app/Http/Controllers/Widget/LeadController.php:16
 * @route '/api/v1/widget/leads'
 */
LeadController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: LeadController.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Widget\LeadController::__invoke
 * @see app/Http/Controllers/Widget/LeadController.php:16
 * @route '/api/v1/widget/leads'
 */
    const LeadControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: LeadController.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Widget\LeadController::__invoke
 * @see app/Http/Controllers/Widget/LeadController.php:16
 * @route '/api/v1/widget/leads'
 */
        LeadControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: LeadController.url(options),
            method: 'post',
        })
    
    LeadController.form = LeadControllerForm
export default LeadController