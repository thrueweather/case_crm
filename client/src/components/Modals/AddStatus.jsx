import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import swal from 'sweetalert';
import DatePicker from 'react-datepicker';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import CancelIcon from '@mui/icons-material/Cancel';
import Tooltip from '@mui/material/Tooltip';

import Modal from 'components/Modals/index';
import AddProduct from './AddProduct';
import SelectField from '../SelectField';

import { fetchStatuses } from 'store/reducers/deals/index';
import { setStatus } from 'api/repository';

const alertWrappStyles = {
    marginTop: 3,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
};

const AddStatus = ({ deal, isOpen, handleClose, refetchDeal }) => {
    const dispatch = useDispatch();
    const { loadingStatuses, statuses } = useSelector(state => state.deals);

    const [activeStatus, setActiveStatus] = useState(null);
    const [optionalStatus, setOptionalStatus] = useState('');
    const [productIsOpen, setProductIsOpen] = useState(false);
    const [productType, setProductType] = useState(null);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (isOpen) dispatch(fetchStatuses());
    }, [isOpen, dispatch]);

    const onSelectStatus = e => setActiveStatus(e.target.value);

    const onAddStatus = async () => {
        try {
            await setStatus(deal.id, {
                status_id: statuses.find(i => i.name === activeStatus).id,
                ...(optionalStatus && { value: optionalStatus }),
                message: notes,
            });
            await swal(
                'Great!',
                'The Status has been successfully added!',
                'success'
            );
            refetchDeal();
            handleClose();
            setActiveStatus(null);
            setOptionalStatus(null);
        } catch (error) {
            swal('Error!', error.message, 'error');
        }
    };

    const handleAddProduct = variables => {
        setOptionalStatus(variables);
    };

    const onOpenProductForm = type => {
        setProductType(type);
        setProductIsOpen(true);
    };

    const onRemoveProduct = () => setOptionalStatus('');

    const ProductButton = ({ type }) => {
        if (productType && optionalStatus) return null;

        return (
            <Button
                sx={{ marginTop: 3 }}
                variant='contained'
                onClick={() => onOpenProductForm(type)}
            >
                <AddIcon />
                product
            </Button>
        );
    };

    const showFieldByStatus = status => {
        switch (status) {
            case 'Check my file':
            case 'Client proceeding':
            case 'Contact attempt 1':
            case 'Contact attempt 2':
            case 'Contact attempt 3':
            case 'Contact made - Factfind complete':
            case 'Invalid number':
            case 'No sale - Declined to pay fee':
            case 'No sale - Went AWOL':
            case 'No sale - Went elsewhere':
            case 'Documents recieved':
            case 'Sale made - Mortgage completed':
            case 'Sale made - Mortgage offered':
                return null;
            case 'Application Fee Made':
                return (
                    <TextField
                        sx={{ marginTop: 3 }}
                        label={status}
                        value={optionalStatus}
                        onChange={e => setOptionalStatus(e.target.value)}
                        type='number'
                        placeholder={status}
                        fullWidth
                    />
                );
            case 'FCR - Unable to help':
            case 'No sale - No further contact requested':
            case 'Referred to 3rd Party':
                return (
                    <TextField
                        sx={{ marginTop: 3 }}
                        label='Enter a reason'
                        type='text'
                        value={optionalStatus}
                        onChange={e => setOptionalStatus(e.target.value)}
                        placeholder={status}
                        fullWidth
                    />
                );
            case 'FCR - Client not ready (schedule)':
            case 'Contact made - Awaiting docs':
            case 'Contact made -Meeting scheduled':
                return (
                    <div style={{ marginTop: 22 }}>
                        <DatePicker
                            selected={optionalStatus}
                            onChange={setOptionalStatus}
                            placeholderText='Enter a date'
                        />
                    </div>
                );
            case 'Insurance application submitted':
                return <ProductButton type='insurance' />;
            case 'Mortgage application submitted':
            case 'Sale made - Full application':
            case 'Sale made - AIP approved':
                return (
                    <SelectField
                        fullWidth
                        sx={{ marginTop: 3 }}
                        label={'Product'}
                        onChange={e => handleAddProduct(e.target.value)}
                        options={deal.products
                            .filter(
                                product => product.product_type === 'mortgage'
                            )
                            .map(({ id, lender }) => ({
                                value: id,
                                label: lender.name,
                            }))}
                    />
                );
            default:
                return null;
        }
    };

    const product = productType && optionalStatus?.productType && (
        <Box sx={alertWrappStyles}>
            <Alert sx={{ width: '90%' }} severity='success'>
                Product by {optionalStatus.productType} type has been added!
            </Alert>
            <Tooltip title='Remove product' placement='top'>
                <CancelIcon
                    sx={{ cursor: 'pointer', color: '#f34242' }}
                    onClick={onRemoveProduct}
                />
            </Tooltip>
        </Box>
    );

    const isValid =
        (!activeStatus && !showFieldByStatus(activeStatus)) ||
        (activeStatus && showFieldByStatus(activeStatus) && !optionalStatus);

    const hasMortgageProduct = !!deal.products.find(
        i => i.product_type === 'mortgage'
    );

    const statusList = statuses.filter(status => {
        if (!hasMortgageProduct) {
            return (
                status.name !== 'Sale made - AIP approved' &&
                status.name !== 'Sale made - Full application'
            );
        }
        return status;
    });

    return (
        <Modal isOpen={isOpen} handleClose={handleClose} title='Add Status'>
            {!loadingStatuses ? (
                <SelectField
                    fullWidth
                    sx={{ marginTop: 3 }}
                    label={'Status Type'}
                    value={activeStatus}
                    onChange={onSelectStatus}
                    options={statusList.map(({ name }) => ({
                        value: name,
                        label: name,
                    }))}
                />
            ) : (
                'Loading...'
            )}
            {showFieldByStatus(activeStatus)}
            {product}
            <TextField
                sx={{ marginTop: 3 }}
                fullWidth
                label='Notes'
                type='text'
                value={notes}
                onChange={e => setNotes(e.target.value)}
                multiline
                placeholder='Add text'
                rows={4}
                maxRows={6}
            />
            {!loadingStatuses && (
                <Box sx={{ marginTop: 3 }}>
                    <Button
                        type='submit'
                        variant='contained'
                        color='success'
                        onClick={onAddStatus}
                        disabled={isValid}
                    >
                        Save
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
            <AddProduct
                productType={productType}
                isOpen={productIsOpen}
                handleClose={() => setProductIsOpen(false)}
                handleAddProduct={handleAddProduct}
                deal={deal}
                styles={{ width: 600 }}
            />
        </Modal>
    );
};

export default AddStatus;
