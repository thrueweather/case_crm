import React from 'react';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';

import Modal from 'components/Modals';

const ChangePassword = ({ isOpen, handleClose, changePasswordForm, onSubmit, error, loading }) => {
    const {
        handleSubmit,
        register,
        formState: { errors },
        watch,
    } = changePasswordForm;

    const password = watch('new_password1');

    return (
        <Modal isOpen={isOpen} handleClose={handleClose} title="Change Password">
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    label="New password"
                    type="password"
                    placeholder="password"
                    error={!!errors.password1}
                    {...register('new_password1', {
                        required: 'You must specify a password',
                        minLength: {
                            value: 8,
                            message: 'Password must have at least 8 characters',
                        },
                    })}
                    fullWidth
                />
                <TextField
                    sx={{ marginTop: 3 }}
                    label="Confirm password"
                    type="password"
                    placeholder="Confirm password"
                    error={!!errors.password2}
                    {...register('new_password2', {
                        required: true,
                        validate: value => value === password || 'The passwords do not match',
                    })}
                    fullWidth
                />
                {errors.password2 && (
                    <div className="validation-error">{errors.password2.message}</div>
                )}
                <LoadingButton
                    sx={{ marginTop: 3 }}
                    loading={loading}
                    type="submit"
                    variant="contained"
                >
                    Submit
                </LoadingButton>
                {error && (
                    <Alert severity="error" style={{ marginTop: 20 }}>
                        {error}
                    </Alert>
                )}
            </form>
        </Modal>
    );
};

export default ChangePassword;
