// LoginPage.js
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { authenticate } from '../services/authenticate';
import { Link, useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
});

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate()
    const onSubmit = data => {
        console.log(data);
        const { email, password } = data;
        authenticate(email, password)
            .then((data) => {
                console.log("data in login", data);
                navigate('/')
            }, (err) => {
                console.log(err);
            })
            .catch(err => console.log(err))
        // Handle login logic here
    };

    return (
        <Flex alignItems="center" justifyContent="center" h="100vh">

            <Box boxShadow="xl" style={{ border: "1px solid lightgray", padding: "50px", borderRadius: "25px", maxWidth: '400px', margin: '0 auto' }}>
                <Text fontSize="3xl" textAlign="center"my="5" fontWeight="bold">Testimonial Creation</Text>
                <Text fontSize="x-large" textAlign="center" fontWeight="bolder">Login</Text>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div style={{ marginTop: "10px" }}>
                        <label>Email</label>
                        <Input type="email" {...register('email')} />
                        {errors.email && <p>{errors.email.message}</p>}
                    </div>
                    <div style={{ marginTop: "10px" }}>
                        <label>Password</label>
                        <Input type="password" {...register('password')} />
                        {errors.password && <p>{errors.password.message}</p>}
                    </div>
                    <Flex
                        mt="4">

                        <Text>Doesn't have an account? </Text>
                        <Text ml="1" color="blue"><Link to={{ pathname: "/signup" }}> Signup</Link></Text>
                    </Flex>
                    <br />
                    <Button colorScheme='blue' w="100%" type="submit">Login</Button>
                </form>
            </Box>
        </Flex>

    );
};

export default LoginPage;
