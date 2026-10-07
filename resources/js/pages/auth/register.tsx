import { Form, Head, usePage } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    authHelperTextClass,
    authInputClass,
    authLabelClass,
    authLinkClass,
    authNoticeClass,
    authPrimaryButtonClass,
} from '@/pages/auth/styles';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    const { startDomain } = usePage<{ startDomain: string | null }>().props;

    return (
        <>
            <Head title={__('Register')} />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="grid gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        {startDomain && (
                            <input
                                type="hidden"
                                name="domain"
                                value={startDomain}
                            />
                        )}
                        {startDomain && (
                            <p className={`${authNoticeClass} text-xs`}>
                                {__("After signup we'll start crawling")}{' '}
                                <strong className="font-medium">
                                    {startDomain}
                                </strong>{' '}
                                {__('automatically.')}
                            </p>
                        )}
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="name"
                                    className={authLabelClass}
                                >
                                    {__('Name')}
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder={__('Full name')}
                                    className={authInputClass}
                                />
                                <InputError message={errors.name} />
                            </div>

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
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    className={authInputClass}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password"
                                    className={authLabelClass}
                                >
                                    {__('Password')}
                                </Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder={__('Password')}
                                    className={authInputClass}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className={authLabelClass}
                                >
                                    {__('Confirm password')}
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder={__('Confirm password')}
                                    className={authInputClass}
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className={`${authPrimaryButtonClass} mt-1 w-full`}
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                {__('Create account')}
                            </Button>
                        </div>

                        <div className={`text-center ${authHelperTextClass}`}>
                            {__('Already have an account?')}{' '}
                            <TextLink
                                href={login()}
                                tabIndex={6}
                                className={authLinkClass}
                            >
                                {__('Log in')}
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: __('Create an account'),
    description: __('Enter your details below to create your account'),
};
