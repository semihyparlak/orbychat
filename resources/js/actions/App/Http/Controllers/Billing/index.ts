import WebhookController from './WebhookController'
import PayPalWebhookController from './PayPalWebhookController'
import RazorpayWebhookController from './RazorpayWebhookController'
import CheckoutController from './CheckoutController'
const Billing = {
    WebhookController: Object.assign(WebhookController, WebhookController),
PayPalWebhookController: Object.assign(PayPalWebhookController, PayPalWebhookController),
RazorpayWebhookController: Object.assign(RazorpayWebhookController, RazorpayWebhookController),
CheckoutController: Object.assign(CheckoutController, CheckoutController),
}

export default Billing