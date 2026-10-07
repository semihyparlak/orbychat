<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use App\Support\MarketingDemoAgent;
use App\Support\MarketingHomeContent;
use App\Support\MarketingShellContent;
use App\Support\PrivacyPolicyContent;
use App\Support\SeoMeta;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class MarketingController
{
    public function home(): Response
    {
        $settings = AppSetting::singleton();
        $content = MarketingHomeContent::resolve($settings->marketing_home_content);

        return Inertia::render('welcome', [
            'canRegister' => Route::has('register'),
            'demoAgentId' => MarketingDemoAgent::id(),
            'content' => $content,
            'seo' => SeoMeta::for('home', [
                'faq_items' => $content['faq']['items'] ?? [],
            ]),
        ]);
    }

    public function pricing(): Response
    {
        return Inertia::render('marketing/pricing', [
            'canRegister' => Route::has('register'),
            'shell' => MarketingShellContent::resolve(),
            'brand' => $this->brand(),
            'plans' => $this->pricingPlans(),
            'matrix' => $this->pricingMatrix(),
            'faqs' => $this->pricingFaqs(),
            'contact_email' => $this->contactEmail(),
            'seo' => SeoMeta::for('pricing'),
        ]);
    }

    public function howItWorks(): Response
    {
        return Inertia::render('marketing/how-it-works', [
            'canRegister' => Route::has('register'),
            'shell' => MarketingShellContent::resolve(),
            'brand' => $this->brand(),
            'steps' => $this->howItWorksSteps(),
            'latency' => $this->latencyBudget(),
            'seo' => SeoMeta::for('how-it-works'),
        ]);
    }

    public function integrations(): Response
    {
        return Inertia::render('marketing/integrations', [
            'canRegister' => Route::has('register'),
            'shell' => MarketingShellContent::resolve(),
            'brand' => $this->brand(),
            'native' => $this->nativeIntegrations(),
            'data_sources' => $this->dataSourceIntegrations(),
            'roadmap' => $this->roadmapIntegrations(),
            'seo' => SeoMeta::for('integrations'),
        ]);
    }

    public function privacy(): Response
    {
        $settings = AppSetting::singleton();

        return Inertia::render('marketing/privacy', [
            'canRegister' => Route::has('register'),
            'shell' => MarketingShellContent::resolve(),
            'brand' => $this->brand(),
            'content' => PrivacyPolicyContent::resolve($settings->privacy_policy_content),
            'seo' => SeoMeta::for('privacy'),
        ]);
    }

    public function terms(): Response
    {
        return Inertia::render('marketing/terms', [
            'canRegister' => Route::has('register'),
            'shell' => MarketingShellContent::resolve(),
            'brand' => $this->brand(),
            'effective_date' => (string) config('branding.terms_effective_date', now()->format('F j, Y')),
            'contact_email' => $this->contactEmail(),
            'intro' => $this->termsIntro(),
            'sections' => $this->termsSections(),
            'seo' => SeoMeta::for('terms'),
        ]);
    }

    public function solution(string $vertical): Response
    {
        $registry = app(\App\Services\Vertical\VerticalPresetRegistry::class);
        if (! in_array($vertical, \App\Services\Vertical\VerticalPresets::SLUGS)) {
            abort(404);
        }

        $preset = $registry->for($vertical);

        return Inertia::render('marketing/solution', [
            'canRegister' => Route::has('register'),
            'shell' => MarketingShellContent::resolve(),
            'brand' => $this->brand(),
            'vertical' => [
                'id' => $preset->slug(),
                'name' => $preset->label(),
                'description' => $preset->shortDescription(),
                'prompts' => $preset->starterPrompts(),
                'capabilities' => $preset->capabilities(),
                'sample_answer' => $preset->sampleAnswer(),
            ],
            'seo' => SeoMeta::for('marketing.solutions', [
                'page_title' => $preset->label(),
                'page_summary' => $preset->shortDescription(),
                'path' => "/solutions/{$vertical}",
            ]),
        ]);
    }

    public function solutionsIndex(): Response
    {
        $registry = app(\App\Services\Vertical\VerticalPresetRegistry::class);
        $presets = [];
        foreach ($registry->all() as $slug => $preset) {
            $presets[] = [
                'slug' => $slug,
                'label' => $preset->label(),
                'description' => $preset->shortDescription(),
            ];
        }

        return Inertia::render('marketing/solutions', [
            'canRegister' => Route::has('register'),
            'shell' => MarketingShellContent::resolve(),
            'brand' => $this->brand(),
            'presets' => $presets,
            'seo' => SeoMeta::for('marketing.solutions.index'),
        ]);
    }

    /**
     * Capture the domain and stash it in a short-lived token so the signup flow can
     * pre-fill and trigger an automatic crawl after the user finishes registration.
     */
    public function start(Request $request): RedirectResponse
    {
        $data = $request->validate(['domain' => ['required', 'url', 'max:500']]);

        $token = Str::random(32);
        Cache::put("marketing:domain:{$token}", $data['domain'], now()->addHours(2));

        // Persist on session so CreateNewUser can pick it up after registration.
        $request->session()->put('marketing.start_domain', $data['domain']);

        return redirect()->to('/register?domain='.urlencode($data['domain']).'&start_token='.$token);
    }

    private function brand(): string
    {
        return (string) config('branding.site_title', 'OrbyChat');
    }

    private function contactEmail(): string
    {
        return (string) config('mail.from.address', 'support@example.com');
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function pricingPlans(): array
    {
        $brand = $this->brand();

        return [
            [
                'name' => __('Free'),
                'monthly_price' => 0,
                'yearly_price' => 0,
                'tagline' => __('Try it on your live site.'),
                'volume' => __('50 conversations / month'),
                'cta_label' => __('Start free'),
                'cta_href' => '/register',
                'highlight' => false,
                'features' => [
                    __('1 published agent'),
                    __('URL + sitemap + text knowledge sources'),
                    __('Lead capture inbox'),
                    __('Slack & outgoing webhook integrations'),
                    __(':brand branding shown', ['brand' => $brand]),
                ],
            ],
            [
                'name' => __('Standard'),
                'monthly_price' => 29,
                'yearly_price' => 290,
                'tagline' => __('For real traffic.'),
                'volume' => __('1,000 conversations / month'),
                'cta_label' => __('Start with Standard'),
                'cta_href' => '/register',
                'highlight' => true,
                'features' => [
                    __('5 published agents'),
                    __('Everything in Free, plus:'),
                    __('A/B testing on behavior rules'),
                    __('Content gap analytics'),
                    __('Notion + Google Doc knowledge sources'),
                    __('Branding removed from widget'),
                    __('Email support'),
                ],
            ],
            [
                'name' => __('Pro'),
                'monthly_price' => 99,
                'yearly_price' => 990,
                'tagline' => __('For teams that need scale.'),
                'volume' => __('5,000 conversations / month'),
                'cta_label' => __('Start with Pro'),
                'cta_href' => '/register',
                'highlight' => false,
                'features' => [
                    __('Unlimited agents'),
                    __('Everything in Standard, plus:'),
                    __('HubSpot + Pipedrive native sync'),
                    __('Higher LLM rate limits'),
                    __('Custom domain for the widget'),
                    __('Priority support, 8h SLA'),
                ],
            ],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function pricingMatrix(): array
    {
        return [
            ['label' => __('Published agents'), 'free' => '1', 'standard' => '5', 'pro' => __('Unlimited')],
            ['label' => __('Monthly conversations'), 'free' => '50', 'standard' => '1,000', 'pro' => '5,000'],
            ['label' => __('Voice mic on widget'), 'free' => true, 'standard' => true, 'pro' => true],
            ['label' => __('Lead capture + inbox'), 'free' => true, 'standard' => true, 'pro' => true],
            ['label' => __('Persistent visitor sessions'), 'free' => true, 'standard' => true, 'pro' => true],
            ['label' => __('URL / sitemap / text sources'), 'free' => true, 'standard' => true, 'pro' => true],
            ['label' => __('Notion + Google Doc sources'), 'free' => false, 'standard' => true, 'pro' => true],
            ['label' => __('Auto-index visited pages'), 'free' => true, 'standard' => true, 'pro' => true],
            ['label' => __('8 widget languages'), 'free' => true, 'standard' => true, 'pro' => true],
            ['label' => __('A/B testing + content gaps'), 'free' => false, 'standard' => true, 'pro' => true],
            ['label' => __('Behavior rules + CTAs'), 'free' => true, 'standard' => true, 'pro' => true],
            ['label' => __('Curated answers'), 'free' => true, 'standard' => true, 'pro' => true],
            ['label' => __('Branding removed'), 'free' => false, 'standard' => true, 'pro' => true],
            ['label' => __('Slack + outgoing webhooks'), 'free' => true, 'standard' => true, 'pro' => true],
            ['label' => __('HubSpot + Pipedrive native'), 'free' => false, 'standard' => false, 'pro' => true],
            ['label' => __('Custom widget domain'), 'free' => false, 'standard' => false, 'pro' => true],
            ['label' => __('Workspace members'), 'free' => '2', 'standard' => '10', 'pro' => __('Unlimited')],
            ['label' => __('Support'), 'free' => __('Community'), 'standard' => __('Email'), 'pro' => __('Priority, 8h SLA')],
        ];
    }

    /**
     * @return list<array{q: string, a: string}>
     */
    private function pricingFaqs(): array
    {
        $contact = $this->contactEmail();
        $brand = $this->brand();

        return [
            ['q' => __('What counts as a conversation?'), 'a' => __('A conversation is metered the moment a visitor sends their first message. Resumed conversations within 24 hours don\'t count again. Playground / staging traffic is exempt.')],
            ['q' => __('What happens if I exceed the quota?'), 'a' => __('New conversations are paused with a friendly upgrade prompt. Conversations already in progress finish normally — including human takeovers. Your widget never breaks visibly.')],
            ['q' => __('Can I cancel anytime?'), 'a' => __('Yes. Cancellations take effect at the end of the billing period; you keep access until then and your data stays safe.')],
            ['q' => __('Do you offer refunds?'), 'a' => __('A 30-day money-back guarantee on all paid plans, no questions asked. Email :email.', ['email' => $contact])],
            ['q' => __('Is there an Enterprise plan?'), 'a' => __('Yes — custom limits, SSO, dedicated infrastructure, and a named CSM. Contact us for a quote.')],
            ['q' => __('Can I self-host?'), 'a' => __(':brand is also available as a self-hosted application via a one-time license. Same features, your infrastructure, your data.', ['brand' => $brand])],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function howItWorksSteps(): array
    {
        return [
            [
                'number' => '01',
                'title' => __('Drop your URL'),
                'duration' => __('< 1 minute'),
                'description' => __('Sign up, paste your website URL, and we auto-discover your sitemap and key pages (about, pricing, FAQ, docs). Tick the ones you want indexed and we crawl them in the background — respecting robots.txt, blocking authenticated paths, never touching internal hosts.'),
                'sub_points' => [
                    __('Cloudflare Browser Rendering for JS-heavy sites'),
                    __('Plain HTTP fallback for simple sites'),
                    __('Notion + Google Docs sources via OAuth'),
                ],
            ],
            [
                'number' => '02',
                'title' => __('We index your knowledge'),
                'duration' => __('~30 seconds for most sites'),
                'description' => __('Crawled pages are extracted (Readability), chunked along semantic boundaries (~500 tokens with overlap), embedded with Cloudflare bge-base-en-v1.5 or OpenAI text-embedding-3-small, and upserted into Vectorize or Qdrant — every chunk tagged with workspace + agent so retrieval is strictly tenant-scoped.'),
                'sub_points' => [
                    __('Recursive splitter — paragraphs first, sentences as fallback'),
                    __('Two-stage retrieval: ANN recall + cross-encoder rerank'),
                    __('Strict workspace isolation enforced by global query scope'),
                ],
            ],
            [
                'number' => '03',
                'title' => __('Customize the agent'),
                'duration' => __('5 minutes of fine-tuning'),
                'description' => __('Set persona, tone, language, theme colors, starter prompts, and behavior rules. Add curated answers for pricing or refunds where you can\'t tolerate paraphrasing. A live preview shows visitors exactly what they\'ll see.'),
                'sub_points' => [
                    __('8 widget languages (en, es, fr, de, pt, ja, ar, zh)'),
                    __('Behavior rules: scroll-depth, idle, exit-intent, intent-keyword'),
                    __('A/B test rule variants and watch conversion deltas'),
                ],
            ],
            [
                'number' => '04',
                'title' => __('Publish a snapshot'),
                'duration' => __('instant'),
                'description' => __('Hit Publish — we snapshot the agent into an immutable version row. The widget runtime always reads from the published version, so editing draft settings never affects live visitors. Roll back to any prior version with one click.'),
                'sub_points' => [
                    __('Versioned per-publish history'),
                    __('Strict allowed-origin enforcement on /v1/widget/init'),
                    __('One-click rollback to any prior snapshot'),
                ],
            ],
            [
                'number' => '05',
                'title' => __('Embed one script tag'),
                'duration' => __('30 seconds'),
                'description' => __('Paste a single <script> tag before </body>. The widget bundle is ≤ 50KB gzipped, async, and renders inside a Shadow DOM so it can\'t conflict with your site\'s CSS. Works on any framework — WordPress, Shopify, Next.js, plain HTML.'),
                'sub_points' => [
                    __('Shadow DOM isolation — no CSS leaks'),
                    __('Persistent visitor sessions across reloads'),
                    __('Optional voice mic (browser SpeechRecognition)'),
                ],
            ],
            [
                'number' => '06',
                'title' => __('Visitor asks, AI answers'),
                'duration' => __('< 1 second to first token'),
                'description' => __('A visitor types a question. Hot path: curated short-circuit check → embed query → vector search → rerank → assemble prompt with sources tagged for prompt-injection defense → stream LLM response back over SSE. No DB writes, no synchronous webhooks — persistence is async after the stream completes.'),
                'sub_points' => [
                    __('Hot-path 1s p95 TTFT contract enforced'),
                    __('Citations [1] [2] linking back to your sources'),
                    __('Confidence threshold per agent — agent says "I don\'t know" before guessing'),
                ],
            ],
            [
                'number' => '07',
                'title' => __('Capture leads, jump in live'),
                'duration' => __('when intent is high'),
                'description' => __('Behavior rules detect when a visitor shows real intent (asks about pricing, asks for a demo, hits the third turn) and offer the inline lead form. Captured leads land in your inbox immediately, fire a Slack alert, and POST to your webhook for HubSpot / Pipedrive / Mailchimp.'),
                'sub_points' => [
                    __('Real-time inbox via Reverb WebSocket'),
                    __('One-click human takeover — visitor sees "Human is here"'),
                    __('Outgoing webhooks with HMAC-signed payloads'),
                ],
            ],
        ];
    }

    /**
     * @return list<array{phase: string, budget: string}>
     */
    private function latencyBudget(): array
    {
        return [
            ['phase' => 'Receive + auth', 'budget' => '30 ms'],
            ['phase' => 'Curated short-circuit', 'budget' => '5 ms'],
            ['phase' => 'Embed query', 'budget' => '120 ms'],
            ['phase' => 'Vector search', 'budget' => '80 ms'],
            ['phase' => 'Rerank', 'budget' => '120 ms'],
            ['phase' => 'Prompt assembly', 'budget' => '10 ms'],
            ['phase' => 'LLM time-to-first-token', 'budget' => '500 ms'],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function nativeIntegrations(): array
    {
        return [
            [
                'name' => 'Notion',
                'category' => __('Knowledge source'),
                'tagline' => __('Pipe your team\'s shared brain into the agent.'),
                'description' => __('OAuth into your workspace, pick the pages or databases you want indexed, and changes you make in Notion show up in the agent\'s answers next time you reindex.'),
                'icon' => 'BookOpen',
                'accent' => 'slate',
            ],
            [
                'name' => 'Google Docs',
                'category' => __('Knowledge source'),
                'tagline' => __('Sync product specs and FAQs the moment they ship.'),
                'description' => __('Connect via OAuth and pick the docs that matter. Each document becomes a knowledge source — manual reindex on change, no scheduled polling against your Drive.'),
                'icon' => 'FileText',
                'accent' => 'sky',
            ],
            [
                'name' => 'Slack',
                'category' => __('Notifications'),
                'tagline' => __('Pipe leads + escalations to the channel that handles them.'),
                'description' => __('Pick a channel; new captured leads, low-confidence escalations, and routed conversations land in real time so a human can jump in from where they already work.'),
                'icon' => 'MessageSquare',
                'accent' => 'violet',
            ],
            [
                'name' => 'Shopify',
                'category' => __('E-commerce'),
                'tagline' => __('Connect your Shopify store to sync products.'),
                'description' => __('Connect your Shopify store via Custom App to sync products and answer customer questions about them in real-time.'),
                'icon' => 'ShoppingBag',
                'accent' => 'emerald',
            ],
            [
                'name' => 'WordPress',
                'category' => __('CMS Integration'),
                'tagline' => __('The easiest way to add AI chat to your WordPress site.'),
                'description' => __('Install our official plugin to sync your posts, pages, and products automatically. No code required.'),
                'icon' => 'Globe2',
                'accent' => 'sky',
            ],
            [
                'name' => 'Ikas',
                'category' => __('E-commerce'),
                'tagline' => __('Drive more sales on your Ikas store with AI.'),
                'description' => __('Connect your Ikas store to answer product questions, handle shipping queries, and recover abandoned carts in real-time.'),
                'icon' => 'Sparkles',
                'accent' => 'emerald',
            ],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function dataSourceIntegrations(): array
    {
        return [
            ['name' => __('URL crawl'), 'tagline' => __('Drop a URL, we pull the content respecting robots.txt.'), 'icon' => 'Globe2'],
            ['name' => __('Sitemap'), 'tagline' => __('Point at /sitemap.xml — we fan out to one job per page.'), 'icon' => 'Map'],
            ['name' => __('RSS / Atom feeds'), 'tagline' => __('Keep blog content fresh with feed-driven re-ingestion.'), 'icon' => 'Rss'],
            ['name' => __('Pasted text'), 'tagline' => __('Paste FAQs, scripts, or anything text-shaped — instant indexing.'), 'icon' => 'Type'],
            ['name' => __('Auto-index visited pages'), 'tagline' => __('Every page a visitor lands on gets indexed automatically (with guardrails).'), 'icon' => 'Sparkles'],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function roadmapIntegrations(): array
    {
        return [
            ['name' => __('HubSpot'), 'tagline' => __('Push leads as contacts and create deals on the configured pipeline.')],
            ['name' => __('Salesforce'), 'tagline' => __('Native sync for Lead + Opportunity objects.')],
            ['name' => __('Pipedrive'), 'tagline' => __('New deals + activities on lead capture.')],
            ['name' => __('Mailchimp'), 'tagline' => __('Push leads as audience subscribers with conversation transcripts as custom fields.')],
            ['name' => __('Zapier'), 'tagline' => __('Built-in trigger + action for the Zapier directory.')],
            ['name' => __('Calendly / Cal.com'), 'tagline' => __('CTA buttons that open an inline booking widget mid-conversation.')],
        ];
    }

    private function termsIntro(): string
    {
        $brand = $this->brand();

        return __('These terms govern your use of :brand (the “Service”). By creating an account, embedding the widget, or otherwise using the Service, you agree to these terms. If you do not agree, do not use the Service.', ['brand' => $brand]);
    }

    /**
     * @return list<array{title: string, body?: array<int, string>, bullets?: array<int, string>}>
     */
    private function termsSections(): array
    {
        $brand = $this->brand();

        return [
            [
                'title' => __('1. The Service'),
                'body' => [
                    __(':brand is an AI-powered website chat widget and operator console. We provide hosting for your agents, knowledge ingestion, retrieval, large-language-model responses, lead capture, and an inbox where your team can take over conversations from the AI. Specific capabilities, quotas, and limits are described on the pricing page and in your active subscription.', ['brand' => $brand]),
                ],
            ],
            [
                'title' => __('2. Your account'),
                'bullets' => [
                    __('You must provide accurate registration information and keep it current.'),
                    __('You are responsible for safeguarding your password and any access tokens.'),
                    __('You are responsible for all activity under your account, including activity by workspace members you invite.'),
                    __('You must promptly notify us of any unauthorized access or suspected breach.'),
                    __('You must be at least 16 years of age (or the age of digital consent in your jurisdiction).'),
                ],
            ],
            [
                'title' => __('3. Acceptable use'),
                'body' => [__('You agree not to use the Service to:')],
                'bullets' => [
                    __('Violate any applicable law, regulation, or third-party right.'),
                    __('Send spam, harass, defraud, or impersonate any person or entity.'),
                    __('Distribute malware, conduct phishing, or attempt to compromise security.'),
                    __('Embed the widget on sites operated by third parties without their permission.'),
                    __('Reverse engineer, scrape, or attempt to derive source code beyond what is expressly permitted.'),
                    __('Resell, sublicense, or otherwise commercialize the Service except as expressly authorized.'),
                    __('Submit knowledge sources or visitor inputs that infringe copyright, contain unlawful content, or expose the personal data of individuals without a lawful basis.'),
                ],
            ],
            [
                'title' => __('4. Your content & data'),
                'body' => [
                    __('You retain ownership of the data you submit to the Service: knowledge sources, agent configuration, conversation transcripts, leads, and associated metadata (“Customer Data”). You grant us a worldwide, non-exclusive, royalty-free license to process Customer Data solely as needed to operate, secure, support, and improve the Service for you.'),
                    __('You represent that you have all rights necessary to submit Customer Data and that doing so does not violate any law or third-party right.'),
                ],
            ],
            [
                'title' => __('5. Visitor data & privacy'),
                'body' => [__('When you embed the widget on your site, visitor messages, IP-derived signals, and any contact details they submit pass through the Service. You are the controller of that data; we are the processor. You must:')],
                'bullets' => [
                    __('Maintain a privacy notice that discloses the use of :brand and AI processing on your site.', ['brand' => $brand]),
                    __('Obtain any consents required by applicable law (GDPR, CCPA, equivalent).'),
                    __('Honor data subject rights for visitors who request access, correction, or deletion.'),
                ],
            ],
            [
                'title' => __('6. AI output disclaimer'),
                'body' => [__('AI responses are generated based on the knowledge sources you supply and the underlying language model. They may contain inaccuracies, omissions, or unintended outputs. You are responsible for:')],
                'bullets' => [
                    __('Reviewing your knowledge base, system prompt, and behavior rules.'),
                    __('Configuring an appropriate confidence threshold for your use case.'),
                    __('Reviewing transcripts and capturing leads for any business-critical interaction.'),
                ],
            ],
            [
                'title' => __('7. Subscriptions, billing, & refunds'),
                'bullets' => [
                    __('Paid plans renew automatically until cancelled. You may cancel from your billing settings; cancellation takes effect at the end of the current billing period.'),
                    __('Fees are billed in advance and are non-refundable except where required by law or where we explicitly grant a refund.'),
                    __('You authorize us and our payment processor (Stripe) to charge the payment method on file.'),
                    __('If your usage exceeds your plan limits, we may rate-limit, block new conversations, or invite you to upgrade.'),
                    __('We may change pricing for new billing periods with reasonable notice.'),
                ],
            ],
            [
                'title' => __('8. Third-party services'),
                'body' => [
                    __('The Service integrates with third-party providers (large-language-model APIs, vector stores, payment processors, OAuth-based knowledge sources such as Notion or Google Drive, and your configured outgoing webhooks). Their availability, latency, and pricing are outside our control, and your use of those services is subject to their own terms.'),
                ],
            ],
            [
                'title' => __('9. Service availability'),
                'body' => [
                    __('We aim for high availability but do not guarantee uninterrupted access. We may perform maintenance, updates, or emergency response that briefly affects the Service. We are not liable for downtime caused by third-party providers or by force majeure.'),
                ],
            ],
            [
                'title' => __('10. Termination'),
                'bullets' => [
                    __('You may terminate by cancelling your subscription and deleting your workspace.'),
                    __('We may suspend or terminate the Service for violation of these terms, non-payment, or to comply with applicable law.'),
                    __('Upon termination we will retain Customer Data for a reasonable transition period (typically 30 days) before deletion.'),
                ],
            ],
            [
                'title' => __('11. Intellectual property'),
                'body' => [
                    __('The Service, including software, design, and trademarks, is owned by :brand and its licensors. Nothing in these terms grants you ownership of the Service. Feedback you provide may be used by us without obligation.', ['brand' => $brand]),
                ],
            ],
            [
                'title' => __('12. Disclaimers'),
                'body' => [
                    __('THE SERVICE IS PROVIDED “AS IS” WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE ERROR-FREE OR UNINTERRUPTED, OR THAT AI OUTPUTS WILL BE ACCURATE.'),
                ],
            ],
            [
                'title' => __('13. Limitation of liability'),
                'body' => [
                    __('TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER PARTY WILL BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, REVENUE, GOODWILL, OR DATA, ARISING OUT OF OR RELATED TO THE SERVICE. OUR AGGREGATE LIABILITY FOR ANY CLAIM WILL NOT EXCEED THE FEES YOU PAID FOR THE SERVICE IN THE 12 MONTHS PRECEDING THE CLAIM.'),
                ],
            ],
            [
                'title' => __('14. Indemnification'),
                'body' => [
                    __('You agree to defend and indemnify :brand against claims arising from (a) your Customer Data, (b) your use of the Service in violation of these terms, or (c) your violation of any law or third-party right.', ['brand' => $brand]),
                ],
            ],
            [
                'title' => __('15. Changes to these terms'),
                'body' => [
                    __('We may update these terms from time to time. Material changes will be announced via the Service or by email at least 14 days before they take effect. Continued use after the effective date constitutes acceptance.'),
                ],
            ],
            [
                'title' => __('16. Governing law'),
                'body' => [
                    __('These terms are governed by the laws of the jurisdiction in which the operator of :brand is established, without regard to conflict-of-law principles. Disputes will be resolved in the courts of that jurisdiction unless required otherwise by law.', ['brand' => $brand]),
                ],
            ],
        ];
    }
}
