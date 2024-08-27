import { Box, Flex, Image, Text } from '@chakra-ui/react';
import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const CreateSpaceSuccess = () => {

    const location = useLocation();

    return (
        <Flex justifyContent="center" alignItems="center" h="100vh">
            <Box border="1px solid lightgray" boxShadow="xl" borderRadius="xl" p="10" fontWeight="normal" fontSize="xl">
                {/* <div style={{ "padding-top": "100.000%", "position": "relative" }}><iframe src="https://gifer.com/embed/4N8" style={{ "position": "absolute", "top": "0", "left": "0" }} frameBorder="0" allowFullScreen></iframe></div> */}
                <Image borderRadius="xl" m="auto" w="45%" src="/success.gif" alt="image" />
                <Text my="3" textAlign="center">
                    Added {location.state.space.spaceName} successfully 🎊

                </Text>
                <Text >Here is the link for your customers:</Text>
                <Text color='blue'><Link to={{ pathname: `/${location.state.space.id}` }} state={location.state.space}> {window.location.origin}/{location.state.space.id}</Link></Text>
            </Box>
        </Flex>
    )
}

export default CreateSpaceSuccess