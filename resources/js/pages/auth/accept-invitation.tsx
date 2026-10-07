import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AuthLayout from '@/layouts/auth-layout';
import {
    authHelperTextClass,
    authNoticeClass,
    authPrimaryButtonClass,
} from '@/pages/auth/styles';

type Invitation = {
    email: string;
    role: string;
    workspace: { id: string; name: string };
    token: string;
};

export default function AcceptInvitation() {
    const { invitation } = usePage<{ invitation: Invitation }>().props;
    const [submitting, setSubmitting] = useState(false);

    const accept = () => {
        setSubmitting(true);
        router.post(
            `/invitations/${invitation.token}/accept`,
            {},
            {
                onFinish: () => setSubmitting(false),
            },
        );
    };

    return (
        <AuthLayout
            title={__('Accept invitation')}
            description={__('Join :name', { name: invitation.workspace.name })}
        >
            <Head title={__('Accept invitation')} />
            <Card className="space-y-4 rounded-[22px] border-[#e3dccf] bg-[#f7f2ea] p-6 shadow-none">
                <div>
                    <p className="text-sm font-medium text-[#6a7169]">
                        {__("You've been invited to join")}
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[#253129]">
                        {invitation.workspace.name}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#6a7169]">
                        {__('as')} <strong>{invitation.role}</strong> -· {__('for')}{' '}
                        <strong>{invitation.email}</strong>
                    </p>
                </div>
                <div className={`${authNoticeClass} text-xs`}>
                    {__('You must be signed in as')} <strong>{invitation.email}</strong>{' '}
                    {__('to accept this invitation.')}
                </div>
                <Button
                    onClick={accept}
                    disabled={submitting}
                    className={`${authPrimaryButtonClass} w-full`}
                >
                    {__('Accept invitation')}
                </Button>
                <p className={`text-xs ${authHelperTextClass}`}>
                    {__("If you're not signed in yet, log in or register first with this email.")}
                </p>
            </Card>
        </AuthLayout>
    );
}
