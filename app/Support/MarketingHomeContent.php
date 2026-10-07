<?php

namespace App\Support;

use App\Models\AppSetting;

class MarketingHomeContent
{
    /**
     * Resolve the landing-page payload from the singleton settings row.
     * Missing or malformed branches fall back to the shipped defaults so
     * the homepage stays renderable even while the admin edits JSON.
     *
     * @return array<string, mixed>
     */
    public static function resolve(?array $content = null): array
    {
        $payload = $content;

        if ($payload === null) {
            $payload = AppSetting::query()->find(AppSetting::SINGLETON_ID)?->marketing_home_content;
        }

        $resolved = self::mergeNodes(self::defaults(), is_array($payload) ? $payload : []);

        // Ensure "Solutions" is always in the header if it's missing from the DB overrides
        $hasSolutions = false;
        foreach ($resolved['nav_items'] as $item) {
            if (isset($item['href']) && str_contains($item['href'], '/solutions')) {
                $hasSolutions = true;
                break;
            }
        }

        if (! $hasSolutions) {
            // Insert after Product (index 1)
            array_splice($resolved['nav_items'], 1, 0, [['label' => __('Solutions'), 'href' => '/solutions']]);
        }

        return $resolved;
    }

    public static function editorValue(?array $content = null): string
    {
        return json_encode(
            self::resolve($content),
            JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES,
        ) ?: '{}';
    }

