import { Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import CreatSpacePopup from './CreateSpacePopup'

const DashboardHeader = () => {


    return (
        <Box>
            <Flex w="80%" p="6" m="auto" justifyContent="space-between" alignItems="center">
                <Text fontSize="x-large">
                    Spaces
                </Text>
                {/* <Button colorScheme='blue'>Create new Space</Button> */}
                <CreatSpacePopup />
            </Flex>

        </Box>
    )
}

export default DashboardHeader