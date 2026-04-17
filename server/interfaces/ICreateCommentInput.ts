// Interface for the data required to create a new comment
export interface ICreateCommentInput {
    content: string
    authorId: number
    postId: number
}
