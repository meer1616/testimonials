const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = 'space';

exports.handler = async (event) => {

    const { id, userId, spaceName, headerTitle, imageFile, message } = event;

    if (!id || !userId || !spaceName || !headerTitle || !imageFile || !message) {
        return {
            statusCode: 400,
            success: false,
            body: { message: 'All fields are required: id, spaceName, headerTitle, imageFile, message' },
        };
    }

    const params = {
        TableName: tableName,
        Item: {
            id, userId, spaceName, headerTitle, imageFile, message
        }
    };

    try {
        await dynamoDb.put(params).promise();
        return {
            statusCode: 200,
            success: true,
            body: {
                message: 'Space created successfully', data: {
                    id, userId, spaceName, headerTitle, imageFile, message
                }
            }
        };
    } catch (error) {
        console.error("Error creating space", error);
        return {
            statusCode: 500,
            body: { message: 'An error occurred while creating space' }
        };
    }
};
