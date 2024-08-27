import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import { Button, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, Textarea, useDisclosure, VStack } from '@chakra-ui/react';
import { getCurrentUser } from "../services/getcurrentuser"
const schema = yup.object().shape({
    spaceName: yup.string().required('Space name is required'),
    headerTitle: yup.string().required('Header title is required'),
    message: yup.string().required('Message is required'),
    imageFile: yup.mixed().required('Image file is required').test('fileType', 'Only images are allowed', value => value && value[0] && value[0].type.includes('image')),
});


const CreatSpacePopup = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    // const [errmessage, setErrmessage] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    // const [currentLogedInUser, setCurrentLogedInUser] = useState(false);



    const onSubmit = async (data) => {
        try {
            const file = data.imageFile[0];
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    setLoading(true);
                    const curUser = await getCurrentUser();
                    console.log("curUser", curUser);
                    const uploadResponse = await axios.post(`${process.env.REACT_APP_BASE_URL}/img-upload`, {
                        body: reader.result
                    }, {
                        headers: {
                            "Authorization": `Bearer ${curUser.idToken.jwtToken}`
                        }
                    });
                    const imageURL = JSON.parse(uploadResponse.data.body).url;
                    console.log("imageURL", imageURL);

                    const userData = { id: uuidv4(), userId: curUser.idToken.payload.sub, spaceName: data.spaceName, headerTitle: data.headerTitle, message: data.message, imageFile: imageURL };
                    console.log("userData", userData);
                    await axios.post(`${process.env.REACT_APP_BASE_URL}/create-space`, userData, {
                        headers: {
                            "Authorization": `Bearer ${curUser.idToken.jwtToken}`
                        }
                    }).then(resp => {
                        console.log("resp", resp.data);
                        if (resp.data.success) {
                            navigate("/createspacesuccess", { state: { space: resp.data.body.data } });
                        }
                    }).catch(err => {
                        console.log(err);
                    }).finally(() => {
                        setLoading(false);
                    })

                } catch (error) {
                    console.error("Error uploading image or saving user data:", error);
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Error processing image file:", error);
        }
    };

    return (
        <>
            <Button onClick={onOpen} colorScheme='blue'>Create a new Space</Button>

            <Modal isOpen={isOpen} onClose={onClose} size="lg" >
                <ModalOverlay />
                <ModalContent >
                    <ModalHeader>Create a new Space</ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "0 25px 20px 25px" }}>
                        <Text color="GrayText" my="2">Dedicated page will be created for collecting testimonials after creating space.</Text>
                        <VStack spacing={4} align="stretch">
                            <Controller
                                name="imageFile"
                                control={control}
                                render={({ field }) => (
                                    <FormControl isInvalid={errors.imageFile}>
                                        <FormLabel >Space Logo</FormLabel>
                                        <Input border="none" type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                                        <FormErrorMessage>{errors.imageFile && errors.imageFile.message}</FormErrorMessage>
                                    </FormControl>
                                )}
                            />
                            <Controller
                                name="spaceName"
                                control={control}
                                render={({ field }) => (
                                    <FormControl isInvalid={errors.spaceName}>
                                        <FormLabel>Space name</FormLabel>
                                        <Input placeholder="Space name" {...field} />
                                        <FormErrorMessage>{errors.spaceName && errors.spaceName.message}</FormErrorMessage>
                                    </FormControl>
                                )}
                            />
                            <Controller
                                name="headerTitle"
                                control={control}
                                render={({ field }) => (
                                    <FormControl isInvalid={errors.headerTitle}>
                                        <FormLabel>Header title</FormLabel>
                                        <Input placeholder="Header title" {...field} />
                                        <FormErrorMessage>{errors.headerTitle && errors.headerTitle.message}</FormErrorMessage>
                                    </FormControl>
                                )}
                            />
                            <Controller
                                name="message"
                                control={control}
                                render={({ field }) => (
                                    <FormControl isInvalid={errors.message}>
                                        <FormLabel>Message</FormLabel>
                                        <Textarea placeholder="Message" {...field} />
                                        <FormErrorMessage>{errors.message && errors.message.message}</FormErrorMessage>
                                    </FormControl>
                                )}
                            />
                            {/* {errmessage && <p style={{ color: "red" }}>{errmessage}</p>} */}
                            <Button type="submit" colorScheme="blue" size="lg" isLoading={loading}>Create space</Button>
                        </VStack>
                    </form>
                </ModalContent>
            </Modal>
        </>
    );
}

export default CreatSpacePopup;
