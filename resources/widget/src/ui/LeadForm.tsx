import { useState } from 'preact/hooks';
import type { LeadFormField, WidgetApi } from '../core/api';
import { store } from '../core/store';
import {
    DynamicLeadFields,
    resolveSchema,
    splitLeadValues,
} from './DynamicLeadFields';

type Props = {
    api: WidgetApi;
    jwt: string;
    accent: string;
    /**
     * Per-agent lead-form schema (#34). Null falls back to the
     * default Name + Email shape via `resolveSchema()`.
     */
    schema?: LeadFormField[] | null;
};

export function LeadForm({ api, jwt, accent, schema }: Props) {
    const labels = store.get().agent?.ui_labels;
    const fields = resolveSchema(schema, labels);
    const [values, setValues] = useState<Record<string, string | boolean>>({});
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submit = async (e: Event) => {
        e.preventDefault();

        for (const field of fields) {
            if (field.required !== true) {
                continue;
            }

            const v = values[field.key];

            if (
                (field.type === 'checkbox' && v !== true) ||
                (field.type !== 'checkbox' &&
                    (typeof v !== 'string' || v.trim() === ''))
            ) {
                const template = labels?.error_fill_in || 'Please fill in ":field".';
                setError(template.replace(':field', field.label));

                return;
            }
        }

        const payload = splitLeadValues(values);

        if (!payload.email || !payload.email.includes('@')) {
            setError(labels?.error_invalid_email || 'Please enter a valid email address.');

            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            await api.captureLead(jwt, payload);
            store.set({ leadCaptured: true, leadFormOpen: false });
        } catch (err: any) {
            setError(err?.message || labels?.error_generic || 'Could not save your details. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={submit}
            style={{
                margin: '8px 16px',
                padding: 12,
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                background: '#f9fafb',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
            }}
        >
            <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>
                {labels?.lead_form_title || "Leave your details — we'll get back to you."}
            </p>

            <DynamicLeadFields
                schema={fields}
                values={values}
                onChange={(key, value) =>
                    setValues((v) => ({ ...v, [key]: value }))
                }
                state={store.get()}
            />

            {error && (
                <p style={{ margin: 0, color: '#b91c1c', fontSize: 12 }}>
                    {error}
                </p>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
                <button
                    type="submit"
                    disabled={submitting}
                    style={{
                        flex: 1,
                        background: accent,
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        padding: '10px 14px',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: submitting ? 'wait' : 'pointer',
                    }}
                >
                    {submitting ? (labels?.sending || 'Sending...') : (labels?.send || 'Send')}
                </button>
                <button
                    type="button"
                    onClick={() => store.set({ leadFormOpen: false })}
                    style={{
                        background: '#ffffff',
                        color: '#334155',
                        border: '1px solid #cbd5e1',
                        borderRadius: 8,
                        padding: '10px 14px',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    {labels?.dismiss || 'Dismiss'}
                </button>
            </div>
        </form>
    );
}
