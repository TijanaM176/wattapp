using Microsoft.AspNetCore.Mvc;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
namespace API.Models.Users
{
    public class ProsumerEdit
    {

        [DefaultValue("")]

        public string FirstName { get; set; }
        [DefaultValue("")]

        public string LastName { get; set; }
        [DefaultValue("")]

        public string Email { get; set; }
        [DefaultValue("")]
        public string Password { get; set; }
    }
}