    /**
     * @return array<string, mixed>
     */
    public static function defaults(): array
    {
        return [
            'brand_name' => 'OrbyChat',
            'nav_items' => [
                ['label' => __('Product'), 'href' => '/'],
                ['label' => __('Solutions'), 'href' => '/solutions'],
                ['label' => __('Pricing'), 'href' => '/pricing'],
                ['label' => __('How it works'), 'href' => '/how-it-works'],
                ['label' => __('Integrations'), 'href' => '/integrations'],
            ],
            'header' => [
                'resources_label' => '',
                'resources_href' => '',
                'primary_button_label' => __('Book demo'),
                'primary_button_href' => '__primary__',
            ],
            'hero' => [
                'badge' => __('AI sales assistant for high-intent pages'),
                'line_one' => __('Turn every'),
                'accent' => __('high-intent'),
                'line_two_suffix' => __('page'),
                'line_three_prefix' => __('into a'),
                'line_three_highlight' => __('sales'),
                'line_four_highlight' => __('conversation.'),
                'description' => __('OrbyChat answers questions, qualifies visitors, and guides them to the next step, so your team closes more, faster.'),
                'site_test_label' => __('Test it on your site'),
                'site_test_placeholder' => 'https://yourwebsite.com/pricing',
                'site_test_button_label' => __('Try it'),
                'site_test_helper' => __('No credit card required. Instant preview.'),
                'live_demo_notice' => __('Live demo agent is active on this page.'),
            ],
            'chat_preview' => [
                'title' => __('OrbyChat AI'),
                'badge' => __('Live'),
                'question' => __('How does your pricing work for teams of 20?'),
                'answer' => __('For teams that need scale, the Pro plan is the best fit. It includes advanced analytics, priority support, and up to 5,000 conversations.'),
                'plan_badge' => __('RECOMMENDED'),
                'plan_name' => __('Pro'),
                'plan_price' => '$99',
                'plan_interval' => __('/month'),
                'plan_note' => __('Billed monthly for up to 5,000 conversations'),
                'plan_features' => [
                    __('Advanced analytics'),
                    __('Priority support'),
                    __('Unlimited pages'),
                ],
                'plan_button_label' => __('Start Pro plan'),
                'typing_label' => __('AI is typing...'),
                'powered_by_prefix' => __('Powered by'),
            ],
            'stats' => [
                [
                    'icon' => 'BarChart3',
                    'value' => '53%',
                    'label' => __('Lift in conversions on high-intent pages'),
                ],
                [
                    'icon' => 'Zap',
                    'value' => '<1s',
                    'label' => __('Average response time'),
                ],
                [
                    'icon' => 'Clock3',
                    'value' => '5 min',
                    'label' => __('Setup time to go live'),
                ],
                [
                    'icon' => 'Target',
                    'value' => '24/7',
                    'label' => __('Always-on conversations that never sleep'),
                ],
            ],
            'video' => [
                'badge' => __('Video walkthrough'),
                'title' => __('Watch OrbyChat handle a real buyer question.'),
                'description' => __('This short walkthrough shows how the assistant appears on a high-intent page, answers with the right context, and guides the visitor to the best next step.'),
                'bullets' => [
                    __('Trigger the assistant on pricing and product pages'),
                    __('Answer product questions with relevant context'),
                    __('Route qualified visitors to the right CTA'),
                ],
                'duration_label' => __('2 min walkthrough'),
                'tag_label' => __('Pricing page demo'),
                'scene_label' => __('Scene 01'),
                'card_title' => __('Pricing page questions, answered in context.'),
                'timecode' => '02:18',
                'chips' => [
                    __('Greeting trigger'),
                    __('Plan recommendation'),
                    __('CTA handoff'),
                ],
                'footer_title' => __('See how the assistant greets, answers, qualifies, and routes in one flow.'),
                'footer_description' => __('Open the walkthrough for the full product story before you scroll into the rest of the page.'),
                'button_label' => __('Watch video'),
                'href' => 'https://vimeo.com/1190236104',
            ],
            'where_it_fits' => [
                'badge' => __('Where it fits'),
                'title' => __('Built for the pages that drive the right conversations.'),
                'cards' => [
                    [
                        'icon' => 'Tags',
                        'title' => __('Pricing pages'),
                        'description' => __('Answer pricing questions, compare plans, and convert more visitors.'),
                    ],
                    [
                        'icon' => 'Box',
                        'title' => __('Product pages'),
                        'description' => __('Explain features, highlight benefits, and move buyers forward.'),
                    ],
                    [
                        'icon' => 'BookOpen',
                        'title' => __('Docs & help pages'),
                        'description' => __('Resolve questions, point to answers, and reduce support load.'),
                    ],
                ],
            ],
            'feature_grid' => [
                'badge' => __('Powerful under the hood'),
                'title' => __('Simple for visitors. Fully controlled by your team.'),
                'cards' => [
                    [
                        'icon' => 'Tags',
                        'title' => __('Behavior triggers'),
                        'description' => __('Awake the right message at the right moment based on visitor intent and page context.'),
                    ],
                    [
                        'icon' => 'Zap',
                        'title' => __('Streaming answers'),
                        'description' => __('Real-time, cited answers sourced from your content for instant clarity.'),
                    ],
                    [
                        'icon' => 'Target',
                        'title' => __('Smart CTAs'),
                        'description' => __('AI recommends the next best step and routes visitors to the right action.'),
                    ],
                    [
                        'icon' => 'CircleCheck',
                        'title' => __('Auto-trains on your content'),
                        'description' => __('Continuously learns from your docs, pages, and updates with no manual retraining.'),
                    ],
                    [
                        'icon' => 'ClipboardList',
                        'title' => __('Lead capture & routing'),
                        'description' => __('Qualify leads, capture details, and route to the right person or system.'),
                    ],
                    [
                        'icon' => 'TrendingUp',
                        'title' => __('Self-improving insights'),
                        'description' => __('Surface what visitors ask, where they drop off, and how to improve conversions.'),
                    ],
                ],
            ],
            'rich_features' => [
                'badge' => __('Next-gen capabilities'),
                'title' => __('Go beyond basic chat with rich interactions.'),
                'items' => [
                    [
                        'id' => 'appointments',
                        'icon' => 'Clock3',
                        'title' => __('Appointment Scheduling'),
                        'description' => __('Directly book meetings and demos within the chat thread. AI handles the availability check and confirms the slot.'),
                        'feature_label' => __('Book a slot'),
                    ],
                    [
                        'id' => 'ecommerce',
                        'icon' => 'ShoppingCart',
                        'title' => __('E-commerce Integration'),
                        'description' => __('Connect your Shopify or Ikas store. The AI can recommend products, check inventory, and guide visitors to checkout.'),
                        'feature_label' => __('Sell products'),
                    ],
                    [
                        'id' => 'leads',
                        'icon' => 'ClipboardList',
                        'title' => __('Smart Lead Capture'),
                        'description' => __('Dynamic forms that appear exactly when the AI detects high intent. Fully customizable fields and instant routing.'),
                        'feature_label' => __('High-intent forms'),
                    ],
                ],
            ],
            'control' => [
                'badge' => __('You are in control'),
                'title' => __('Tune the AI to match your messaging and goals.'),
                'description' => __('OrbyChat adapts to your voice, your offer, and your go-to-market motion, so every conversation feels on-brand and on-strategy.'),
                'callouts' => [
                    [
                        'icon' => 'ShieldCheck',
                        'title' => __('Enterprise ready'),
                        'description' => __('SSO, SOC 2, GDPR compliant, and built with security in mind.'),
                    ],
                    [
                        'icon' => 'LockKeyhole',
                        'title' => __('Your data stays yours'),
                        'description' => __('We use your content to answer, never to train public models.'),
                    ],
                ],
                'settings_card_title' => __('Conversation settings'),
                'settings_rows' => [
                    [
                        'label' => __('Trigger rule'),
                        'hint' => __('When should OrbyChat appear?'),
                        'value' => __('High intent - Pricing page'),
                    ],
                    [
                        'label' => __('Answer style'),
                        'hint' => __('How should OrbyChat respond?'),
                        'value' => __('Helpful, concise, and solution-oriented'),
                    ],
                    [
                        'label' => __('CTA routing'),
                        'hint' => __('Where should visitors go next?'),
                        'value' => __('Route to Plan selection page'),
                    ],
                    [
                        'label' => __('Follow-up signal'),
                        'hint' => __('When should OrbyChat re-engage?'),
                        'value' => __('After 30s of inactivity'),
                    ],
                ],
                'cancel_label' => __('Cancel'),
                'save_button_label' => __('Save changes'),
            ],
            'steps' => [
                'badge' => __('From paste to live'),
                'title' => __('From paste to live in 3 simple steps.'),
                'items' => [
                    [
                        'icon' => 'ClipboardList',
                        'title' => __('Paste your content'),
                        'description' => __('Add URLs, docs, or copy. OrbyChat learns your content automatically.'),
                    ],
                    [
                        'icon' => 'Sparkles',
                        'title' => __('Configure & customize'),
                        'description' => __('Set triggers, tone, CTAs, and routing in minutes.'),
                    ],
                    [
                        'icon' => 'CircleCheck',
                        'title' => __('Go live & optimize'),
                        'description' => __('Embed with one line of code and start improving conversations.'),
                    ],
                ],
            ],
            'insights' => [
                'badge' => __('Insights that drive growth'),
                'chart_title' => __('Every conversation becomes a signal.'),
                'chart_description' => __('See what visitors ask, what moves them forward, and where you can improve.'),
                'metric_label' => __('Conversations'),
                'metric_value' => '12,842',
                'metric_trend' => __('+28% vs last 30 days'),
                'chart_points' => [45, 53, 62, 80, 77, 91, 87, 103, 119, 111, 127, 141, 135, 160, 154, 178],
                'chart_labels' => [__('Apr 19'), __('Apr 26'), __('May 3'), __('May 10'), __('May 17')],
                'cards' => [
                    [
                        'icon' => 'Sparkles',
                        'title' => __('Curated answers'),
                        'description' => __('Top visitor questions and your best performing answers.'),
                    ],
                    [
                        'icon' => 'ClipboardList',
                        'title' => __('Experiments'),
                        'description' => __('Test messages and CTAs to see what drives more conversions.'),
                    ],
                    [
                        'icon' => 'ShieldCheck',
                        'title' => __('Lead context'),
                        'description' => __('See where leads came from and what they were interested in.'),
                    ],
                ],
            ],
            'testimonials' => [
                'badge' => __('What teams are saying'),
                'title' => __('Trusted by teams who care about every visitor'),
                'kicker' => __('From founders, growth leads, and customer-experience teams running OrbyChat on their busiest pages.'),
                'items' => [
                    [
                        'name' => 'Maya R.',
                        'role' => __('Head of Growth'),
                        'company' => 'Northpath SaaS',
                        'quote' => __('We replaced a static FAQ widget with OrbyChat and lifted demo bookings 38% in the first month. The keyword-triggered handoff to our SDR Slack is the part our team loves the most.'),
                    ],
                    [
                        'name' => 'Daniel K.',
                        'role' => __('Founder'),
                        'company' => 'Hopper Print Co.',
                        'quote' => __('Buyers ask for shipping ETAs in a dozen ways. OrbyChat answers from our actual store policies, not a hallucinated guess. Refund requests are down because the bot answers them correctly the first time.'),
                    ],
                    [
                        'name' => 'Priya S.',
                        'role' => __('Customer Experience Lead'),
                        'company' => 'Loom Logistics',
                        'quote' => __('The pre-chat lead gate is what closed the deal for us — every conversation comes with name + email up front, so the inbox is qualified before a human touches it.'),
                    ],
                    [
                        'name' => 'Alex T.',
                        'role' => __('CTO'),
                        'company' => 'Ledgerstack',
                        'quote' => __('I evaluated five chat tools. OrbyChat was the only one we could self-host on our own Cloudflare account in under an hour, with the data never leaving our infra. The widget is also tiny — 18 KB gzipped, you can feel it.'),
                    ],
                    [
                        'name' => 'Sara N.',
                        'role' => __('Marketing Manager'),
                        'company' => 'Crestform Studio',
                        'quote' => __('The visual workflow editor felt familiar from day one — anyone who has used a chatbot builder before can pick it up. The branching means our refund flow actually qualifies the right leads, not just everyone with the word "refund".'),
                    ],
                ],
            ],
            'faq' => [
                'badge' => __('Frequently asked'),
                'title' => __('Everything you need to know'),
                'kicker' => __('Have a question we missed? Open the assistant on this page and ask it — that\'s the bot answering from our own docs.'),
                'items' => [
                    [
                        'question' => __('How does OrbyChat know what to say to my visitors?'),
                        'answer' => __('It reads your website, docs, and any extra knowledge sources you upload. Every visitor turn runs retrieval-augmented generation — the bot grounds every reply in chunks pulled from your real content, with citations the visitor can click. There is no LLM hallucination on facts you have not provided.'),
                    ],
                    [
                        'question' => __('Will it slow down my page?'),
                        'answer' => __('The widget bundle is roughly 18 KB gzipped and lazy-loads on first visitor interaction. Your page paint is unaffected. The chat itself streams the first token within a second; the latency budget is enforced by the engineering team and regression-tested.'),
                    ],
                    [
                        'question' => __('Is it hard to install OrbyChat on my site?'),
                        'answer' => __('Absolutely not! Just copy a single line of code and paste it into your website. It works seamlessly with WordPress, Wix, Shopify, or custom sites in seconds.'),
                    ],
                    [
                        'question' => __('Can I use OrbyChat on multiple websites?'),
                        'answer' => __('Yes! You can install the widget on any number of domains. You can manage multiple agents from a single dashboard and track performance across all your sites.'),
                    ],
                    [
                        'question' => __('Can I customise the widget look?'),
                        'answer' => __('The Customize page on every agent lets you set the primary + accent colours, corner radius, position (centered bar, bottom-right bubble, bottom-left), launcher label, persona name, and starter prompts. The pre-chat lead gate, the lead form fields, and the per-page restricted-paths list are all per-agent toggles too.'),
                    ],
                    [
                        'question' => __('How are leads captured?'),
                        'answer' => __('Two ways. Either the LLM raises a lead-capture signal mid-conversation (e.g. when the visitor expresses buying intent), in which case an inline form drops into the chat thread; or you turn on the pre-chat name+email gate and the visitor identifies themselves before chatting. Each agent can also have a custom lead-form schema with text/email/tel/textarea/select/checkbox fields.'),
                    ],
                    [
                        'question' => __('Does it handle multiple languages?'),
                        'answer' => __('Yes. Each agent picks a default language; visitors are auto-detected from their Accept-Language header. The supported set in the Customize panel is en, es, fr, de, pt, ja, ar, zh — adding more is a single-line edit in the form-request validator.'),
                    ],
                    [
                        'question' => __('Can the bot hand off to a human?'),
                        'answer' => __('Yes. Workflows can be set up to detect handoff intent (a keyword, an explicit "talk to a human" message, or a sentiment-routing rule) and surface a Live Agent panel inside the widget. Workspace members on the dashboard see the conversation in real time and can take over.'),
                    ],
                    [
                        'question' => __('What about GDPR / data privacy?'),
                        'answer' => __('Visitor email + name only enter the database when they fill in a lead form. The chat transcript itself is workspace-scoped and deletable. Buyers running OrbyChat in regulated industries get the full benefit of self-hosting: the data never leaves your AWS / GCP / Hetzner / bare-metal box.'),
                    ],
                    [
                        'question' => __('Do I need a credit card to try it?'),
                        'answer' => __('No. The free tier lets you create one agent, ingest a few sources, and have up to 50 conversations. Paid plans unlock additional agents, higher conversation caps, and white-label removal of the Powered by footer.'),
                    ],
                ],
            ],
            'final_cta' => [
                'title' => __('Ready to turn more traffic into pipeline?'),
                'description' => __('Join leading teams who use OrbyChat to have more conversations, close more deals, and grow faster.'),
                'primary_button_label' => __('Book a demo'),
                'primary_button_href' => '__primary__',
                'secondary_button_label' => __('Try live demo'),
                'secondary_button_href' => '__primary__',
            ],
            'footer' => [
                'brand_description' => __('AI sales assistant for high-intent pages that drives real results.'),
                'socials' => [
                    ['label' => 'in', 'href' => '#'],
                    ['label' => 'X', 'href' => '#'],
                    ['label' => 'yt', 'href' => '#'],
                ],
                'groups' => [
                    [
                        'title' => __('Product'),
                        'links' => [
                            ['label' => __('Solutions'), 'href' => '/solutions'],
                            ['label' => __('How it works'), 'href' => '/how-it-works'],
                            ['label' => __('Pricing'), 'href' => '/pricing'],
                            ['label' => __('Integrations'), 'href' => '/integrations'],
                        ],
                    ],
                ],
                'legal_title' => __('Legal'),
                'legal_links' => [
                    ['label' => __('Privacy'), 'href' => '/privacy'],
                    ['label' => __('Terms'), 'href' => '/terms'],
                    ['label' => __('Security'), 'href' => '/privacy'],
                    ['label' => __('Trust center'), 'href' => '/terms'],
                ],
                'copyright' => __('Copyright 2026 OrbyChat. All rights reserved.'),
            ],
        ];
    }

