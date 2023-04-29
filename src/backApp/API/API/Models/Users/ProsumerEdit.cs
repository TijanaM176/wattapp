using Microsoft.AspNetCore.Mvc;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
namespace API.Models.Users
{
    public class ProsumerEdit
    {

        [DefaultValue("")]
        public string oldPassword { get; set; }
        [DefaultValue("")]
        public string newPassword { get; set; }
    }
}
