export class SendPhoto
{
    UserId! : string
    imageFile! : File

    constructor( id : string, file : File) {
        this.UserId = id
        this.imageFile = file;
    }
}