    private static function mergeNodes(mixed $defaults, mixed $overrides): mixed
    {
        if (is_array($defaults)) {
            if (! is_array($overrides)) {
                return $defaults;
            }

            if (array_is_list($defaults)) {
                $template = $defaults[0] ?? null;
                $resolved = [];

                foreach ($overrides as $index => $overrideNode) {
                    $defaultNode = $defaults[$index] ?? $template;

                    if ($defaultNode === null) {
                        $resolved[] = $overrideNode;

                        continue;
                    }

                    $resolved[] = self::mergeNodes($defaultNode, $overrideNode);
                }

                return $resolved;
            }

            $resolved = [];

            foreach ($defaults as $key => $value) {
                $resolved[$key] = self::mergeNodes($value, $overrides[$key] ?? null);
            }

            return $resolved;
        }

        if (is_string($defaults)) {
            return is_scalar($overrides) ? (string) $overrides : $defaults;
        }

        if (is_int($defaults)) {
            return is_numeric($overrides) ? (int) $overrides : $defaults;
        }

        if (is_float($defaults)) {
            return is_numeric($overrides) ? (float) $overrides : $defaults;
        }

        if (is_bool($defaults)) {
            return is_bool($overrides) ? $overrides : $defaults;
        }

        return $overrides ?? $defaults;
    }
}
