import json
import boto3
import os

def lambda_handler(event, context):
    sns_client = boto3.client('sns')
    
    # Extract email address from the event payload
    email_address = event.get('email')
    
    # Check if email address is provided
    if not email_address:
        return {
            'statusCode': 400,
            'body': json.dumps('No email address provided')
        }
    
    # extract the SNS ARN prefix from the environment variables
    sns_arn_prefix = os.environ.get('SNS_ARN_PREFIX')

    sns_client.subscribe(
        TopicArn=sns_arn_prefix,
        Protocol='email',
        Endpoint=email_address
    )
    
    # Publish a test message to the SNS topic
    message = 'You are successfully subscribed to the SNS topic!'
    subject = 'Subscription Confirmation'
    
    sns_client.publish(
        TopicArn=sns_arn_prefix,
        Message=message,
        Subject=subject
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps(f'Topic {sns_arn_prefix} created and email subscription added successfully')
    }
