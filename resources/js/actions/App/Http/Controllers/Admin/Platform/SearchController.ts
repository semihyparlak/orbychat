import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Platform\SearchController::__invoke
 * @see app/Http/Controllers/Admin/Platform/SearchController.php:15
 * @route '/admin/search'
 */
const SearchController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: SearchController.url(options),
    method: 'get',
})

SearchController.definition = {
    methods: ["get","head"],
    url: '/admin/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SearchController::__invoke
 * @see app/Http/Controllers/Admin/Platform/SearchController.php:15
 * @route '/admin/search'
 */
SearchController.url = (options?: RouteQueryOptions) => {
    return SearchController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SearchController::__invoke
 * @see app/Http/Controllers/Admin/Platform/SearchController.php:15
 * @route '/admin/search'
 */
SearchController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: SearchController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\SearchController::__invoke
 * @see app/Http/Controllers/Admin/Platform/SearchController.php:15
 * @route '/admin/search'
 */
SearchController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: SearchController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SearchController::__invoke
 * @see app/Http/Controllers/Admin/Platform/SearchController.php:15
 * @route '/admin/search'
 */
    const SearchControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: SearchController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SearchController::__invoke
 * @see app/Http/Controllers/Admin/Platform/SearchController.php:15
 * @route '/admin/search'
 */
        SearchControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: SearchController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\SearchController::__invoke
 * @see app/Http/Controllers/Admin/Platform/SearchController.php:15
 * @route '/admin/search'
 */
        SearchControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: SearchController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    SearchController.form = SearchControllerForm
export default SearchController