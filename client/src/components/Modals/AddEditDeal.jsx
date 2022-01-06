import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { isValidPhoneNumber } from 'react-phone-number-input';
import isValid from 'uk-postcode-validator';
import PhoneInput from 'react-phone-number-input';

import Modal from 'components/Modals/index';
import SelectField from '../SelectField';
import { genders } from 'utils';

import 'react-phone-number-input/style.css';

const steps = ['Customer information', 'Lead information', 'Complete'];

const AddDealModal = ({
    isOpen,
    form,
    edit,
    activeStep,
    isProcessing,
    handleClose,
    handleChangeStep,
    handleBackActiveStep,
}) => {
    const {
        register,
        formState: { errors },
        getValues,
        setValue,
        watch,
        handleSubmit,
    } = form;

    const values = getValues();

    const phoneNumber = watch('mobile_phone') || '';
    const postCode = watch('post_code');

    const isValidSubmit = (phoneNumber && !isValidPhoneNumber(phoneNumber)) || false;

    return (
        <Modal isOpen={isOpen} handleClose={handleClose} title={`${edit ? 'Edit' : 'Add'} Case`}>
            <Stepper sx={{ marginY: 3 }} activeStep={activeStep}>
                {steps.map(label => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <form onSubmit={handleSubmit(handleChangeStep)}>
                {activeStep === 0 ? (
                    <>
                        <TextField
                            label="First Name"
                            type="text"
                            placeholder="Name"
                            error={!!errors.first_name}
                            {...register('first_name', {
                                required: true,
                                maxLength: 20,
                            })}
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: 3 }}
                            label="Last Name"
                            type="text"
                            placeholder="Name"
                            error={!!errors.last_name}
                            {...register('last_name', {
                                required: true,
                                maxLength: 20,
                            })}
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: 3 }}
                            label="Email"
                            type="email"
                            placeholder="email"
                            error={!!errors.email}
                            {...register('email', { required: true, maxLength: 80 })}
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: 3 }}
                            label="Address"
                            type="text"
                            placeholder="Address"
                            {...register('address')}
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: 3 }}
                            label="Post Code"
                            placeholder="Post Code"
                            {...register('post_code', {
                                required: !!postCode,
                                validate: postCode ? value => isValid(value) : true,
                            })}
                            value={postCode?.toUpperCase()}
                            error={postCode && !isValid(postCode || '')}
                            fullWidth
                        />
                        {postCode && !!errors.post_code && (
                            <span className="validation-error">Enter a valid post code</span>
                        )}
                        <Box sx={{ marginTop: 3 }}>
                            <PhoneInput
                                defaultCountry="GB"
                                className={`mobile-phone ${phoneNumber && !isValidPhoneNumber(phoneNumber)
                                        ? 'validate-error'
                                        : ''
                                    }`}
                                placeholder="Mobile Phone"
                                value={values.mobile_phone}
                                onChange={value => setValue('mobile_phone', value)}
                            />
                        </Box>
                        <TextField
                            sx={{ marginTop: 3 }}
                            label="Age"
                            type="number"
                            placeholder="Age"
                            {...register('age')}
                            fullWidth
                        />
                        <SelectField
                            fullWidth
                            sx={{ marginTop: 3 }}
                            label="Gender"
                            defaultValue={edit ? genders[values.gender] : values.gender || ''}
                            {...register('gender')}
                            options={[
                                { value: 1, label: 'Male' },
                                { value: 2, label: 'Female' },
                            ]}
                        />
                    </>
                ) : (
                    <>
                        <TextField
                            sx={{ marginTop: 3 }}
                            label="Property Value"
                            type="number"
                            placeholder="Property Value"
                            error={!!errors.property_amount}
                            {...register('property_amount', { required: true })}
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: 3 }}
                            label="Mortgage Value"
                            type="number"
                            placeholder="Mortgage Value"
                            error={!!errors.mortgage_amount}
                            {...register('mortgage_amount', { required: true })}
                            fullWidth
                        />
                        <TextField
                            sx={{ marginTop: 3 }}
                            label="Notes"
                            type="text"
                            multiline
                            placeholder="Notes"
                            maxRows={4}
                            {...register('message')}
                            fullWidth
                        />
                    </>
                )}
                <Box sx={{ marginTop: 3 }} className={isProcessing ? 'disabled' : ''}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        disabled={isValidSubmit}
                    >
                        {isProcessing ? 'Loading...' : 'Save'}
                    </Button>
                    <Button sx={{ marginLeft: 1 }} variant="outlined" onClick={handleClose}>
                        Cancel
                    </Button>
                    {activeStep !== 0 && (
                        <Button
                            sx={{ marginLeft: 1 }}
                            variant="contained"
                            onClick={() => handleBackActiveStep(activeStep - 1)}
                        >
                            Back
                        </Button>
                    )}
                </Box>
            </form>
        </Modal>
    );
};

export default AddDealModal;
