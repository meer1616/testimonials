import { Box, Button, Flex, Image, Text } from '@chakra-ui/react';
import axios from 'axios';
import Navbar from "../components/Navbar"
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaStar, FaHeart } from "react-icons/fa";
import { getCurrentUser } from '../services/getcurrentuser';

const TestimonialOuter = () => {
    const { spaceId } = useParams();
    const [testimonials, setTestimonials] = useState([]);
    const [spaceObj, setSpaceObj] = useState({});
    const [changedIsLove, setChangedIsLove] = useState(false);
    const [activeTab, setActiveTab] = useState("testimonials");
    // const [selectedTestimonial, setSelectedTestimonial] = useState(null);
    const curUser = getCurrentUser();
    const handleGenerateIframe = async (testimonial) => {
        // setSelectedTestimonial(testimonial);

        const iframeCode = `<iframe src="${window.location.origin}/individual/testimonials/${testimonial.id}/${spaceObj.id}" width="30%" height="600px" frameBorder="0"></iframe>`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(iframeCode);
                alert('Iframe code copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy text:', err);
            }
        } else {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = iframeCode;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Iframe code copied to clipboard!');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/get-testimonial-of-space`, { spaceId }, {
                    headers: {
                        "Authorization": `Bearer ${curUser.idToken.jwtToken}`
                    }
                });
                setTestimonials(JSON.parse(response.data.body));
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [changedIsLove]);

    useEffect(() => {
        const fetchSpaceData = async () => {
            try {
                const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/get-space-by-id`, { id: spaceId });
                setSpaceObj(JSON.parse(response.data.body));

            } catch (err) {
                console.log(err);
            }
        };
        fetchSpaceData();
    }, [spaceId]);

    const handleLovedUpdate = (id, isLoved) => {
        axios.post(`${process.env.REACT_APP_BASE_URL}/update-testimonial`, { id, isLoved: !isLoved }, {
            headers: {
                "Authorization": `Bearer ${curUser.idToken.jwtToken}`
            }
        }).then(() => {
            setChangedIsLove(old => !old);
        }).catch(err => {
            console.log(err);
        });
    };

    const filteredTestimonials = testimonials.filter(testimonial =>
        activeTab === 'testimonials' || (activeTab === 'walloflove' && testimonial.isLoved)
    );
    console.log("spaceObj", spaceObj);
    return (
        <>
            <Navbar />
            <Flex justifyContent="center" alignItems="center" h="100vh" flexDir="column">
                <Flex justifyContent="center" alignItems="center" borderBottom="1px solid gray" my="5" p="3">
                    <Image src={spaceObj.imageFile} w="10%" p="5" border="1px solid lightgray" borderRadius="2xl" />
                    <Flex flexDir="column" ml="3">
                        <Text fontWeight="bolder" >{spaceObj.spaceName}</Text>
                        <Flex>
                            Space public URL:
                            <Text color='blue' ml="1">
                                <Link to={{ pathname: `/${spaceObj.id}` }}>{window.location.origin}/{spaceObj.id}</Link>
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex w="95%" m="auto">
                    <Box fontSize="xl">
                        <Box my="4">
                            <Text color="grey">Inbox</Text>
                            <Text
                                mt="1"
                                onClick={() => setActiveTab('testimonials')}
                                backgroundColor={activeTab === 'testimonials' ? "lightgray" : ""}
                                p="2"
                                borderRadius="5px"
                                _hover={{ cursor: "pointer" }}
                            >
                                All Testimonials
                            </Text>
                        </Box>
                        <Box my="4">
                            <Text color="grey">Embeds</Text>
                            <Text
                                mt="1"
                                onClick={() => setActiveTab('walloflove')}
                                backgroundColor={activeTab === 'walloflove' ? "lightgray" : ""}
                                p="2"
                                borderRadius="5px"
                                _hover={{ cursor: "pointer" }}
                            >
                                Wall of Love
                            </Text>
                        </Box>
                    </Box>
                    <Flex w="80%" m="auto" fontSize="large" flexWrap="wrap">
                        {filteredTestimonials.length === 0 ? (
                            <Text fontSize="xl" mt="4">
                                {activeTab === 'walloflove' ? 'No liked testimonials found' : 'No testimonials found'}
                            </Text>
                        ) : (
                            filteredTestimonials.map((testimonial, index) => (
                                <Box key={index} border="1px solid lightgray" mx="5" boxShadow="xl" p="7" borderRadius="xl" w="28%" position="relative">
                                    <Box position="absolute" top="3" right="3" _hover={{ cursor: "pointer" }} onClick={() => handleLovedUpdate(testimonial.id, testimonial.isLoved)}>
                                        {activeTab === 'testimonials' && <FaHeart color={testimonial.isLoved ? "red" : "gray"} />}
                                    </Box>
                                    <Flex my="3">
                                        {Array.from({ length: 5 }, (_, starIndex) => (
                                            <Box key={starIndex} color={starIndex < testimonial.rating ? 'yellow' : 'gray'}>
                                                <FaStar />
                                            </Box>
                                        ))}
                                    </Flex>
                                    <Image borderRadius="5px" m="auto" src={testimonial.imageFile} alt="Image" h="30vh" w="100%" />
                                    <Text my="3" fontWeight="bolder">{testimonial.testimonial}</Text>
                                    <Text my="3" textAlign="left">Name: {testimonial.name}</Text>
                                    <Text textAlign="left">Email: {testimonial.email}</Text>
                                    <Box>
                                        {activeTab === 'walloflove' &&
                                            <Button onClick={() => handleGenerateIframe(testimonial)} backgroundColor="black" color="white" my="3" w="100%">Generate Iframe</Button>
                                        }
                                    </Box>
                                </Box>
                            ))
                        )}
                    </Flex>
                    {/* {selectedTestimonial && (
                    <IndividualTestimonial testimonial={selectedTestimonial} />
                )} */}
                </Flex>
            </Flex>
        </>

    );
};

export default TestimonialOuter;
