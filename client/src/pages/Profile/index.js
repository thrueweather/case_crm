import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import swal from 'sweetalert';

import ChangePassword from 'components/Modals/ChangePassword';
import { changePassword } from 'api/repository';
import Loader from 'components/Loader';

const Profile = () => {
    const { loading, data, error } = useSelector(state => state.user);
    const changePasswordForm = useForm();

    const [changePasswordIsOpen, setChangePasswordIsOpen] = useState(false);
    const [errorText, setErrorText] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleChangePassword = async variables => {
        setIsProcessing(true);
        try {
            await changePassword(variables);
            await swal('Great!', 'Password has been successfully changed!', 'success');
            setChangePasswordIsOpen(false);
            changePasswordForm.reset();
            setIsProcessing(false);
        } catch (e) {
            setIsProcessing(false);
            const errors = e?.response?.data;
            if (errors) {
                let errorText = '';
                for (const key in errors) {
                    errorText = errors[key].toString();
                }
                setErrorText(errorText);
            }
        }
    };

    if (loading && !data) return <Loader />;

    if (error) return error.message;

    return (
        <div>
            <Typography variant="h3" gutterBottom component="div">
                Profile
            </Typography>
            <Typography variant="h4" gutterBottom component="div">
                {data.first_name} {data.last_name}
            </Typography>
            <Typography variant="h5" gutterBottom component="div">
                Date Joined: {new Date(data.create_date).toLocaleDateString()}
            </Typography>
            <Typography variant="h5" gutterBottom component="div">
                email: {data.email}
            </Typography>
            <Button variant="contained" onClick={() => setChangePasswordIsOpen(true)}>
                Change Password
            </Button>
            <ChangePassword
                isOpen={changePasswordIsOpen}
                handleClose={() => setChangePasswordIsOpen(false)}
                changePasswordForm={changePasswordForm}
                onSubmit={handleChangePassword}
                error={errorText}
                loading={isProcessing}
            />
        </div>
    );
};

export default Profile;
