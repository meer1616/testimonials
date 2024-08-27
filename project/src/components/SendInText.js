import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import {
    Button, Flex, FormControl, FormErrorMessage, FormLabel, Image, Input,
    Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, Textarea, useDisclosure, VStack
} from '@chakra-ui/react';
import { getCurrentUser } from "../services/getcurrentuser";
import { FaStar } from "react-icons/fa";

const schema = yup.object().shape({
    name: yup.string().required('name is required'),
    // email: yup.string().required('Header title is required'),
    testimonial: yup.string().required('Testimonial is required'),
    imageFile: yup.mixed().required('Image file is required').test('fileType', 'Only images are allowed', value => value && value[0] && value[0].type.includes('image')),
});

const SendInText = ({ state }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate();
    console.log("process.env.REACT_APP_CREATE_TESTIMONIAL", process.env.REACT_APP_BASE_URL);
    const { spaceId } = useParams();
    const [loading, setLoading] = useState(false);
    const [starArr, setStarArr] = useState([false, false, false, false, false]);
    const [useremail, setUseremail] = useState("")
    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            navigate("/login")
        }
        console.log("currentUser", currentUser.idToken.payload.email);
        setUseremail(currentUser.idToken.payload.email)
    }, [])

    // console.log("params", params);
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
                    let rating = 0;
                    for (let i = 0; i < starArr.length; i++) {
                        if (starArr[i] === true) {
                            rating = i + 1;
                        }
                    }
                    const userData = {
                        id: uuidv4(),
                        spaceId,
                        submitedByUserId: curUser.idToken.payload.sub,
                        name: data.name,
                        email: curUser.idToken.payload.email,
                        testimonial: data.testimonial,
                        rating,
                        imageFile: imageURL
                    };
                    console.log("userData", userData);
                    await axios.post(`${process.env.REACT_APP_BASE_URL}/testimonials`, userData, {
                        headers: {
                            "Authorization": `Bearer ${curUser.idToken.jwtToken}`
                        }
                    }).then(resp => {
                        console.log("resp", resp.data);
                        if (resp.data.success) {
                            console.log("success");
                            axios.post(`${process.env.REACT_APP_BASE_URL}/publish-email`).then(resp => {
                                console.log("res in publish email", resp.data);

                            }).catch(err => {
                                console.log("err", err);
                            })
                            navigate("/");
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

    const handleClick = (index) => {
        const newStarArr = starArr.map((_, i) => i <= index);
        setStarArr(newStarArr);
    }

    return (
        <>
            <Button w="100%" onClick={onOpen} backgroundColor='black' color="white">Send in text</Button>

            <Modal isOpen={isOpen} onClose={onClose} size="xl" >
                <ModalOverlay />
                <ModalContent >
                    <ModalHeader>Write a text testimonial to</ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: "0 25px 20px 25px" }}>
                        <Image src={state.imageFile} h="20vh"></Image>
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
                        <Flex my="3">
                            {starArr.map((colored, index) => (
                                <FaStar size="25px" key={index} style={{ color: colored ? "yellow" : "grey" }} onClick={() => handleClick(index)} />
                            ))}
                        </Flex >
                        <Controller
                            name="testimonial"
                            control={control}
                            render={({ field }) => (
                                <FormControl isInvalid={errors.testimonial}>
                                    <FormLabel>Testimonial</FormLabel>
                                    <Textarea placeholder="Your testimonial" {...field} />
                                    <FormErrorMessage>{errors.testimonial && errors.testimonial.message}</FormErrorMessage>
                                </FormControl>
                            )}
                        />
                        <VStack spacing={4} align="stretch" mt="2">
                            <Controller
                                name="imageFile"
                                control={control}
                                render={({ field }) => (
                                    <FormControl isInvalid={errors.imageFile}>
                                        <FormLabel >Upload your photo</FormLabel>
                                        <Input border="none" type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                                        <FormErrorMessage>{errors.imageFile && errors.imageFile.message}</FormErrorMessage>
                                    </FormControl>
                                )}
                            />
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <FormControl isInvalid={errors.name}>
                                        <FormLabel>Your Name</FormLabel>
                                        <Input placeholder="John Doe" {...field} />
                                        <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
                                    </FormControl>
                                )}
                            />
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <FormControl isInvalid={errors.email}>
                                        <FormLabel>Your Email</FormLabel>
                                        <Input disabled={true} placeholder={useremail} {...field} />
                                        <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                                    </FormControl>
                                )}
                            />
                            <Button type="submit" colorScheme="blue" size="lg" isLoading={loading}>Send</Button>
                        </VStack>
                    </form>
                </ModalContent>
            </Modal>
        </>
    );
}

export default SendInText;
