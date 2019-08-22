import * as uuid from 'uuid'
import { TweetService } from '../services/TweetService'
import { CreateTweetRequest } from '../requests/CreateTweetRequest'
import { TweetModel } from '../models/TweetModel'

const todoService = new TweetService()

export async function createTweet(userId: string, createTweet: CreateTweetRequest): Promise<TweetModel> {
  return await todoService.createTweet({
    userId,
    tweetId: uuid.v4(),
    createdAt: new Date().toISOString(),
    ...createTweet
  })
}

export async function getTweets(userId: string): Promise<TweetModel[]> {
  return await todoService.getTweets(userId)
}

export async function getTweet(tweetId: string): Promise<TweetModel> {
  return await todoService.getTweet(tweetId)
}

export async function updateTweetAttachmentUrl(tweet: TweetModel) {
  return await todoService.updateTweetAttachmentUrl(tweet)
}

export async function deleteTweet(tweet: TweetModel) {
  return await todoService.deleteTweet(tweet)
}
