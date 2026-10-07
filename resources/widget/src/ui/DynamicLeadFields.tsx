import { store, WidgetState } from '../core/store';
import { useState, useEffect } from 'preact/hooks';

/**
 * Stateless renderer for a list of `LeadFormField` definitions
 * coming from the agent's `lead_form_fields` schema (#34). Used
 * inside both `<LeadForm/>` (mid-conversation) and `<PreChatGate/>`
 * (pre-chat gate, #10) so the buyer's custom schema renders the
 * same way in both mount points.
 *
 * Field types in v1: text / email / tel / textarea / select /
 * checkbox. The `key` becomes the form-state map key; the parent
 * decides what to do with the values on submit (typically: split
 * out reserved `email` / `name` / `phone` to top-level Lead columns
 * and pass everything else through as `fields`).
 *
 * One field per row keeps tap targets honest on mobile.
 */
type Values = Record<string, string | boolean>;

type Props = {
    schema: LeadFormField[];
    values: Values;
    onChange: (key: string, value: string | boolean) => void;
    state: WidgetState;
};

const inputBase = {
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: '10px 12px',
    // 16px keeps iOS Safari from auto-zooming on focus.
    fontSize: 16,
    outline: 'none',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box' as const,
};

const labelBase = {
    fontSize: 12,
    fontWeight: 500,
    color: '#334155',
    marginBottom: 4,
};

export function DynamicLeadFields({ schema, values, onChange, state }: Props) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {schema.map((field) => (
                <FieldRow
                    key={field.key}
                    field={field}
                    value={values[field.key]}
                    onChange={(v) => onChange(field.key, v)}
                    state={state}
                />
            ))}
        </div>
    );
}

function FieldRow({
    field,
    value,
    onChange,
    state,
}: {
    field: LeadFormField;
    value: string | boolean | undefined;
    onChange: (v: string | boolean) => void;
    state: WidgetState;
}) {
    const id = `pb-lead-${field.key}`;
    const labels = state.agent?.ui_labels || (window as any).orbychat_labels;

    if (field.type === 'checkbox') {
        const checked = value === true;

        return (
            <label
                htmlFor={id}
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    fontSize: 13,
                    color: '#0f172a',
                    cursor: 'pointer',
                }}
            >
                <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    required={field.required === true}
                    onChange={(e) =>
                        onChange((e.target as HTMLInputElement).checked)
                    }
                    style={{ marginTop: 2, flexShrink: 0 }}
                />
                <span>
                    {field.label}
                    {field.required ? (
                        <span style={{ color: '#b91c1c' }}> *</span>
                    ) : null}
                </span>
            </label>
        );
    }

    if (field.type === 'select') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor={id} style={labelBase}>
                    {field.label}
                    {field.required ? (
                        <span style={{ color: '#b91c1c' }}> *</span>
                    ) : null}
                </label>
                <select
                    id={id}
                    required={field.required === true}
                    value={typeof value === 'string' ? value : ''}
                    onChange={(e) =>
                        onChange((e.target as HTMLSelectElement).value)
                    }
                    style={{ ...inputBase, background: 'white' }}
                >
                    <option value="" disabled>
                        {(field.placeholder ?? labels?.select_an_option) || 'Select an option'}
                    </option>
                    {(field.options ?? []).map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            </div>
        );
    }

    if (field.type === 'textarea') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor={id} style={labelBase}>
                    {field.label}
                    {field.required ? (
                        <span style={{ color: '#b91c1c' }}> *</span>
                    ) : null}
                </label>
                <textarea
                    id={id}
                    required={field.required === true}
                    placeholder={field.placeholder ?? ''}
                    maxLength={field.maxlength ?? undefined}
                    value={typeof value === 'string' ? value : ''}
                    onInput={(e) =>
                        onChange((e.target as HTMLTextAreaElement).value)
                    }
                    rows={3}
                    style={{ ...inputBase, resize: 'vertical' }}
                />
            </div>
        );
    }

    if (field.type === 'date') {
        const availability = state.availability?.settings || {
            working_days: [1, 2, 3, 4, 5],
        };

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor={id} style={labelBase}>
                    {field.label}
                    {field.required ? (
                        <span style={{ color: '#b91c1c' }}> *</span>
                    ) : null}
                </label>
                <CalendarPicker
                    value={typeof value === 'string' ? value : ''}
                    onChange={onChange}
                    workingDays={availability.working_days}
                    labels={labels}
                />
            </div>
        );
    }

    if (field.type === 'time') {
        const availability = state.availability?.settings || {
            working_hours_start: '09:00',
            working_hours_end: '17:00',
        };

        const [bookedSlots, setBookedSlots] = useState<string[]>([]);
        const appointmentDate = values['appointment_date'] as string | undefined;

        useEffect(() => {
            if (appointmentDate && state.init?.agent?.id && state.api) {
                state.api.getAvailability(state.init.agent.id, appointmentDate)
                    .then((res: any) => {
                        if (res.booked_slots) {
                            setBookedSlots(res.booked_slots);
                        }
                    })
                    .catch(() => {});
            }
        }, [appointmentDate, state.init?.agent?.id, state.api]);

        // Simple time select based on working hours
        const start = parseInt(availability.working_hours_start.split(':')[0], 10);
        const end = parseInt(availability.working_hours_end.split(':')[0], 10);
        const slots = [];
        for (let i = start; i < end; i++) {
            const s1 = `${i.toString().padStart(2, '0')}:00`;
            const s2 = `${i.toString().padStart(2, '0')}:30`;
            if (!bookedSlots.includes(s1)) slots.push(s1);
            if (!bookedSlots.includes(s2)) slots.push(s2);
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label htmlFor={id} style={labelBase}>
                    {field.label}
                    {field.required ? (
                        <span style={{ color: '#b91c1c' }}> *</span>
                    ) : null}
                </label>
                <select
                    id={id}
                    required={field.required === true}
                    value={typeof value === 'string' ? value : ''}
                    onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
                    style={{ ...inputBase, background: 'white' }}
                >
                    <option value="">{labels?.select_time || 'Select time'}</option>
                    {slots.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>
        );
    }

    // text / email / tel
    const inputType =
        field.type === 'email'
            ? 'email'
            : field.type === 'tel'
              ? 'tel'
              : 'text';

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label htmlFor={id} style={labelBase}>
                {field.label}
                {field.required ? (
                    <span style={{ color: '#b91c1c' }}> *</span>
                ) : null}
            </label>
            <input
                id={id}
                type={inputType}
                required={field.required === true}
                placeholder={field.placeholder ?? ''}
                maxLength={field.maxlength ?? undefined}
                autoComplete={
                    field.type === 'email'
                        ? 'email'
                        : field.type === 'tel'
                          ? 'tel'
                          : field.key === 'name'
                            ? 'name'
                            : 'off'
                }
                value={typeof value === 'string' ? value : ''}
                onInput={(e) => onChange((e.target as HTMLInputElement).value)}
                style={inputBase}
            />
        </div>
    );
}

