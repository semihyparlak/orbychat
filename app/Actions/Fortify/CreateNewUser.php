<?php

namespace App\Actions\Fortify;

use App\Actions\Workspaces\CreateWorkspaceForUser;
use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Jobs\Crawl\CrawlSourceJob;
use App\Models\Agent;
use App\Models\Source;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    public function __construct(private CreateWorkspaceForUser $createWorkspaceForUser) {}

    /**
     * Validate and create a newly registered user along with their
     * default workspace, owner membership, free subscription, and (if
     * the marketing landing page seeded a domain) a starter Agent +
     * a Source pointing at that domain so the crawl kicks off
     * immediately.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        return DB::transaction(function () use ($input): User {
            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => $input['password'],
            ]);

            $workspace = $this->createWorkspaceForUser->handle($user);

            $domain = $this->resolveStartDomain($input);
            if ($domain !== null) {
                $agent = Agent::create([
                    'workspace_id' => $workspace->id,
                    'name' => $this->guessAgentName($domain),
                    'language_default' => 'en',
                    'allowed_origins' => [$this->normalizeOrigin($domain)],
                    'persona' => ['name' => 'Assistant', 'tone' => 'friendly'],
                    'theme' => ['primary' => '#111827', 'accent' => '#10b981', 'radius' => 12],
                    'guardrails' => ['avoid' => [], 'max_chars' => 2500],
                    // Cloudflare bge-base-en-v1.5 cosine scores run noticeably lower
                    // than OpenAI's text-embedding-3-small. Default 0.78 (OpenAI tuning)
                    // produces zero matches on most pages; 0.5 is healthier for bge-base.
                    'confidence_threshold' => (float) config('services.rag.confidence_threshold', 0.5),
                ]);

                // Always start with type=url (single page) for the auto-crawl on register.
                // Sites like startech.com.bd return the same sitemap.xml for any
                // path-prefixed URL, which would silently fan out into pages
                // the user never asked for. Users can switch to "sitemap"
                // explicitly from the sources page.
                $source = Source::create([
                    'agent_id' => $agent->id,
                    'type' => 'url',
                    'status' => 'pending',
                    'config' => ['url' => $domain],
                ]);

                CrawlSourceJob::dispatch($source->id)->onQueue('crawl');
            }

            return $user->fresh();
        });
    }

    private function resolveStartDomain(array $input): ?string
    {
        $domain = $input['domain'] ?? request()->session()->get('marketing.start_domain') ?? request()->query('domain');
        if (! is_string($domain) || $domain === '') {
            return null;
        }
        if (! filter_var($domain, FILTER_VALIDATE_URL)) {
            return null;
        }

        return $domain;
    }

    private function guessAgentName(string $domain): string
    {
        $host = parse_url($domain, PHP_URL_HOST) ?: 'My agent';

        return ucfirst(preg_replace('/^www\./', '', $host).' agent');
    }

    private function normalizeOrigin(string $domain): string
    {
        $parts = parse_url($domain);
        if (! is_array($parts) || ! isset($parts['scheme'], $parts['host'])) {
            return $domain;
        }

        return $parts['scheme'].'://'.$parts['host'];
    }
}
