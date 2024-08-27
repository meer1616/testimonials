// AdminDashboard.js
import React from 'react';
import { Box, Button, Input } from '@chakra-ui/react';

const AdminDashboard = () => {
    const handleGenerateIframe = (testimonialId) => {
        const iframeCode = `<iframe src="${window.location.origin}/testimonial/${testimonialId}" width="100%" height="600px" frameBorder="0"></iframe>`;
        navigator.clipboard.writeText(iframeCode);
        alert('Iframe code copied to clipboard!');
    };

    return (
        <Box>
            {/* Replace with your logic for displaying testimonials and selecting one */}
            <Button onClick={() => handleGenerateIframe('selected-testimonial-id')}>Generate Iframe</Button>
            <Input value={`<iframe src="${window.location.origin}/testimonial/selected-testimonial-id" width="100%" height="600px" frameBorder="0"></iframe>`} readOnly />
        </Box>
    );
};

export default AdminDashboard;
