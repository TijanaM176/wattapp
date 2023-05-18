export class SendRefreshToken
{
    refreshToken : string = ''
    username: string = ''
    role : string = 'Prosumer'

    constructor(refresh : string, usern : string) {
        this.refreshToken = refresh;
        this.username = usern;
    }
}