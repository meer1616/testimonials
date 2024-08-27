const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = 'testimonial';

exports.handler = async (event) => {
    const { id, isLoved } = event;

    if (!id || typeof isLoved !== 'boolean') {
        return {
            statusCode: 400,
            success: false,
            body: { message: 'id and isLoved (boolean) are required fields' },
        };
    }

    const params = {
        TableName: tableName,
        Key: {
            id: id
        },
        UpdateExpression: 'set isLoved = :isLoved',
        ExpressionAttributeValues: {
            ':isLoved': isLoved
        },
        ReturnValues: 'ALL_NEW'
    };

    try {
        const result = await dynamoDb.update(params).promise();
        return {
            statusCode: 200,
            success: true,
            body: {
                message: 'Testimonial updated successfully',
                data: result.Attributes
            }
        };
    } catch (error) {
        console.error("Error updating testimonial", error);
        return {
            statusCode: 500,
            body: { message: 'An error occurred while updating testimonial' }
        };
    }
};
