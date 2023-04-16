using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace API.Models.Users
{
    public class ProsumerDto : UserDto // odavde kupimo podatke sa registracije i stavljamo ih u bazu Prosumer! 
    {
        public string NeigbName { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
      
}
}
