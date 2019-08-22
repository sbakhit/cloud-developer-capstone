import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { deleteTweet, getTweet } from '../../controllers/TweetController'

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

  await deleteTweet(item)
  return {
    statusCode: 202,
    body: ""
  }
})

handler.use(
  cors({
    credentials: true
  })
)