/**
 * Server-reserved keys that map onto Lead columns directly. The
 * widget submits these at the TOP LEVEL of the captureLead payload
 * (so existing analytics queries on `email` / `name` / `phone`
 * keep working) and everything else goes into the `fields` map.
 */
export const RESERVED_LEAD_KEYS = ['email', 'name', 'phone'] as const;

export function splitLeadValues(values: Values): {
    email?: string;
    name?: string;
    phone?: string;
    fields: Record<string, string | boolean>;
} {
    const out: {
        email?: string;
        name?: string;
        phone?: string;
        fields: Record<string, string | boolean>;
    } = { fields: {} };

    for (const [key, value] of Object.entries(values)) {
        if (key === 'email' && typeof value === 'string') {
            out.email = value.trim();
        } else if (key === 'name' && typeof value === 'string') {
            const trimmed = value.trim();

            if (trimmed !== '') {
                out.name = trimmed;
            }
        } else if (key === 'phone' && typeof value === 'string') {
            const trimmed = value.trim();

            if (trimmed !== '') {
                out.phone = trimmed;
            }
        } else if (value !== undefined && value !== '' && value !== false) {
            out.fields[key] = value;
        }
    }

    return out;
}

/**
 * Default schema applied when an agent has no custom
 * `lead_form_fields` set — keeps the legacy two-field form working
 * unchanged.
 */
export const DEFAULT_LEAD_SCHEMA: LeadFormField[] = [
    {
        key: 'name',
        label: 'Your name',
        type: 'text',
        required: false,
        placeholder: 'Optional',
    },
    {
        key: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        placeholder: 'email@example.com',
    },
];

