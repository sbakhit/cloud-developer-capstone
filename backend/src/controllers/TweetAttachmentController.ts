import { TweetAttachmentService } from '../services/TweetService'
const todoAttachmentService = new TweetAttachmentService()

export function getUploadUrl(tweetId: string): string {
    return todoAttachmentService.getUploadUrl(tweetId)
}

export async function deleteAttachment(tweetId: string) {
    return await todoAttachmentService.deleteAttachment(tweetId)
}
