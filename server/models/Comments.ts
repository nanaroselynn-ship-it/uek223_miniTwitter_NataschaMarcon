// Model class representing a Comment entity
export class Comment {
    public id?: number
    public content: string
    public authorId: number
    public postId: number
    public createdAt?: Date
    public updatedAt?: Date

    public constructor(content: string, authorId: number, postId: number) {
        this.content = content
        this.authorId = authorId
        this.postId = postId
    }
}
