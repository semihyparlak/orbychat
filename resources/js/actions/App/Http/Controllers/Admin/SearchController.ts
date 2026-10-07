import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
 * @see app/Http/Controllers/Admin/SearchController.php:22
 * @route '/app/search'
 */
const SearchController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: SearchController.url(options),
    method: 'get',
})

SearchController.definition = {
    methods: ["get","head"],
    url: '/app/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
 * @see app/Http/Controllers/Admin/SearchController.php:22
 * @route '/app/search'
 */
SearchController.url = (options?: RouteQueryOptions) => {
    return SearchController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
 * @see app/Http/Controllers/Admin/SearchController.php:22
 * @route '/app/search'
 */
SearchController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: SearchController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
 * @see app/Http/Controllers/Admin/SearchController.php:22
 * @route '/app/search'
 */
SearchController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: SearchController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
 * @see app/Http/Controllers/Admin/SearchController.php:22
 * @route '/app/search'
 */
    const SearchControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: SearchController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
 * @see app/Http/Controllers/Admin/SearchController.php:22
 * @route '/app/search'
 */
        SearchControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: SearchController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\SearchController::__invoke
 * @see app/Http/Controllers/Admin/SearchController.php:22
 * @route '/app/search'
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