// Components
import { Form, Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
    authLinkClass,
    authNoticeClass,
    authPrimaryButtonClass,
} from '@/pages/auth/styles';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title={__('Email verification')} />

            {status === 'verification-link-sent' && (
                <div className={`${authNoticeClass} mb-4`}>
                    {__('A new verification link has been sent to the email address you provided during registration.')}
                </div>
            )}

            <Form {...send.form()} className="grid gap-4 text-center">
                {({ processing }) => (
                    <>
                        <Button
                            disabled={processing}
                            className={authPrimaryButtonClass}
                        >
                            {processing && <Spinner />}
                            {__('Resend verification email')}
                        </Button>

                        <TextLink
                            href={logout()}
                            className={`${authLinkClass} mx-auto block text-sm`}
                        >
                            {__('Log out')}
                        </TextLink>
                    </>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = {
    title: __('Verify email'),
    description:
        __('Please verify your email address by clicking on the link we just emailed to you.'),
};
