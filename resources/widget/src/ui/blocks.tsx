import type { ComponentType } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import type { Block } from '../core/store';
import { store } from '../core/store';
import { CalendarPicker, DynamicLeadFields, splitLeadValues } from './DynamicLeadFields';

const RENDERERS: Record<string, ComponentType<BlockRendererProps>> = {
    escalation_button: EscalationButton,
    product_card: ProductCard,
    pricing_card: PricingCard,
    case_study_card: CaseStudyCard,
    coupon_card: CouponCard,
    order_status_card: OrderStatusCard,
    appointment_card: AppointmentCard,
    treatment_card: TreatmentCard,
    health_plan_card: HealthPlanCard,
    code_block: CodeBlock,
    api_ref_card: ApiRefCard,
    version_picker: VersionPicker,
    troubleshoot_card: TroubleshootCard,
    kb_article_card: KbArticleCard,
    account_status_card: AccountStatusCard,
    signup_card: SignupCard,
    ticket_escalation: EscalationButton,
    follow_up: FollowUp,
};

export function rendererFor(type: string): ComponentType<BlockRendererProps> | null {
    return RENDERERS[type] ?? null;
}

type BlockRendererProps = {
    block: Block;
    onLeadCapture?: () => void;
    onPromptClick?: (prompt: string) => void;
    onEscalate?: () => void;
    state?: any;
};

/**
 * "Connect me with a human" button. Triggers the existing lead-capture
 * form so the operator gets the visitor's email and can pick up the
 * conversation in Inbox.
 */
function EscalationButton({ block, onEscalate, onLeadCapture }: BlockRendererProps) {
    const label =
        typeof block.payload.label === 'string'
            ? block.payload.label
            : (((window as any).orbychat_labels)?.connect_human || 'Beni bir insana bağla');

    return (
        <div
            style={{
                display: 'flex',
                marginTop: 8,
            }}
        >
            <button
                type="button"
                onClick={() => {
                    if (onEscalate) onEscalate();
                    else onLeadCapture?.();
                }}
                style={{
                    appearance: 'none',
                    border: '1px solid #cbd5e1',
                    background: '#0f172a',
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 600,
                    padding: '8px 14px',
                    borderRadius: 999,
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.12)',
                }}
            >
                {label}
            </button>
        </div>
    );
}

/**
 * Product card — server emits this when the LLM has been instructed by
 * the e-commerce preset to recommend a specific product. The buyer sees
 * an image, title, price, and a clear "Buy" / "View" button.
 */
function ProductCard({ block }: BlockRendererProps) {
    const p = block.payload as Record<string, string>;
    const title = p.title || 'Product';
    const price = p.price ? formatPrice(p.price, p.currency) : null;
    const url = p.url;
    const image = p.image;
    const summary = p.summary;

    return (
        <a
            href={url || '#'}
            target={url ? '_blank' : undefined}
            rel={url ? 'noopener noreferrer' : undefined}
            style={{
                display: 'flex',
                gap: 12,
                marginTop: 8,
                padding: 10,
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                textDecoration: 'none',
                color: 'inherit',
                boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
                cursor: url ? 'pointer' : 'default',
            }}
        >
            {image && (
                <img
                    src={image}
                    alt=""
                    style={{
                        width: 64,
                        height: 64,
                        objectFit: 'cover',
                        borderRadius: 8,
                        flexShrink: 0,
                        background: '#f8fafc',
                    }}
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                            'none';
                    }}
                />
            )}
            <div
                style={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <div
                    style={{
                        fontSize: 13,
                        fontWeight: 600,
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {title}
                </div>
                {summary && (
                    <div
                        style={{
                            fontSize: 12,
                            color: '#475569',
                            lineHeight: 1.4,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                        }}
                    >
                        {summary}
                    </div>
                )}
                <div
                    style={{
                        marginTop: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8,
                    }}
                >
                    {price && (
                        <span
                            style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: '#0f172a',
                            }}
                        >
                            {price}
                        </span>
                    )}
                    {url && (
                        <span
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: '#2563eb',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {((window as any).orbychat_labels)?.view || 'Görüntüle'}{!(((window as any).orbychat_labels)?.view || 'Görüntüle').includes('→') && ' →'}
                        </span>
                    )}
                </div>
            </div>
        </a>
    );
}

