import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\KnowledgeController::reindex
 * @see app/Http/Controllers/Admin/KnowledgeController.php:124
 * @route '/app/documents/{document}/reindex'
 */
export const reindex = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reindex.url(args, options),
    method: 'post',
})

reindex.definition = {
    methods: ["post"],
    url: '/app/documents/{document}/reindex',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\KnowledgeController::reindex
 * @see app/Http/Controllers/Admin/KnowledgeController.php:124
 * @route '/app/documents/{document}/reindex'
 */
reindex.url = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { document: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    document: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return reindex.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\KnowledgeController::reindex
 * @see app/Http/Controllers/Admin/KnowledgeController.php:124
 * @route '/app/documents/{document}/reindex'
 */
reindex.post = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reindex.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\KnowledgeController::reindex
 * @see app/Http/Controllers/Admin/KnowledgeController.php:124
 * @route '/app/documents/{document}/reindex'
 */
    const reindexForm = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reindex.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\KnowledgeController::reindex
 * @see app/Http/Controllers/Admin/KnowledgeController.php:124
 * @route '/app/documents/{document}/reindex'
 */
        reindexForm.post = (args: { document: string | number | { id: string | number } } | [document: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reindex.url(args, options),
            method: 'post',
        })
    
    reindex.form = reindexForm
const documents = {
    reindex: Object.assign(reindex, reindex),
}

export default documents