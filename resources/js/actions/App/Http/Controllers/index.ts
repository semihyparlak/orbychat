import Widget from './Widget'
import Internal from './Internal'
import MarketingController from './MarketingController'
import SeoController from './SeoController'
import Admin from './Admin'
import Billing from './Billing'
import Settings from './Settings'
const Controllers = {
    Widget: Object.assign(Widget, Widget),
Internal: Object.assign(Internal, Internal),
MarketingController: Object.assign(MarketingController, MarketingController),
SeoController: Object.assign(SeoController, SeoController),
Admin: Object.assign(Admin, Admin),
Billing: Object.assign(Billing, Billing),
Settings: Object.assign(Settings, Settings),
}

export default Controllers