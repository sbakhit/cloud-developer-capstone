import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUploadUrl } from '../../controllers/TweetAttachmentController'
import { getTweet, updateTweetAttachmentUrl } from '../../controllers/TweetController';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const tweetId = event.pathParameters.tweetId
  const item = await getTweet(tweetId)
  if (!item) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Tweet with tweetId ${tweetId} is not found'
      })
    }
  }

  const uploadUrl = getUploadUrl(tweetId)
  await updateTweetAttachmentUrl(item)

  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
