import { useState, useEffect, useMemo, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';

import Modal from 'components/Modals/index';
import AddNewProvider from './AddNewProvider';
import AddNewLender from './AddNewLender';
import SelectField from '../SelectField';
import DateField from '../DateField';

import { fetchProductForm } from 'store/reducers/deals/index';
import { moneyField, caseValuePending, caseValueReceived } from 'utils';

const wrappStyles = {
    marginTop: 3,
    display: 'flex',
    alignItems: 'center',
};

const initializeReceiveds = {
    application_fee: false,
    offer_completion_fee: false,
    proc_fee: false,
};

const AddProduct = ({
    isOpen,
    handleClose,
    deal,
    productType,
    handleAddProduct,
    styles,
}) => {
    const dispatch = useDispatch();
    const { errorProductForm, loadingProductForm, productForm } = useSelector(
        state => state.deals
    );
    const {
        handleSubmit,
        formState: { errors },
        getValues,
        reset,
        register,
        watch,
        setValue,
    } = useForm();

    const [type, setType] = useState('');
    const [received, setCheckboxes] = useState(initializeReceiveds);
    const [newProviderIsOpen, setNewProviderIsOpen] = useState(false);
    const [newProvider, setNewProvider] = useState({
        product: '',
        name: '',
    });
    const [newLenderIsOpen, setNewLenderIsOpen] = useState(false);
    const [newLender, setNewLender] = useState('');

    const values = getValues();
    const application_fee = parseInt(watch('application_fee') || 0);
    const offer_completion_fee = parseInt(watch('offer_completion_fee') || 0);
    const proc_fee = parseInt(watch('proc_fee') || 0);
    const lenderId = watch('lender') || watch('provider');
    const products = deal?.products;
    const expiry_date = watch('expiry_date');

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchProductForm());
        }
    }, [isOpen, type, dispatch]);

    useEffect(() => {
        reset();
    }, [reset, type]);

    useEffect(() => {
        if (productType) {
            setType(productType);
            setValue('productType', productType);
        }
    }, [productType, setValue]);

    const onChangeCheckboxes = type => () => {
        setCheckboxes(state => ({
            ...state,
            [type]: !state[type],
        }));
    };

    const sumOfGrossTotal = type => {
        const applicationFee =
            received.application_fee === type ? application_fee : 0;
        const offerComletionFee =
            received.offer_completion_fee === type ? offer_completion_fee : 0;
        const procFee = received.proc_fee === type ? proc_fee : 0;

        return applicationFee + offerComletionFee + procFee;
    };

    const sumOfAllPendingCase = () => {
        return sumOfGrossTotal(false) + caseValuePending(products);
    };

    const sumOfAllReceivedCase = () => {
        return sumOfGrossTotal(true) + caseValueReceived(products);
    };

    const productsByProvider = useMemo(() => {
        if (!productForm[type]) return [];
        const productsByProvider = productForm[type].find(
            ({ id }) => id === lenderId
        )?.products;
        return productsByProvider;
    }, [productForm, type, lenderId]);

    const onAddProduct = async variables => {
        handleAddProduct({
            ...variables,
            gross_total_pending: sumOfGrossTotal(false),
            gross_total_received: sumOfGrossTotal(true),
            case_value_pending: sumOfAllPendingCase(),
            case_value_received: sumOfAllReceivedCase(),
            received_application_fee: received.application_fee,
            received_offer_completion_fee: received.offer_completion_fee,
            received_proc_fee: received.proc_fee,
            ...(variables.provider ||
                (newProvider.name && {
                    provider: variables.provider || newProvider.name,
                })),
            ...(variables.product ||
                (newProvider.product && {
                    product: variables.product || newProvider.product,
                })),
            ...(variables.lender ||
                (newLender && { lender: variables.lender || newLender })),
            expiry_date,
        });
        handleClose();
        reset();
        setValue('productType', null);
        setCheckboxes(initializeReceiveds);
    };

    const onChangeNewProvider = type => e => {
        setNewProvider(state => ({ ...state, [type]: e.target.value }));
    };

    const onChangeNewLender = e => {
        setNewLender(e.target.value);
    };

    const SelectLender = () => {
        if (loadingProductForm) return 'Loading...';
        if (errorProductForm) return errorProductForm.message;
        return (
            <>
                {!newLender && (
                    <SelectField
                        fullWidth
                        sx={{ marginTop: 3 }}
                        label={'Select Lender'}
                        error={!!errors.lender}
                        defaultValue={values.lender}
                        {...register('lender', { required: !newLender })}
                        options={productForm[type]?.map(({ id, name }) => ({
                            value: id,
                            label: name,
                        }))}
                    />
                )}
                {!newLender ? (
                    <Button
                        sx={{ marginTop: 3 }}
                        variant='contained'
                        onClick={() => setNewLenderIsOpen(true)}
                    >
                        Add New Lender
                    </Button>
                ) : (
                    <Button
                        sx={{ marginTop: 3 }}
                        variant='contained'
                        onClick={() => setNewLender('')}
                    >
                        Reset New Lender
                    </Button>
                )}
            </>
        );
    };

    const SelectProvider = () => (
        <>
            {!newProvider.name && !newProvider.product && (
                <SelectField
                    fullWidth
                    sx={{ marginTop: 3 }}
                    label={'Select Provider'}
                    error={!!errors.provider}
                    defaultValue={values.provider}
                    {...register('provider', {
                        required: !newProvider.name,
                    })}
                    options={productForm[type]?.map(({ id, name }) => ({
                        value: id,
                        label: name,
                    }))}
                />
            )}
            {!newProvider.name && !newProvider.product ? (
                <Button
                    sx={{ marginTop: 3 }}
                    variant='contained'
                    onClick={() => setNewProviderIsOpen(true)}
                >
                    Add New Provider
                </Button>
            ) : (
                <Button
                    sx={{ marginTop: 3 }}
                    variant='contained'
                    onClick={() => setNewProvider({ name: '', product: '' })}
                >
                    Reset provider and product
                </Button>
            )}
        </>
    );

    const SelectProduct = () => {
        if (newProvider.name && newProvider.product) return null;
        return (
            <SelectField
                fullWidth
                sx={{ marginTop: 3 }}
                label={'Select Insurance Product'}
                error={!!errors.product}
                defaultValue={values.product}
                {...register('product', { required: !newProvider.product })}
                options={productsByProvider?.map(({ id, name }) => ({
                    value: id,
                    label: name,
                }))}
            />
        );
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            handleClose={handleClose}
            title='Add Product'
            styles={{ ...styles }}
        >
            <form onSubmit={handleSubmit(onAddProduct)}>
                <SelectField
                    fullWidth
                    label={'Product Type'}
                    error={!!errors.productType}
                    defaultValue={values.productType}
                    {...register('productType', { required: true })}
                    onChange={e => setType(e.target.value)}
                    options={[
                        { value: 'insurance', label: 'Insurance Provider' },
                        { value: 'mortgage', label: 'Mortgage Lender' },
                    ]}
                />
                {type && (
                    <Fragment>
                        {type === 'mortgage' ? (
                            <SelectLender />
                        ) : (
                            <>
                                <SelectProvider />
                                <SelectProduct />
                            </>
                        )}
                        <Box sx={wrappStyles}>
                            <TextField
                                label='Application Fee'
                                type='number'
                                placeholder='Application Fee'
                                error={!!errors.application_fee}
                                {...register(`application_fee`, {
                                    required: true,
                                })}
                            />
                            <FormGroup sx={{ marginLeft: 4 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={received.application_fee}
                                            onChange={onChangeCheckboxes(
                                                'application_fee'
                                            )}
                                        />
                                    }
                                    label={
                                        received.application_fee
                                            ? 'Paid'
                                            : 'Payment Pending'
                                    }
                                />
                            </FormGroup>
                        </Box>
                        <Box sx={wrappStyles}>
                            <TextField
                                label='Offer / Completion Fee'
                                type='number'
                                placeholder='Offer/Completion Fee'
                                error={!!errors.offer_completion_fee}
                                {...register(`offer_completion_fee`, {
                                    required: true,
                                })}
                            />
                            <FormGroup sx={{ marginLeft: 4 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={
                                                received.offer_completion_fee
                                            }
                                            onChange={onChangeCheckboxes(
                                                'offer_completion_fee'
                                            )}
                                        />
                                    }
                                    label={
                                        received.offer_completion_fee
                                            ? 'Paid'
                                            : 'Payment Pending'
                                    }
                                />
                            </FormGroup>
                        </Box>
                        <Box sx={wrappStyles}>
                            <TextField
                                label='Proc Fee'
                                type='number'
                                placeholder='Proc Fee'
                                error={!!errors.proc_fee}
                                {...register(`proc_fee`, {
                                    required: true,
                                })}
                            />
                            <FormGroup sx={{ marginLeft: 4 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={received.proc_fee}
                                            onChange={onChangeCheckboxes(
                                                'proc_fee'
                                            )}
                                        />
                                    }
                                    label={
                                        received.proc_fee
                                            ? 'Paid'
                                            : 'Payment Pending'
                                    }
                                />
                            </FormGroup>
                        </Box>
                        <Box sx={{ pointerEvents: 'none' }}>
                            <TextField
                                sx={{ marginTop: 3, marginRight: 4 }}
                                label='Gross Total Pending'
                                type='text'
                                value={moneyField.format(
                                    sumOfGrossTotal(false)
                                )}
                            />
                            <TextField
                                sx={{ marginTop: 3 }}
                                label='Gross Total Received'
                                type='text'
                                value={moneyField.format(sumOfGrossTotal(true))}
                            />
                            <TextField
                                sx={{ marginTop: 3, marginRight: 4 }}
                                label='Case Value Pending'
                                type='text'
                                value={moneyField.format(sumOfAllPendingCase())}
                            />{' '}
                            <TextField
                                sx={{ marginTop: 3 }}
                                label='Case Value Received'
                                type='text'
                                value={moneyField.format(
                                    sumOfAllReceivedCase()
                                )}
                            />
                        </Box>
                    </Fragment>
                )}
                {type && (
                    <Box sx={wrappStyles}>
                        <DateField
                            placeholder='Product Expiry Date'
                            {...register('expiry_date', { required: true })}
                            onChange={e => setValue('expiry_date', e)}
                            selected={expiry_date}
                            error={errors.expiry_date}
                        />
                    </Box>
                )}
                <TextField
                    sx={{ marginTop: 3 }}
                    fullWidth
                    label='Notes'
                    type='text'
                    multiline
                    placeholder='Add text'
                    rows={4}
                    maxRows={6}
                    {...register('message')}
                />
                {type && (
                    <Box sx={{ marginTop: 3 }}>
                        <Button type='submit' variant='contained'>
                            Submit
                        </Button>
                        <Button
                            sx={{ marginLeft: 1 }}
                            variant='outlined'
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </Box>
                )}
            </form>
            <AddNewProvider
                newProviderIsOpen={newProviderIsOpen}
                setNewProviderIsOpen={setNewProviderIsOpen}
                newProvider={newProvider}
                onChangeNewProvider={onChangeNewProvider}
            />
            <AddNewLender
                newLenderIsOpen={newLenderIsOpen}
                setNewLenderIsOpen={setNewLenderIsOpen}
                newLender={newLender}
                onChangeNewLender={onChangeNewLender}
            />
        </Modal>
    );
};

export default AddProduct;
