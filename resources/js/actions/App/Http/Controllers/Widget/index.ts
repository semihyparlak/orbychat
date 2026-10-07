import InitController from './InitController'
import MessageController from './MessageController'
import MessageStreamController from './MessageStreamController'
import EventsController from './EventsController'
import GdprController from './GdprController'
import ConversationMessagesController from './ConversationMessagesController'
import ConversationClearController from './ConversationClearController'
import LeadController from './LeadController'
const Widget = {
    InitController: Object.assign(InitController, InitController),
MessageController: Object.assign(MessageController, MessageController),
MessageStreamController: Object.assign(MessageStreamController, MessageStreamController),
EventsController: Object.assign(EventsController, EventsController),
GdprController: Object.assign(GdprController, GdprController),
ConversationMessagesController: Object.assign(ConversationMessagesController, ConversationMessagesController),
ConversationClearController: Object.assign(ConversationClearController, ConversationClearController),
LeadController: Object.assign(LeadController, LeadController),
}

export default Widget