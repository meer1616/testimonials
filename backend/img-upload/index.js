const AWS = require('aws-sdk');
const S3 = new AWS.S3();

exports.handler = async (event) => {
    const bucketName = 'meer-cloud-projects';
    try {
        console.log("event here", event);
        const base64Image = event.body;

        let image;
        let imageExtension;
        let contentType;

        if (base64Image.startsWith("data:image/png;base64,")) {
            image = base64Image.split("data:image/png;base64,")[1];
            imageExtension = 'png';
            contentType = 'image/png';
        } else if (base64Image.startsWith("data:image/jpeg;base64,")) {
            image = base64Image.split("data:image/jpeg;base64,")[1];
            imageExtension = 'jpg';
            contentType = 'image/jpeg';
        } else {
            throw new Error('Unsupported image format. Only PNG and JPG are supported.');
        }

        const imageBuffer = Buffer.from(image, 'base64');
        const imageKey = `${Date.now()}.${imageExtension}`;

        const params = {
            Bucket: bucketName,
            Key: imageKey,
            Body: imageBuffer,
            ContentType: contentType
        };

        await S3.putObject(params).promise();

        const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageKey}`;

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Image uploaded successfully.', url: imageUrl })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'An error occurred while uploading the image.', error: error.message })
        };
    }
};
