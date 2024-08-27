const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = 'testimonial';

exports.handler = async (event) => {
    const { id, submitedByUserId, spaceId, name, email, testimonial, imageFile, rating } = event;

    if (!id || !submitedByUserId || !spaceId || !name || !email || !testimonial || !imageFile || !rating) {
        return {
            statusCode: 400,
            success: false,
            body: { message: 'All fields are required: id, submitedByUserId, spaceId, name, email, testimonial, imageFile, rating' },
        };
    }

    const createdAt = new Date().toISOString();
    const isLoved = false;

    const params = {
        TableName: tableName,
        Item: {
            id, submitedByUserId, spaceId, name, email, testimonial, imageFile, rating, createdAt, isLoved
        }
    };

    try {
        await dynamoDb.put(params).promise();
        return {
            statusCode: 200,
            success: true,
            body: {
                message: 'Testimonial created successfully',
                data: {
                    id, submitedByUserId, spaceId, name, email, testimonial, imageFile, rating, createdAt, isLoved
                }
            }
        };
    } catch (error) {
        console.error("Error submitting testimonial", error);
        return {
            statusCode: 500,
            body: { message: 'An error occurred while submitting testimonial' }
        };
    }
};
