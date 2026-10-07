/**
 * PM2 ecosystem file for the OrbyChat queue worker.
 *
 * Usage from the project root:
 *
 *   pm2 start ecosystem.config.cjs
 *   pm2 status
 *   pm2 logs orbychat-queue
 *   pm2 reload ecosystem.config.cjs   # zero-downtime restart after deploy
 *   pm2 stop orbychat-queue
 *   pm2 save && pm2 startup           # auto-start on server reboot
 *
 * Why --max-time=60 + autorestart=true:
 *   The worker intentionally exits every 60 seconds so PM2 can restart
 *   it. This prevents memory creep, releases stale DB / Redis
 *   connections, and ensures the worker picks up freshly deployed code
 *   without a manual restart.
 *
 * Why kill_timeout=200000:
 *   On `pm2 stop` PM2 sends SIGTERM, then waits this long before
 *   SIGKILL. Laravel's queue worker traps SIGTERM and finishes the
 *   in-flight job before exiting — but a job's --timeout is 180s, so
 *   PM2 must wait at least that long plus buffer or it'll hard-kill
 *   the worker mid-crawl / mid-embed and leave the job in `failed`.
 */
module.exports = {
    apps: [
        {
            name: 'orbychat-queue',
            cwd: __dirname,
            script: 'php',
            args: 'artisan queue:work --queue=crawl,index,default --max-time=60 --max-jobs=100 --tries=2 --timeout=180 --sleep=3',
            interpreter: 'none',

            // Process model — single fork process, not Node cluster.
            exec_mode: 'fork',
            instances: 1,

            // Restart policy.
            autorestart: true,
            restart_delay: 2000,           // 2s between restarts so we don't hot-loop on a broken DB
            max_restarts: 50,              // guard against runaway restart on permanent failures
            min_uptime: 10000,             // worker must run >= 10s for a restart to "count" toward max_restarts

            // Graceful shutdown — worker has up to 200s to finish in-flight job on SIGTERM.
            kill_timeout: 200000,
            wait_ready: false,
            listen_timeout: 10000,

            // Logging.
            out_file: './storage/logs/pm2-queue-out.log',
            error_file: './storage/logs/pm2-queue-error.log',
            merge_logs: true,
            time: true,                    // prefix every log line with an ISO timestamp

            // Environment.
            env: {
                APP_ENV: 'production',
            },
            env_local: {
                APP_ENV: 'local',
            },
        },
    ],
};
