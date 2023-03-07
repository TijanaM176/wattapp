using System.ComponentModel.DataAnnotations;

namespace loginProbaBackend.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
