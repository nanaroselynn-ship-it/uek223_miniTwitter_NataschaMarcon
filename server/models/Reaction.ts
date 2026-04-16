export class Reaction {
    public id?: number
    public type: string
    public userId: number
    public postId: number
    
    public constructor(type: string, userId: number, postId: number) {
        this.type = type
        this.userId = userId
        this.postId = postId
    }
}