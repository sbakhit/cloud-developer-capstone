import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TweetModel } from '../models/TweetModel';

const XAWS = AWSXRay.captureAWS(AWS)

export class TweetService {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly tweetsTable = process.env.TWEETS_TABLE,
    private readonly tweetIdIndex = process.env.TWEET_INDEX,
    private readonly bucketName = process.env.TWEET_S3_BUCKET
  ) { }

  async createTweet(tweet: TweetModel): Promise<TweetModel> {
    await this.docClient.put({
      TableName: this.tweetsTable,
      Item: tweet
    }).promise()

    return tweet
  }

  async getTweets(userId: string): Promise<TweetModel[]> {
    const result = await this.docClient.query({
      TableName: this.tweetsTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()

    return result.Items as TweetModel[]
  }

  async getTweet(tweetId: string): Promise<TweetModel> {
    const result = await this.docClient.query({
      TableName: this.tweetsTable,
      IndexName: this.tweetIdIndex,
      KeyConditionExpression: 'tweetId = :tweetId',
      ExpressionAttributeValues: {
        ':tweetId': tweetId
      }
    }).promise()

    return result.Items[0] as TweetModel
  }

  async updateTweetAttachmentUrl(tweet: TweetModel) {
    await this.docClient.update({
      TableName: this.tweetsTable,
      Key: {
        userId: tweet.userId,
        createdAt: tweet.createdAt
      },
      UpdateExpression: 'SET attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': `https://${this.bucketName}.s3.amazonaws.com/${tweet.tweetId}`
      }
    }).promise()
  }

  async deleteTweet(tweet: TweetModel) {
    await this.docClient.delete({
      TableName: this.tweetsTable,
      Key: {
        userId: tweet.userId,
        createdAt: tweet.createdAt
      }
    }).promise()
  }
}

export class TweetAttachmentService {
  constructor(
    private readonly s3 = new XAWS.S3({
      signatureVersion: 'v4'
    }),
    private readonly bucketName = process.env.TWEET_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
  ) { }

  getUploadUrl(tweetId: string): string {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: tweetId,
      Expires: this.urlExpiration
    })
  }
}
