import json
import boto3
import os

def lambda_handler(event, context):
    sns_client = boto3.client('sns')
 
    # Accessing the environment variable
    sns_arn_prefix = os.environ.get('SNS_ARN_PREFIX')
    if not sns_arn_prefix:
        return {
            'statusCode': 500,
            'body': json.dumps('SNS ARN prefix not set')
        }

    topic_arn = f'{sns_arn_prefix}'

    # The message needs to be send to the email addresses
    message = 'Your testimonial has been submitted successfully and will be reviewed by our team. Thank you for your feedback!'
    subject = 'Testimonial submitted successfully'

    sns_client.publish(
        TopicArn=topic_arn,
        Message=message,
        Subject=subject,
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps('Message sent to email addresses successfully')
    }
