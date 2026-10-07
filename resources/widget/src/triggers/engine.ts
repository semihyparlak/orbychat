type TriggerKind =
    | 'exit_intent'
    | 'idle'
    | 'scroll'
    | 'time'
    | 'returning'
    | 'utm';

export type TriggerRule = {
    id: string;
    kind: TriggerKind;
    conditions?: Record<string, unknown>;
    action?: { kind: string; message?: string; cta_id?: string };
};

export type TriggerHandler = (rule: TriggerRule) => void;

const COOLDOWN_KEY = 'pb_last_trigger_at';
const COOLDOWN_MS = 5 * 60 * 1000;

export class TriggerEngine {
    private fired = new Set<string>();

    private detachers: Array<() => void> = [];

    constructor(
        private readonly rules: TriggerRule[],
        private readonly onFire: TriggerHandler,
    ) {}

    start(): void {
        for (const rule of this.rules) {
            switch (rule.kind) {
                case 'exit_intent':
                    this.attachExitIntent(rule);
                    break;
                case 'idle':
                    this.attachIdle(rule);
                    break;
                case 'scroll':
                    this.attachScroll(rule);
                    break;
                case 'time':
                    this.attachTime(rule);
                    break;
                case 'returning':
                    if (this.isReturningVisitor()) {
                        this.fire(rule);
                    }

                    break;
                case 'utm':
                    if (this.matchesUtm(rule.conditions ?? {})) {
                        this.fire(rule);
                    }

                    break;
            }
        }
    }

    stop(): void {
        this.detachers.forEach((d) => d());
        this.detachers = [];
    }

    private fire(rule: TriggerRule): void {
        if (this.fired.has(rule.id)) {
            return;
        }

        const last = Number(localStorage.getItem(COOLDOWN_KEY) ?? '0');

        if (Date.now() - last < COOLDOWN_MS) {
            return;
        }

        this.fired.add(rule.id);
        localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
        this.onFire(rule);
    }

    private attachExitIntent(rule: TriggerRule): void {
        const handler = (e: MouseEvent) => {
            if (e.clientY < 10) {
                this.fire(rule);
            }
        };
        document.addEventListener('mouseout', handler);
        this.detachers.push(() =>
            document.removeEventListener('mouseout', handler),
        );
    }

    private attachIdle(rule: TriggerRule): void {
        const seconds = Number(rule.conditions?.seconds ?? 30);
        let timer = window.setTimeout(() => this.fire(rule), seconds * 1000);
        const reset = () => {
            window.clearTimeout(timer);
            timer = window.setTimeout(() => this.fire(rule), seconds * 1000);
        };
        const events = ['mousemove', 'keydown', 'scroll', 'touchstart'];
        events.forEach((ev) =>
            document.addEventListener(ev, reset, { passive: true }),
        );
        this.detachers.push(() => {
            window.clearTimeout(timer);
            events.forEach((ev) => document.removeEventListener(ev, reset));
        });
    }

    private attachScroll(rule: TriggerRule): void {
        const percent = Number(rule.conditions?.percent ?? 50);
        const handler = () => {
            const total =
                document.documentElement.scrollHeight - window.innerHeight;

            if (total <= 0) {
                return;
            }

            const ratio = (window.scrollY / total) * 100;

            if (ratio >= percent) {
                this.fire(rule);
            }
        };
        window.addEventListener('scroll', handler, { passive: true });
        this.detachers.push(() =>
            window.removeEventListener('scroll', handler),
        );
    }

    private attachTime(rule: TriggerRule): void {
        const seconds = Number(rule.conditions?.seconds ?? 30);
        const t = window.setTimeout(() => this.fire(rule), seconds * 1000);
        this.detachers.push(() => window.clearTimeout(t));
    }

    private isReturningVisitor(): boolean {
        const count = Number(localStorage.getItem('pb_visitor_count') ?? '0');
        localStorage.setItem('pb_visitor_count', String(count + 1));

        return count >= 1;
    }

    private matchesUtm(conditions: Record<string, unknown>): boolean {
        const params = new URLSearchParams(window.location.search);

        for (const key of Object.keys(conditions)) {
            const expected = conditions[key];
            const actual = params.get(key);

            if (typeof expected === 'string' && actual !== expected) {
                return false;
            }
        }

        return true;
    }
}
