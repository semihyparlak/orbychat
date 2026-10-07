import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    authInputClass,
    authLabelClass,
    authPrimaryButtonClass,
} from '@/pages/auth/styles';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <>
            <Head title={__('Confirm password')} />

            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }) => (
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label
                                htmlFor="password"
                                className={authLabelClass}
                            >
                                {__('Password')}
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                placeholder={__('Password')}
                                autoComplete="current-password"
                                autoFocus
                                className={authInputClass}
                            />

                            <InputError message={errors.password} />
                        </div>
                        <Button
                            className={`${authPrimaryButtonClass} w-full`}
                            disabled={processing}
                            data-test="confirm-password-button"
                        >
                            {processing && <Spinner />}
                            {__('Confirm password')}
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: __('Confirm your password'),
    description:
        __('This is a secure area of the application. Please confirm your password before continuing.'),
};