/**
 * Pricing card — emitted by the SaaS preset when the LLM mentions a
 * specific plan. Compact, focuses on plan name + price + a clear CTA.
 */
function PricingCard({ block }: BlockRendererProps) {
    const p = block.payload as Record<string, string>;
    const title = p.title || 'Plan';
    const price = p.price ? formatPrice(p.price, p.currency) : null;
    const period = p.period ? `/ ${p.period}` : '';
    const cta = p.cta || ((window as any).orbychat_labels)?.get_started || 'Hemen başla';
    const url = p.url;
    
    if (!url || url === '#') {
        return null;
    }

    return (
        <a
            href={url || '#'}
            target={url ? '_blank' : undefined}
            rel={url ? 'noopener noreferrer' : undefined}
            style={{
                display: 'block',
                marginTop: 8,
                padding: 12,
                borderRadius: 12,
                border: '1px solid #c7d2fe',
                background: 'linear-gradient(135deg,#eef2ff 0%,#ffffff 100%)',
                textDecoration: 'none',
                color: 'inherit',
                cursor: url ? 'pointer' : 'default',
            }}
        >
            <div
                style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#4338ca',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                }}
            >
                {title}
            </div>
            {price && (
                <div
                    style={{
                        marginTop: 4,
                        fontSize: 22,
                        fontWeight: 700,
                        color: '#0f172a',
                        lineHeight: 1,
                    }}
                >
                    {price}
                    {period && (
                        <span
                            style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: '#64748b',
                                marginLeft: 4,
                            }}
                        >
                            {period}
                        </span>
                    )}
                </div>
            )}
            <div
                style={{
                    marginTop: 10,
                    display: 'inline-block',
                    padding: '6px 12px',
                    borderRadius: 999,
                    background: '#4338ca',
                    color: '#ffffff',
                    fontSize: 12,
                    fontWeight: 600,
                }}
            >
                {cta}{!cta.includes('→') && !cta.includes('->') && ' →'}
            </div>
        </a>
    );
}

/**
 * Case study card — emitted by the marketing preset to surface a proof
 * point the LLM mentioned in its reply.
 */
function CaseStudyCard({ block }: BlockRendererProps) {
    const p = block.payload as Record<string, string>;
    const title = p.title || 'Case study';
    const outcome = p.outcome;
    const url = p.url;

    return (
        <a
            href={url || '#'}
            target={url ? '_blank' : undefined}
            rel={url ? 'noopener noreferrer' : undefined}
            style={{
                display: 'block',
                marginTop: 8,
                padding: 12,
                borderRadius: 12,
                border: '1px solid #fde68a',
                background: '#fffbeb',
                textDecoration: 'none',
                color: 'inherit',
                cursor: url ? 'pointer' : 'default',
            }}
        >
            <div
                style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#b45309',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                }}
            >
                {((window as any).orbychat_labels)?.case_study || 'Örnek çalışma'}
            </div>
            <div
                style={{
                    marginTop: 4,
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#0f172a',
                }}
            >
                {title}
            </div>
            {outcome && (
                <div
                    style={{
                        marginTop: 4,
                        fontSize: 13,
                        color: '#475569',
                        lineHeight: 1.4,
                    }}
                >
                    {outcome}
                </div>
            )}
            {url && (
                <div
                    style={{
                        marginTop: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#b45309',
                    }}
                >
                    {((window as any).orbychat_labels)?.read_more || 'Daha fazla oku'}{!(((window as any).orbychat_labels)?.read_more || 'Daha fazla oku').includes('→') && ' →'}
                </div>
            )}
        </a>
    );
}

/**
 * Best-effort price formatter.
 */
