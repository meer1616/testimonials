const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    const { id } = event;

    const params = {
        TableName: 'space',
        Key: {
            id: id
        }
    };

    try {
        const data = await dynamoDb.get(params).promise();
        if (!data.Item) {
            return {
                statusCode: 404,
                body: JSON.stringify({ success:false,message: 'Item not found' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(data.Item)
        };
    } catch (error) {
        console.error('Error fetching item:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Could not fetch item' })
        };
    }
};
