import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Widget\GdprController::deleteMethod
 * @see app/Http/Controllers/Widget/GdprController.php:27
 * @route '/api/v1/widget/me'
 */
export const deleteMethod = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/api/v1/widget/me',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Widget\GdprController::deleteMethod
 * @see app/Http/Controllers/Widget/GdprController.php:27
 * @route '/api/v1/widget/me'
 */
deleteMethod.url = (options?: RouteQueryOptions) => {
    return deleteMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Widget\GdprController::deleteMethod
 * @see app/Http/Controllers/Widget/GdprController.php:27
 * @route '/api/v1/widget/me'
 */
deleteMethod.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Widget\GdprController::deleteMethod
 * @see app/Http/Controllers/Widget/GdprController.php:27
 * @route '/api/v1/widget/me'
 */
    const deleteMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteMethod.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Widget\GdprController::deleteMethod
 * @see app/Http/Controllers/Widget/GdprController.php:27
 * @route '/api/v1/widget/me'
 */
        deleteMethodForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteMethod.form = deleteMethodForm
const gdpr = {
    delete: Object.assign(deleteMethod, deleteMethod),
}

export default gdpr