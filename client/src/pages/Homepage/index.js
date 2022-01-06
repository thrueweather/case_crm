import React from 'react';
import Grid from '@mui/material/Grid';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { fetchStatistic } from 'store/reducers/statistic';
import Loader from 'components/Loader';

const Homepage = () => {
    const { loading, data } = useSelector(state => state.statistic);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchStatistic());
    }, [dispatch]);

    const color = (name, value) => {
        if (name === 'Conversion rate') {
            if (value <= 20) {
                return '#ff0000';
            } else if (value > 20 && value <= 40) {
                return '#FFBF00';
            } else {
                return '#008000';
            }
        }
        return;
    };

    const card = (name, value) => (
        <>
            <CardContent>
                <Typography
                    sx={{ fontSize: 18 }}
                    color='text.secondary'
                    gutterBottom
                >
                    {name}
                </Typography>
                <Typography variant='h3' color={color(name, value)}>
                    {value}
                </Typography>
            </CardContent>
        </>
    );

    if (loading) return <Loader />;

    return (
        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
            >
                {data &&
                    data.map(({ name, value }) => (
                        <Grid item xs={12} sm={4} md={3} key={name}>
                            <Card sx={{ height: 150 }} variant='outlined'>
                                {card(name, value)}
                            </Card>
                        </Grid>
                    ))}
            </Grid>
        </Box>
    );
};

export default Homepage;
