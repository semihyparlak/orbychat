import ProfileController from './ProfileController'
import SecurityController from './SecurityController'
import WidgetController from './WidgetController'
const Settings = {
    ProfileController: Object.assign(ProfileController, ProfileController),
SecurityController: Object.assign(SecurityController, SecurityController),
WidgetController: Object.assign(WidgetController, WidgetController),
}

export default Settings