/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Center, Flex, Image, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import SendInText from './SendInText';
import axios from "axios"
import Navbar from './Navbar';
import { getCurrentUser } from '../services/getcurrentuser';
const DynamicComponent = () => {
    const { spaceId } = useParams();
    // const { state } = useLocation();
    // console.log("loaction in dynamic", state);
    const [state, setState] = useState({})
    const curUser = getCurrentUser()
    useEffect(() => {
        const fetchData = async () => {
            // const curUser = await getCurrentUser();
            // console.log("curUser", curUser);
            axios.post(`${process.env.REACT_APP_BASE_URL}/get-space-by-id`, {
                id: spaceId
            }).then(resp => {
                console.log("resp", JSON.parse(resp.data.body));
                setState(JSON.parse(resp.data.body));
            }).catch(err => {
                console.log(err);
            });
        };

        fetchData();


    }, []);
    return (
        <>
            <Navbar />
            <Flex justifyContent="center" alignItems="center" h="90vh">

                <Box border="1px solid lightgray" boxShadow="xl" borderRadius="xl" p="7">
                    <Image border="1px solid lightgray" borderRadius="xl" src={state.imageFile} alt="image" h="25vh" m="auto" />
                    <Text fontSize="xx-large" textAlign="center" my="3">{state.headerTitle}</Text>
                    <Text fontSize="large" textAlign="center" my="2">{state.message}</Text>
                    <Text fontWeight="bolder" mt="5">QUESTIONS
                    </Text>
                    <Text>
                        - Who are you / what are you working on?
                    </Text>
                    <Text>
                        - How has [our product / service] helped you?
                    </Text>
                    <Text>
                        - What is the best thing about [our product / service]
                    </Text>
                    <Center mt="9">
                        <SendInText state={state} />
                        {/* <Button backgroundColor="black" color="white">Send in text</Button> */}
                    </Center>
                </Box>
            </Flex>
        </>
    )
}

export default DynamicComponent