import { useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';

const ProductsCell = ({ products }) => {
    const [expandedProducts, setExpandedProducts] = useState(false);

    if (!products.length) return 'N/A';

    const productList = products.map(product => (
        <Box key={product.id} className="product">
            <Chip label={product.product?.name || 'Mortgage'} />
        </Box>
    ));

    if (products.length > 3) {
        return (
            <>
                {productList.slice(0, expandedProducts ? products.length : 3)}
                <Button variant="text" onClick={() => setExpandedProducts(state => !state)}>
                    {expandedProducts ? <ArrowUpwardIcon /> : <AddIcon />}
                    {expandedProducts ? 'Collapse' : 'Show more'}
                </Button>
            </>
        );
    }
    return productList;
};

export default ProductsCell;
