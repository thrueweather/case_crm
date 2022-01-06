import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import { signIn } from 'api/repository';
import * as path from 'constants/routes';
import { saveToken } from 'utils';

import './styles.scss';

const SignIn = () => {
    const history = useHistory();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const onSubmit = async variables => {
        setIsProcessing(true);
        error && setError(null);
        try {
            const response = await signIn(variables);
            saveToken(response.key);
            history.push(path.DASHBOARD);
        } catch (e) {
            setIsProcessing(false);
            const errors = e?.response?.data;
            if (errors) {
                let errorText = '';
                for (const key in errors) {
                    errorText = errors[key].toString();
                }
                setError(errorText);
                return;
            }
            setError(`We're experiencing an internal server error. Please try again later.`);
        }
    };

    return (
        <div className="sign-in">
            <div className={`sign-in-wrapper ${isProcessing ? 'loading' : ''}`}>
                <Typography variant="h4" gutterBottom component="div">
                    Expert Mortgage Advice CRM
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="field-wrapper">
                        <TextField
                            fullWidth
                            label="Email"
                            type="text"
                            error={!!errors.email}
                            placeholder="email"
                            {...register('email', {
                                required: true,
                                maxLength: 80,
                                pattern: /^\S+@\S+$/i,
                            })}
                        />
                        {errors.email && (
                            <div className="validation-error">E-mail is not valid!</div>
                        )}
                    </div>
                    <div className="field-wrapper">
                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            placeholder="password"
                            error={!!errors.password}
                            {...register('password', {
                                required: true,
                            })}
                        />
                    </div>
                    <Button type="submit" variant="contained" disabled={isProcessing}>
                        {isProcessing ? 'Loading...' : 'Sign in'}
                    </Button>
                    {error && (
                        <Alert severity="error" style={{ marginTop: 20 }}>
                            {error}
                        </Alert>
                    )}
                </form>
            </div>
        </div>
    );
};

export default SignIn;
