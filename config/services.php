<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    // PayPal — REST API client credentials. `mode` flips between
    // sandbox (`sandbox.paypal.com`) and live (`api-m.paypal.com`).
    // Webhook id used to verify event signatures via the verify-signature
    // endpoint. AppSettingsOverrideServiceProvider reads from app_settings
    // and merges into config() at boot, so the admin UI can rotate
    // credentials without a deploy.
    'paypal' => [
        'enabled' => (bool) env('PAYPAL_ENABLED', false),
        'mode' => env('PAYPAL_MODE', 'sandbox'),
        'client_id' => env('PAYPAL_CLIENT_ID'),
        'client_secret' => env('PAYPAL_CLIENT_SECRET'),
        'webhook_id' => env('PAYPAL_WEBHOOK_ID'),
    ],

    // Razorpay — HTTP Basic auth + HMAC-SHA256 webhook signatures.
    'razorpay' => [
        'enabled' => (bool) env('RAZORPAY_ENABLED', false),
        'key_id' => env('RAZORPAY_API_KEY'),
        'key_secret' => env('RAZORPAY_SECRET_KEY'),
        'webhook_secret' => env('RAZORPAY_WEBHOOK_SECRET'),
    ],

    // LLM provider — LLM_PROVIDER=cloudflare|openai. If unset and Cloudflare
    // keys are present, Cloudflare wins; otherwise OpenAI; otherwise the fake.
    'llm' => [
        'provider' => env('LLM_PROVIDER', ''),
    ],
    'openai' => [
        'key' => env('OPENAI_API_KEY'),
        'chat_model' => env('OPENAI_CHAT_MODEL', 'gpt-4o-mini'),
        'embed_model' => env('OPENAI_EMBED_MODEL', 'text-embedding-3-small'),
    ],

    // Vector store provider — VECTOR_PROVIDER=cloudflare|qdrant. Default
    // logic mirrors the LLM provider above.
    'vector' => [
        'provider' => env('VECTOR_PROVIDER', ''),
    ],
    'qdrant' => [
        'url' => env('QDRANT_URL'),
        'api_key' => env('QDRANT_API_KEY'),
        'collection' => env('QDRANT_COLLECTION', 'orbychat_chunks'),
    ],

    // Embedding vector dimension. Cloudflare bge-base-en-v1.5 = 768.
    // OpenAI text-embedding-3-small = 1536. Override with VECTOR_DIM if needed.
    'vector_dim' => (int) env('VECTOR_DIM', env('LLM_PROVIDER') === 'openai' ? 1536 : 768),

    // Vector collection name. Resolved per-provider so jobs/services don't have to branch.
    'vector_collection' => env('VECTOR_PROVIDER') === 'qdrant'
        ? env('QDRANT_COLLECTION', 'orbychat_chunks')
        : env('CLOUDFLARE_VECTORIZE_INDEX', 'orbychat-chunks'),

    // Crawler. CF Browser Rendering preferred when CF keys present;
    // falls back to Browserless, then plain HTTP (free).
    'browserless' => [
        'url' => env('BROWSERLESS_URL', 'https://chrome.browserless.io'),
        'token' => env('BROWSERLESS_TOKEN'),
    ],

    'crawl' => [
        'max_pages_per_source' => (int) env('CRAWL_MAX_PAGES_PER_SOURCE', 25),
        'page_dispatch_delay_seconds' => (int) env('CRAWL_PAGE_DISPATCH_DELAY', 2),
    ],

    // Default similarity threshold for new agents. Cloudflare bge-base-en-v1.5
    // scores typically peak around 0.7”"0.85 for in-domain matches; OpenAI
    // text-embedding-3-small peaks higher. Tune via RAG_CONFIDENCE_THRESHOLD.
    'rag' => [
        'confidence_threshold' => (float) env('RAG_CONFIDENCE_THRESHOLD', env('LLM_PROVIDER') === 'openai' ? 0.78 : 0.5),
    ],

    // Cloudflare — one bill: chat, embeddings, vector DB, browser rendering, R2.
    'cloudflare' => [
        'account_id' => env('CLOUDFLARE_ACCOUNT_ID'),
        'api_token' => env('CLOUDFLARE_API_TOKEN'),
        'chat_model' => env('CLOUDFLARE_CHAT_MODEL', '@cf/meta/llama-3.3-70b-instruct-fp8-fast'),
        'embed_model' => env('CLOUDFLARE_EMBED_MODEL', '@cf/baai/bge-base-en-v1.5'),
        'ai_gateway_url' => env('CLOUDFLARE_AI_GATEWAY_URL'),
        'vectorize_index' => env('CLOUDFLARE_VECTORIZE_INDEX', 'orbychat-chunks'),
        'browser_rendering' => env('CLOUDFLARE_BROWSER_RENDERING', true),
    ],

    'widget' => [
        'jwt_secret' => env('WIDGET_JWT_SECRET', 'change-me-in-production'),
        'jwt_ttl_minutes' => env('WIDGET_JWT_TTL_MINUTES', 60),
    ],

    // The OrbyChat agent used by the live demo widget on the marketing
    // pages. Set MARKETING_DEMO_AGENT_ID to a real, published agent's UUID
    // and add the marketing site URL to that agent's allowed_origins.
    'marketing' => [
        'demo_agent_id' => env('MARKETING_DEMO_AGENT_ID'),
    ],

    // Notion OAuth integration. Create a public integration at
    // https://www.notion.so/my-integrations, set the redirect URI to
    // {APP_URL}/app/oauth/notion/callback, and copy the values here.
    'notion' => [
        'client_id' => env('NOTION_CLIENT_ID'),
        'client_secret' => env('NOTION_CLIENT_SECRET'),
        'redirect_uri' => env('NOTION_REDIRECT_URI'),
    ],

    // Google OAuth (Drive + Docs). Register an OAuth client in the GCP
    // console with the scopes drive.readonly and documents.readonly.
    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect_uri' => env('GOOGLE_REDIRECT_URI'),
    ],

];
