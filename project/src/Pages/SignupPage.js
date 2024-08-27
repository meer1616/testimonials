// LoginPage.js
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import userpool from '../config/userpool';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
});

const SignupPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const navigate = useNavigate()
    const onSubmit = data => {
        console.log(data);
        // Handle login logic here
        const { email, password } = data;
        const attributeList = [];
        attributeList.push(
            new CognitoUserAttribute({
                Name: 'email',
                Value: email,
            })
        );
        let username = email;
        userpool.signUp(username, password, attributeList, null, (err, data) => {
            if (err) {
                console.log(err);
                alert("Couldn't sign up");
            } else {
                console.log("signup data", data);
                alert('User Added Successfully');
                axios.post(`${process.env.REACT_APP_BASE_URL}/subscribe-email`, { email: email }).then(resp => {
                    console.log("email resp", resp.data)
                }).catch(err => {
                    console.log("err", err)
                });
                navigate('/confirmemail');
            }
        });
    };

    return (
        <Flex alignItems="center" justifyContent="center" h="100vh">

            <Box boxShadow="xl" style={{ border: "1px solid lightgray", padding: "50px", borderRadius: "25px", maxWidth: '400px', margin: '0 auto' }}>
                <Text fontSize="3xl" textAlign="center" my="5" fontWeight="bold">Testimonial Creation</Text>
                <Text fontSize="x-large" textAlign="center" fontWeight="bolder">Register here</Text>
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

                        <Text>Already have an account? </Text>
                        <Text ml="1" color="blue"><Link to={{ pathname: "/login" }}> Login</Link></Text>
                    </Flex>
                    <br />
                    <Button colorScheme='blue' w="100%" type="submit">Submit</Button>
                </form>
            </Box>
        </Flex>

    );
};

export default SignupPage;
