import DashboardController from './DashboardController'
import WorkspaceController from './WorkspaceController'
import UserController from './UserController'
import AgentController from './AgentController'
import ConversationController from './ConversationController'
import LeadController from './LeadController'
import SearchController from './SearchController'
import UsageController from './UsageController'
import SubscriptionController from './SubscriptionController'
import PlanController from './PlanController'
import ImpersonateController from './ImpersonateController'
import JobController from './JobController'
import KanbanBoardController from './KanbanBoardController'
import SystemController from './SystemController'
import CronWorkerController from './CronWorkerController'
const Platform = {
    DashboardController: Object.assign(DashboardController, DashboardController),
WorkspaceController: Object.assign(WorkspaceController, WorkspaceController),
UserController: Object.assign(UserController, UserController),
AgentController: Object.assign(AgentController, AgentController),
ConversationController: Object.assign(ConversationController, ConversationController),
LeadController: Object.assign(LeadController, LeadController),
SearchController: Object.assign(SearchController, SearchController),
UsageController: Object.assign(UsageController, UsageController),
SubscriptionController: Object.assign(SubscriptionController, SubscriptionController),
PlanController: Object.assign(PlanController, PlanController),
ImpersonateController: Object.assign(ImpersonateController, ImpersonateController),
JobController: Object.assign(JobController, JobController),
KanbanBoardController: Object.assign(KanbanBoardController, KanbanBoardController),
SystemController: Object.assign(SystemController, SystemController),
CronWorkerController: Object.assign(CronWorkerController, CronWorkerController),
}

export default Platform