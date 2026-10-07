import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Widget\InitController::__invoke
 * @see app/Http/Controllers/Widget/InitController.php:29
 * @route '/api/v1/widget/init'
 */
const InitController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: InitController.url(options),
    method: 'post',
})

InitController.definition = {
    methods: ["post"],
    url: '/api/v1/widget/init',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Widget\InitController::__invoke
 * @see app/Http/Controllers/Widget/InitController.php:29
 * @route '/api/v1/widget/init'
 */
InitController.url = (options?: RouteQueryOptions) => {
    return InitController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Widget\InitController::__invoke
 * @see app/Http/Controllers/Widget/InitController.php:29
 * @route '/api/v1/widget/init'
 */
InitController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: InitController.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Widget\InitController::__invoke
 * @see app/Http/Controllers/Widget/InitController.php:29
 * @route '/api/v1/widget/init'
 */
    const InitControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: InitController.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Widget\InitController::__invoke
 * @see app/Http/Controllers/Widget/InitController.php:29
 * @route '/api/v1/widget/init'
 */
        InitControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: InitController.url(options),
            method: 'post',
        })
    
    InitController.form = InitControllerForm
export default InitController