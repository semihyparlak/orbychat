import notion from './notion'
import google from './google'
const oauth = {
    notion: Object.assign(notion, notion),
google: Object.assign(google, google),
}

export default oauth