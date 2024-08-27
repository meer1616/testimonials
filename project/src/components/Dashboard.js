import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/getcurrentuser';
import axios from 'axios';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const curUser = await getCurrentUser();
            console.log("curUser", curUser);
            console.log("REACT_APP_BASE_URL", process.env.REACT_APP_BASE_URL)
            console.log("curUser?.idToken?.payload?.sub", curUser?.idToken?.payload?.sub)
            axios.post(`${process.env.REACT_APP_BASE_URL}/get-space-of-a-user`, {
                userId: curUser?.idToken?.payload?.sub
            },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${curUser?.idToken?.jwtToken}`
                    }
                }
            ).then(resp => {
                console.log("resp", JSON.parse(resp.data.body));
                setSpaces(JSON.parse(resp.data.body));
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                setLoading(false);
            });
        };

        fetchData();
    }, []);
    if (loading) {
        return <Text textAlign="center" fontSize="xl" mt="3">Loading...</Text>
    }
    return (
        <Box>
            <Box w="80%" m="auto" justifyContent="space-between" alignItems="center">
                <Flex flexWrap="wrap" justifyContent="space-between">
                    {spaces.length ? spaces?.map((space) => {
                        return (
                            <Box key={space.id} border="1px solid lightgray" borderRadius="xl" p="20px" boxShadow="xl" m="20px" width="calc(33.333% - 40px)">

                                <Link to={{ pathname: `/testimonials/${space.id}` }} key={space.id} width="calc(33.333% - 40px)">
                                    <Flex flexDirection="column" alignItems="center">
                                        <Image border="1px solid lightgray" borderRadius="xl" src={space.imageFile} w="25vw" h="25vh" alt="Image" />
                                        <Text mt="10px" fontSize="xl" fontWeight="bolder"> {space.spaceName}</Text>
                                    </Flex>
                                    {/* <Link to={{ pathname: `/${space.id}` }} state={space}>http://localhost:3000/{space.id}</Link> */}
                                </Link>
                            </Box>
                        )
                    }) : <Text textAlign="center" fontSize="xl" mt="3">No space found</Text>}
                </Flex>
            </Box>
        </Box>
    );
};

export default Dashboard;