function formatPrice(amount: string, currency?: string): string {
    const num = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (!Number.isFinite(num)) return currency ? `${amount} ${currency}` : amount;
    if (currency) {
        try {
            return new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: currency.toUpperCase(),
            }).format(num);
        } catch {
            return `${num.toFixed(2)} ${currency.toUpperCase()}`;
        }
    }
    return `$${num.toFixed(2)}`;
}

/**
 * Coupon card — displayed when the AI agent offers a discount.
 */
function CouponCard({ block }: BlockRendererProps) {
    const p = block.payload as Record<string, string>;
    const code = p.code || 'WELCOME10';
    const label = p.label || 'Discount';
    const instructions = p.instructions || 'Apply at checkout';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        alert(((window as any).orbychat_labels)?.copied_to_clipboard || 'Kod panoya kopyalandı!');
    };

    return (
        <div
            style={{
                marginTop: 8,
                padding: 12,
                borderRadius: 12,
                border: '2px dashed #10b981',
                background: '#f0fdf4',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                alignItems: 'center',
                textAlign: 'center',
            }}
        >
            <div style={{ fontSize: 11, fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>{label}</div>
            <div
                onClick={copyToClipboard}
                style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: '#064e3b',
                    letterSpacing: 2,
                    cursor: 'pointer',
                    padding: '4px 12px',
                    background: '#ffffff',
                    borderRadius: 6,
                    border: '1px solid #d1fae5'
                }}
            >
                {code}
            </div>
            <div style={{ fontSize: 12, color: '#065f46' }}>{instructions}</div>
        </div>
    );
}

/**
 * Order status card — displayed when the AI agent tracks an order.
 */
function OrderStatusCard({ block }: BlockRendererProps) {
    const p = block.payload as Record<string, string>;
    const orderId = p.order_id || '#0000';
    const status = p.status || ((window as any).orbychat_labels)?.processing || 'İşleniyor';
    const summary = p.summary || 'Your order is on the way.';
    const trackingUrl = p.tracking_url;

    return (
        <div style={{ marginTop: 8, padding: 12, borderRadius: 12, border: '1px solid #e2e8f0', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>{((window as any).orbychat_labels)?.order || 'Sipariş'} {orderId}</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: '#dcfce7', color: '#166534' }}>{status}</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: '#0f172a', lineHeight: 1.4 }}>{summary}</div>
            {trackingUrl && trackingUrl !== '#' && (
                <a
                    href={trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'block', marginTop: 10, padding: '6px', textAlign: 'center', background: '#f1f5f9', borderRadius: 6, fontSize: 12, fontWeight: 600, color: '#0f172a', textDecoration: 'none' }}
                >
                    {((window as any).orbychat_labels)?.track_package || 'Paketi Takip Et'}{!(((window as any).orbychat_labels)?.track_package || 'Paketi Takip Et').includes('→') && ' →'}
                </a>
            )}
        </div>
    );
}

/**
 * Account status card — shows user their current plan/usage if logged in.
 */
function AccountStatusCard({ block }: BlockRendererProps) {
    const p = block.payload as Record<string, string>;
    const plan = p.plan || 'Free';
    const usage = p.usage || '0%';
    const status = p.status || 'Active';

    return (
        <div style={{ marginTop: 8, padding: 12, borderRadius: 12, border: '1px solid #e2e8f0', background: '#ffffff' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{((window as any).orbychat_labels)?.account_status || 'Hesap Durumu'}</div>
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{plan} {((window as any).orbychat_labels)?.plan || 'Planı'}</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: status === 'Active' || status === 'Aktif' ? '#dcfce7' : '#fee2e2', color: status === 'Active' || status === 'Aktif' ? '#166534' : '#991b1b' }}>{status}</span>
            </div>
            <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 4 }}>
                    <span>{((window as any).orbychat_labels)?.usage || 'Kullanım'}</span>
                    <span>{usage}</span>
                </div>
                <div style={{ height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: usage, background: '#2563eb' }} />
                </div>
            </div>
        </div>
    );
}

