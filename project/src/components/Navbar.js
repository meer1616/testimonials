import { Box, Button, Flex } from '@chakra-ui/react'
import React from 'react'
import { logout } from '../services/authenticate';
import { Link } from 'react-router-dom';

const Navbar = () => {

    const handleLogOut = () => {
        console.log('logout')
        logout();
    };

    return (
        <Box p="5" background="black" color="white">
            <Flex justifyContent="space-between" alignItems="center" w="95%" m="auto">
                {/* <Text fontSize="2xl"></Text> */}
                <Link to={{ pathname: `/` }} style={{margin:"0 25px",fontSize:"22px"}}>
                Testimonials
                </Link>
                <Flex alignItems="center" justifyContent="center">

                    <Button backgroundColor="white" color="black" onClick={handleLogOut}>
                        Logout
                    </Button>
                </Flex>
            </Flex>

        </Box>
    )
}

export default Navbar