﻿namespace API.Models
{
    public class ProsumerDto: UserDto // odavde kupimo podatke sa registracije i stavljamo ih u bazu Prosumer! 
    {
        public string address { get; set; }
        public string Image { get; set; }

    }
}