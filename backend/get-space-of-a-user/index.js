const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const tableName = 'space';
    console.log("event check", event);
    const { userId } = event;
    // Assuming the userId is passed in the path parameters
    const indexName = 'userId-index'; // Replace with the name of your GSI

    const params = {
        TableName: tableName,
        IndexName: indexName, // Use the GSI
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId,
        },
    };

    try {
        const data = await dynamoDb.query(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify(data.Items),
        };
    } catch (error) {
        console.error('Error querying items:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not retrieve items' }),
        };
    }
};
