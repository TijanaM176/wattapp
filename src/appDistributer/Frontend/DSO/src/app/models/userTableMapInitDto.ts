import { Prosumer } from "./userstable";

export class UserTableMapInitDto
{
    maxCons : number = 0;
    maxProd : number = 0;
    maxDevCount : number = 0;
    minCons : number = 0;
    minProd : number = 0;
    minDevCount : number = 0;
    prosumers! : Prosumer[];
}