export class BatteryToggle{
    deviceId : string = ''
    role : string = 'Prosumer'
    mode : number = 0;
    constructor(devId : string, m : number) {
        this.deviceId = devId;
        this.mode = m;
    }
}