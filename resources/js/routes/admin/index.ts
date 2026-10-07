import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import workspaces from './workspaces'
import users from './users'
import agents from './agents'
import conversations from './conversations'
import leads from './leads'
import usage from './usage'
import subscriptions from './subscriptions'
import plans from './plans'
import impersonate from './impersonate'
import jobs from './jobs'
import board from './board'
/**
* @see \App\Http\Controllers\Admin\Platform\DashboardController::__invoke
 * @see app/Http/Controllers/Admin/Platform/DashboardController.php:31
 * @route '/admin'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\DashboardController::__invoke
 * @see app/Http/Controllers/Admin/Platform/DashboardController.php:31
 * @route '/admin'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\DashboardController::__invoke
 * @see app/Http/Controllers/Admin/Platform/DashboardController.php:31
 * @route '/admin'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\DashboardController::__invoke
 * @see app/Http/Controllers/Admin/Platform/DashboardController.php:31
 * @route '/admin'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\DashboardController::__invoke
 * @see app/Http/Controllers/Admin/Platform/DashboardController.php:31
 * @route '/admin'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\DashboardController::__invoke
 * @see app/Http/Controllers/Admin/Platform/DashboardController.php:31
 * @route '/admin'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\DashboardController::__invoke
 * @see app/Http/Controllers/Admin/Platform/DashboardController.php:31
 * @route '/admin'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\Admin\Platform\SearchController::__invoke
 * @see app/Http/Controllers/Admin/Platform/SearchController.php:15
 * @route '/admin/search'
 */
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/admin/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Platform\SearchController::__invoke
 * @see app/Http/Controllers/Admin/Platform/SearchController.php:15
 * @route '/admin/search'
 */
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Platform\SearchController::__invoke
 * @see app/Http/Controllers/Admin/Platform/SearchController.php:15
 * @route '/admin/search'
 */
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Platform\SearchController::__invoke
 * @see app/Http/Controllers/Admin/Platform/SearchController.php:15
 * @route '/admin/search'
 */
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\Platform\SearchController::__invoke
 * @see app/Http/Controllers/Admin/Platform/SearchController.php:15
 * @route '/admin/search'
 */
    const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: search.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\Platform\SearchController::__invoke
 * @see app/Http/Controllers/Admin/Platform/SearchController.php:15
 * @route '/admin/search'
 */
        searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\Platform\SearchController::__invoke
 * @see app/Http/Controllers/Admin/Platform/SearchController.php:15
 * @route '/admin/search'
 */
        searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    search.form = searchForm
const admin = {
    dashboard: Object.assign(dashboard, dashboard),
workspaces: Object.assign(workspaces, workspaces),
users: Object.assign(users, users),
agents: Object.assign(agents, agents),
conversations: Object.assign(conversations, conversations),
leads: Object.assign(leads, leads),
search: Object.assign(search, search),
usage: Object.assign(usage, usage),
subscriptions: Object.assign(subscriptions, subscriptions),
plans: Object.assign(plans, plans),
impersonate: Object.assign(impersonate, impersonate),
jobs: Object.assign(jobs, jobs),
board: Object.assign(board, board),
}

export default admin