export function resolveSchema(
    raw: LeadFormField[] | null | undefined,
    labels?: Record<string, string>
): LeadFormField[] {
    const showAppointment = store.get().showAppointmentFields;

    if (Array.isArray(raw) && raw.length > 0) {
        // Attempt to translate labels for reserved keys if they match defaults
        const out = raw.map(f => {
            if (f.key === 'name' && labels?.field_name) return { ...f, label: labels.field_name };
            if (f.key === 'email' && labels?.field_email) return { ...f, label: labels.field_email };
            if (f.key === 'phone' && labels?.field_phone) return { ...f, label: labels.field_phone };
            return f;
        });

        if (showAppointment) {
            // Append date/time if not already present
            if (!out.some(f => f.type === 'date')) {
                out.push({
                    key: 'appointment_date',
                    label: labels?.field_date || 'Date',
                    type: 'date',
                    required: true,
                });
            }
            if (!out.some(f => f.type === 'time')) {
                out.push({
                    key: 'appointment_time',
                    label: labels?.field_time || 'Time',
                    type: 'time',
                    required: true,
                });
            }
            return out;
        }
        return raw;
    }

    const base = [
        {
            key: 'name',
            label: labels?.field_name || 'Your name',
            type: 'text',
            required: false,
            placeholder: labels?.field_optional || 'Optional',
        },
        {
            key: 'email',
            label: labels?.field_email || 'Email',
            type: 'email',
            required: true,
            placeholder: labels?.field_email_placeholder || 'email@example.com',
        },
        {
            key: 'phone',
            label: labels?.field_phone || 'Phone',
            type: 'tel',
            required: true,
            placeholder: labels?.field_phone_placeholder || '5xx xxx xx xx',
        },
    ];

    if (showAppointment) {
        base.push({
            key: 'appointment_date',
            label: labels?.field_date || 'Date',
            type: 'date',
            required: true,
        });
        base.push({
            key: 'appointment_time',
            label: labels?.field_time || 'Time',
            type: 'time',
            required: true,
        });
    }

    return base;
}

export function CalendarPicker({
    value,
    onChange,
    workingDays,
    labels,
    excludeToday,
}: {
    value: string;
    onChange: (v: string) => void;
    workingDays: number[];
    labels: any;
    excludeToday?: boolean;
}) {
    const [current, setCurrent] = useState(new Date());
    const [selected, setSelected] = useState(value ? new Date(value) : null);

    const year = current.getFullYear();
    const month = current.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const days = [];
    // Adjust firstDay (Sun=0, Mon=1)
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
    }

    const isAvailable = (date: Date) => {
        const d = date.getDay();
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const isToday = date.getTime() === today.getTime();
        if (isToday && excludeToday) return false;

        return workingDays.includes(d) && date >= today;
    };

    const handleSelect = (date: Date) => {
        if (!isAvailable(date)) return;
        
        // Manual local date formatting (YYYY-MM-DD) to avoid UTC shifts
        const y = date.getFullYear();
        const m = (date.getMonth() + 1).toString().padStart(2, '0');
        const d = date.getDate().toString().padStart(2, '0');
        const formatted = `${y}-${m}-${d}`;
        
        setSelected(date);
        onChange(formatted);
    };

    const monthNames = [
        labels?.month_jan || "Jan", labels?.month_feb || "Feb", labels?.month_mar || "Mar",
        labels?.month_apr || "Apr", labels?.month_may || "May", labels?.month_jun || "Jun",
        labels?.month_jul || "Jul", labels?.month_aug || "Aug", labels?.month_sep || "Sep",
        labels?.month_oct || "Oct", labels?.month_nov || "Nov", labels?.month_dec || "Dec"
    ];

    const dayHeaders = [
        labels?.day_sun_short || "S",
        labels?.day_mon_short || "M",
        labels?.day_tue_short || "T",
        labels?.day_wed_short || "W",
        labels?.day_thu_short || "T",
        labels?.day_fri_short || "F",
        labels?.day_sat_short || "S",
    ];

    return (
        <div style={{ 
            border: '1px solid #e5e7eb', 
            borderRadius: 8, 
            padding: 10, 
            background: '#f8fafc' 
        }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 600
            }}>
                <button 
                    type="button" 
                    onClick={() => setCurrent(new Date(year, month - 1, 1))}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 8px', fontSize: 18 }}
                >
                    &lt;
                </button>
                <span style={{ color: '#0f172a' }}>{monthNames[month]} {year}</span>
                <button 
                    type="button" 
                    onClick={() => setCurrent(new Date(year, month + 1, 1))}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 8px', fontSize: 18 }}
                >
                    &gt;
                </button>
            </div>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)', 
                gap: 4,
                textAlign: 'center',
                fontSize: 11,
                color: '#64748b',
                marginBottom: 4
            }}>
                {dayHeaders.map(d => <div key={d}>{d}</div>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                {days.map((d, i) => {
                    if (!d) return <div key={`empty-${i}`} />;
                    const available = isAvailable(d);
                    const isSelected = selected && d.toDateString() === selected.toDateString();
                    
                    return (
                        <div
                            key={d.toISOString()}
                            onClick={() => handleSelect(d)}
                            style={{
                                padding: '6px 0',
                                fontSize: 13,
                                borderRadius: 4,
                                cursor: available ? 'pointer' : 'default',
                                background: isSelected ? '#0f172a' : 'transparent',
                                color: isSelected ? 'white' : (available ? '#0f172a' : '#cbd5e1'),
                                fontWeight: isSelected ? 600 : 400,
                                textAlign: 'center'
                            }}
                        >
                            {d.getDate()}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
