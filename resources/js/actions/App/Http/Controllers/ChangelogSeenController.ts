import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ChangelogSeenController::__invoke
 * @see app/Http/Controllers/ChangelogSeenController.php:15
 * @route '/changelog/seen'
 */
const ChangelogSeenController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ChangelogSeenController.url(options),
    method: 'post',
})

ChangelogSeenController.definition = {
    methods: ["post"],
    url: '/changelog/seen',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ChangelogSeenController::__invoke
 * @see app/Http/Controllers/ChangelogSeenController.php:15
 * @route '/changelog/seen'
 */
ChangelogSeenController.url = (options?: RouteQueryOptions) => {
    return ChangelogSeenController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ChangelogSeenController::__invoke
 * @see app/Http/Controllers/ChangelogSeenController.php:15
 * @route '/changelog/seen'
 */
ChangelogSeenController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ChangelogSeenController.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ChangelogSeenController::__invoke
 * @see app/Http/Controllers/ChangelogSeenController.php:15
 * @route '/changelog/seen'
 */
    const ChangelogSeenControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: ChangelogSeenController.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ChangelogSeenController::__invoke
 * @see app/Http/Controllers/ChangelogSeenController.php:15
 * @route '/changelog/seen'
 */
        ChangelogSeenControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: ChangelogSeenController.url(options),
            method: 'post',
        })
    
    ChangelogSeenController.form = ChangelogSeenControllerForm
export default ChangelogSeenController