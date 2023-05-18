export class SendRefreshToken
{
    refreshToken : string = ''
    username : string = ''
    role : string = ''

    constructor(refresh : string, usern : string, role : string) {
        this.refreshToken = refresh;
        this.username = usern;
        this.role = role;
    }
}