export class Post {
    public id?: number
    public content: string
    public authorId: number
    public createdAt?: Date
    public updatedAt?: Date
    
    public constructor(content: string, authorId: number) {
        this.content = content
        this.authorId = authorId
    }
}