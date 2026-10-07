// Components
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    authHelperTextClass,
    authInputClass,
    authLabelClass,
    authLinkClass,
    authNoticeClass,
    authPrimaryButtonClass,
} from '@/pages/auth/styles';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title={__('Forgot password')} />

            {status && (
                <div className={`${authNoticeClass} mb-4`}>{status}</div>
            )}

            <div className="space-y-6">
                <Form {...email.form()} className="grid gap-5">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className={authLabelClass}
                                >
                                    {__('Email address')}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="email@example.com"
                                    className={authInputClass}
                                />

                                <InputError message={errors.email} />
                            </div>

                            <div className="mt-4 flex items-center justify-start">
                                <Button
                                    className={`${authPrimaryButtonClass} w-full`}
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    )}
                                    {__('Email password reset link')}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className={`space-x-1 text-center ${authHelperTextClass}`}>
                    <span>{__('Or, return to')}</span>
                    <TextLink href={login()} className={authLinkClass}>
                        {__('log in')}
                    </TextLink>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: __('Forgot password'),
    description: __('Enter your email to receive a password reset link'),
};
