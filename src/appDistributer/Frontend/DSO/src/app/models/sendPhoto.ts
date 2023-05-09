export class SendPhoto
{
    UserId! : string
    base64String! : string

    constructor( id : string, file : string) {
        this.UserId = id
        this.base64String = file;
    }
}