/**
 * Signup card — clear path to registration.
 */
function SignupCard({ block }: BlockRendererProps) {
    const p = block.payload as Record<string, string>;
    const title = p.title || ((window as any).orbychat_labels)?.ready_to_start || 'Başlamaya hazır mısınız?';
    const cta = p.cta || ((window as any).orbychat_labels)?.create_account || 'Ücretsiz Hesap Oluştur';
    const url = p.url || '#';

    return (
        <div style={{ marginTop: 8, padding: 12, borderRadius: 12, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff' }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{title}</div>
            <a 
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', marginTop: 10, padding: '8px', textAlign: 'center', background: '#ffffff', color: '#0f172a', borderRadius: 6, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
            >
                {cta}
            </a>
        </div>
    );
}

/**
 * Appointment card — interactive multi-step wizard.
 */
function AppointmentCard({ block, state }: BlockRendererProps) {
    const labels = state?.agent?.ui_labels || (window as any).orbychat_labels;
    const p = block.payload as Record<string, string>;
    const title = p.title || labels?.appointment_request_title || 'Schedule Appointment';
    const description = p.description || labels?.appointment_request_desc || 'Request a time that works for you.';

    const [step, setStep] = useState(state?.leadCaptured ? 4 : 0);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [fieldValues, setFieldValues] = useState<Record<string, string | boolean>>({});
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        if (step < 4) {
            store.set({ showAppointmentFields: true });
        } else {
            store.set({ showAppointmentFields: false });
        }
        
        return () => {
            store.set({ showAppointmentFields: false });
        };
    }, [step]);

    const schema = state?.agent?.lead_form_fields || [
        { key: 'name', label: labels?.field_name || 'Name', type: 'text', required: false },
        { key: 'email', label: labels?.field_email || 'Email', type: 'email', required: true },
        { key: 'phone', label: labels?.field_phone || 'Phone', type: 'tel', required: true },
    ];

    const availability = state?.availability?.settings || {
        working_days: [1, 2, 3, 4, 5],
        working_hours_start: '09:00',
        working_hours_end: '17:00',
        timezone: 'UTC',
        slot_duration: 30,
        buffer_time: 0,
        require_kvkk: false,
    };

    const startHour = parseInt(availability.working_hours_start.split(':')[0], 10);
    const endHour = parseInt(availability.working_hours_end.split(':')[0], 10);
    const slotDuration = availability.slot_duration || 30;
    const bufferTime = availability.buffer_time || 0;
    const tz = availability.timezone || 'UTC';

    const nowInTz = new Date().toLocaleString('en-US', { timeZone: tz });
    const nowLocal = new Date(nowInTz);
    const todayInTz = nowLocal.toLocaleDateString('en-CA');

    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [todayBookedSlots, setTodayBookedSlots] = useState<string[]>([]);

    useEffect(() => {
        if (date && state?.init?.agent?.id) {
            state.api.getAvailability(state.init.agent.id, date)
                .then((res: any) => { if (res.booked_slots) setBookedSlots(res.booked_slots); })
                .catch(() => {});
        }
    }, [date, state?.init?.agent?.id, state?.api]);

    useEffect(() => {
        if (state?.init?.agent?.id && state?.api) {
            state.api.getAvailability(state.init.agent.id, todayInTz)
                .then((res: any) => { if (res.booked_slots) setTodayBookedSlots(res.booked_slots); })
                .catch(() => {});
        }
    }, [todayInTz, state?.init?.agent?.id, state?.api]);

    const isToday = date === todayInTz;
    const minTimeLocal = new Date(nowLocal.getTime() + (bufferTime * 60000));
    const currentMinutes = isToday ? minTimeLocal.getHours() * 60 + minTimeLocal.getMinutes() : -1;

    const timeSlots: string[] = [];
    for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += slotDuration) {
            const slot = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            if (!bookedSlots.includes(slot) && (h * 60 + m) > currentMinutes) timeSlots.push(slot);
        }
    }

    const todaySlots: string[] = [];
    for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += slotDuration) {
            const slot = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            // currentMinutes is only relevant if it's today
            const nowMin = nowLocal.getHours() * 60 + nowLocal.getMinutes() + bufferTime;
            if (!todayBookedSlots.includes(slot) && (h * 60 + m) > nowMin) todaySlots.push(slot);
        }
    }
    const todayIsFull = todaySlots.length === 0;


    const handleSubmit = async () => {
        if (availability.require_kvkk && !fieldValues['kvkk_consent']) {
            setError(labels?.error_kvkk || 'Please accept the data processing terms.');
            return;
        }
        const emailKey = schema.find(f => f.type === 'email')?.key || 'email';
        const emailVal = fieldValues[emailKey];
        if (typeof emailVal === 'string' && emailVal && !emailVal.includes('@')) {
            setError(labels?.error_invalid_email || 'Please enter a valid email.');
            return;
        }
        for (const field of schema) {
            if (field.required && !fieldValues[field.key]) {
                setError((labels?.error_fill_in || 'Please fill in ":field".').replace(':field', field.label));
                return;
            }
        }
        setSubmitting(true);
        setError(null);
        try {
            const payload = splitLeadValues({ ...fieldValues, appointment_date: date, appointment_time: time });
            await state.api.captureLead(state.init.jwt, payload);
            setStep(4);
            store.set({ leadCaptured: true });
        } catch (err: any) {
            setError(err?.message || labels?.error_generic || 'Could not save. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const cardStyle = { marginTop: 8, padding: 16, borderRadius: 16, border: '1px solid #e2e8f0', background: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' as const, gap: 12, width: '100%', boxSizing: 'border-box' as const };
    const buttonBase = { padding: '10px 16px', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 150ms ease' };

    if (step === 0) return (
        <div style={cardStyle}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{title}</div>
            <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.5 }}>{description}</div>
            <button type="button" onClick={() => setStep(1)} style={{ ...buttonBase, background: '#0f172a', color: 'white', marginTop: 4 }}>{labels?.appointment_request_cta || 'Select time'}{!(labels?.appointment_request_cta || 'Select time').includes('→') && ' →'}</button>
        </div>
    );
    if (step === 1) return (
        <div style={cardStyle}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{labels?.field_date || 'Step 1: Select Date'}</div>
            <CalendarPicker value={date} onChange={(v) => { setDate(v); setStep(2); }} workingDays={availability.working_days} labels={labels} excludeToday={todayIsFull} />
            <button type="button" onClick={() => setStep(0)} style={{ background: 'transparent', color: '#64748b', fontSize: 13, border: 'none', cursor: 'pointer' }}>← {labels?.back || 'Back'}</button>
        </div>
    );
    if (step === 2) return (
        <div style={cardStyle}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{labels?.field_time || 'Step 2: Select Time'}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, maxHeight: 180, overflowY: 'auto', padding: 4 }}>
                {timeSlots.map(s => <button key={s} onClick={() => { setTime(s); setStep(3); }} style={{ padding: '8px 4px', borderRadius: 8, border: '1px solid #e2e8f0', background: time === s ? '#0f172a' : 'white', color: time === s ? 'white' : '#0f172a', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{s}</button>)}
            </div>
            <button type="button" onClick={() => setStep(1)} style={{ background: 'transparent', color: '#64748b', fontSize: 13, border: 'none', cursor: 'pointer' }}>← {labels?.back || 'Back'}</button>
        </div>
    );
    if (step === 3) return (
        <div style={cardStyle}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{labels?.lead_form_title || 'Step 3: Your Info'}</div>
            <DynamicLeadFields schema={schema} values={fieldValues} onChange={(k, v) => setFieldValues(prev => ({ ...prev, [k]: v }))} state={state} />
            {availability.require_kvkk && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'start', marginTop: 4 }}>
                    <input type="checkbox" id="kvkk_consent" checked={!!fieldValues['kvkk_consent']} onChange={(e) => setFieldValues(prev => ({ ...prev, kvkk_consent: (e.target as HTMLInputElement).checked }))} style={{ marginTop: 3 }} />
                    <label htmlFor="kvkk_consent" style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4, cursor: 'pointer' }}>{labels?.kvkk_text || 'I consent to processing of my data.'}</label>
                </div>
            )}
            {error && <div style={{ color: '#ef4444', fontSize: 12 }}>{error}</div>}
            <button type="button" disabled={submitting} onClick={handleSubmit} style={{ ...buttonBase, background: '#0f172a', color: 'white', opacity: submitting ? 0.7 : 1 }}>{submitting ? (labels?.sending || 'Gönderiliyor...') : (labels?.send || 'Onayla')}</button>
            <button type="button" onClick={() => setStep(2)} style={{ background: 'transparent', color: '#64748b', fontSize: 13, border: 'none', cursor: 'pointer' }}>← {labels?.back || 'Back'}</button>
        </div>
    );
    return (
        <div style={{ ...cardStyle, alignItems: 'center', textAlign: 'center', background: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <div style={{ fontSize: 32 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#166534' }}>{labels?.appointment_requested || 'Talep Edildi!'}</div>
            <div style={{ fontSize: 14, color: '#15803d' }}>{labels?.appointment_success_desc || 'En kısa sürede size geri döneceğiz.'}</div>
        </div>
    );
}

/**
 * Treatment card — detailed info about medical procedures.
 */
function TreatmentCard({ block }: BlockRendererProps) {
    const p = block.payload as Record<string, string>;
    const title = p.title || ((window as any).orbychat_labels)?.treatment_info || 'Tedavi Bilgisi';
    const summary = p.summary || '';
    const price = p.price;

    return (
        <div style={{ marginTop: 8, padding: 12, borderRadius: 12, border: '1px solid #93c5fd', background: '#eff6ff' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>{((window as any).orbychat_labels)?.treatment || 'Tedavi'}</div>
            <div style={{ marginTop: 4, fontSize: 14, fontWeight: 700, color: '#1e3a8a' }}>{title}</div>
            {summary && <div style={{ marginTop: 4, fontSize: 13, color: '#1e40af', lineHeight: 1.4 }}>{summary}</div>}
            {price && <div style={{ marginTop: 8, fontSize: 14, fontWeight: 700, color: '#1e3a8a' }}>{((window as any).orbychat_labels)?.estimated || 'Tahmini'}: {price}</div>}
        </div>
    );
}

/**
 * Health plan card.
 */
function HealthPlanCard({ block }: BlockRendererProps) {
    const p = block.payload as Record<string, string>;
    const title = p.title || ((window as any).orbychat_labels)?.insurance || 'Sigorta';
    const details = p.details || '';

    return (
        <div style={{ marginTop: 8, padding: 12, borderRadius: 12, border: '1px solid #cbd5e1', background: '#f8fafc' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{title}</div>
            {details && <div style={{ marginTop: 4, fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>{details}</div>}
        </div>
    );
}

/**
 * Simple code block.
 */
function CodeBlock({ block }: BlockRendererProps) {
    const p = block.payload as Record<string, string>;
    const code = p.code || '';
    const language = p.language || 'code';

    return (
        <div style={{ marginTop: 8, borderRadius: 8, overflow: 'hidden', background: '#1e293b', border: '1px solid #334155' }}>
            <div style={{ padding: '4px 10px', background: '#0f172a', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>{language}</span>
                <button onClick={() => { navigator.clipboard.writeText(code); alert(((window as any).orbychat_labels)?.copied_to_clipboard || 'Kopyalandı!'); }} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 10, cursor: 'pointer', fontWeight: 600 }}>{((window as any).orbychat_labels)?.copy || 'Kopyala'}</button>
            </div>
            <pre style={{ padding: 12, margin: 0, overflowX: 'auto', fontSize: 12, color: '#e2e8f0', fontFamily: 'monospace' }}><code>{code}</code></pre>
        </div>
    );
}

/**
 * API Reference card.
 */
function ApiRefCard({ block }: BlockRendererProps) {
    const p = block.payload as Record<string, string>;
    const method = p.method || 'GET';
    const url = p.url || '/api/v1/resource';

    return (
        <div style={{ marginTop: 8, padding: 12, borderRadius: 12, border: '1px solid #e2e8f0', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 800, background: method === 'GET' ? '#dcfce7' : '#fee2e2', color: method === 'GET' ? '#166534' : '#991b1b', padding: '2px 6px', borderRadius: 4 }}>{method}</span>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>{url}</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>{p.title || ((window as any).orbychat_labels)?.api_endpoint || 'API Uç Noktası'}</div>
        </div>
    );
}

/**
 * Version picker.
 */
function VersionPicker({ block }: BlockRendererProps) {
    const p = block.payload as Record<string, string>;
    const current = p.current || 'v1.0';
    const versions = (p.available || '').split(',').map(v => v.trim()).filter(Boolean);

    return (
        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', alignSelf: 'center' }}>{((window as any).orbychat_labels)?.versions || 'Versiyonlar'}:</span>
            {versions.map(v => (
                <button key={v} style={{ padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: v === current ? '#0f172a' : '#f1f5f9', color: v === current ? '#ffffff' : '#64748b', border: '1px solid' + (v === current ? '#0f172a' : '#e2e8f0'), cursor: 'pointer' }}>{v}</button>
            ))}
        </div>
    );
}

/**
 * Troubleshooting card.
 */
function TroubleshootCard({ block }: BlockRendererProps) {
    const p = block.payload as Record<string, string>;
    const steps = (p.steps || '').split('|').map(s => s.trim()).filter(Boolean);

    return (
        <div style={{ marginTop: 8, padding: 12, borderRadius: 12, border: '1px solid #fed7aa', background: '#fff7ed' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#9a3412' }}>{p.title || ((window as any).orbychat_labels)?.troubleshooting || 'Sorun Giderme'}</div>
            <div style={{ marginTop: 8 }}>
                {steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#c2410c', marginTop: i > 0 ? 6 : 0 }}>
                        <span style={{ fontWeight: 700 }}>{i + 1}.</span>
                        <span>{step}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * KB Article card.
 */
function KbArticleCard({ block }: BlockRendererProps) {
    const p = block.payload as Record<string, string>;
    const url = p.url;

    return (
        <a href={url || '#'} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: 8, padding: 12, borderRadius: 12, border: '1px solid #e2e8f0', background: '#ffffff', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Help Article</div>
            <div style={{ marginTop: 4, fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{p.title || 'Help Article'}</div>
            {url && <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: '#2563eb' }}>{((window as any).orbychat_labels)?.read_more || 'Read more'} →</div>}
        </a>
    );
}

/**
 * Follow-up chip.
 */
function FollowUp({ block, onPromptClick }: BlockRendererProps) {
    const q = block.payload.question || '';
    if (!q) return null;

    return (
        <button
            type="button"
            onClick={() => onPromptClick?.(q)}
            style={{ appearance: 'none', background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '6px 12px', fontSize: 13, fontWeight: 500, color: '#0f172a', cursor: 'pointer', transition: 'all 150ms ease', whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#cbd5e1'; (e.currentTarget as HTMLElement).style.background = '#f8fafc'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLElement).style.background = 'white'; }}
        >
            {q}
        </button>
    );
}


export function BlockList({ blocks, onLeadCapture, onPromptClick, onEscalate, state }: { blocks: Block[]; onLeadCapture?: () => void; onPromptClick?: (prompt: string) => void; onEscalate?: () => void; state?: any; }) {
    if (!blocks.length) return null;
    return (
        <>
            {blocks.map((block, i) => {
                const Renderer = rendererFor(block.type);
                if (!Renderer) return null;
                return <Renderer key={`${block.type}-${i}`} block={block} onLeadCapture={onLeadCapture} onPromptClick={onPromptClick} onEscalate={onEscalate} state={state} />;
            })}
        </>
    );
}
