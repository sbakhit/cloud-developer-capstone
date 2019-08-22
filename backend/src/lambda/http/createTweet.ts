import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { CreateTweetRequest } from '../../requests/CreateTweetRequest'
import { createTweet } from '../../controllers/TweetController'
import { getUserId } from '../utils';

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTweet: CreateTweetRequest = JSON.parse(event.body)
  const item = await createTweet(getUserId(event), newTweet)

  return {
    statusCode: 201,
    body: JSON.stringify({
      item
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
