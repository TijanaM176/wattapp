using System.Text.Json.Serialization;
using API.Models.Devices;

namespace API.Models.Users
{
    public class User
    {
        public string Id { get; set; } = null!;

        public string? FirstName { get; set; }

        public string? LastName { get; set; }

        public string? Username { get; set; }

        public string? Email { get; set; }

        public string? Token { get; set; }
        public DateTime? TokenExpiry { get; set; }

        public long? RoleId { get; set; }

        public byte[]? HashPassword { get; set; }

        public byte[]? SaltPassword { get; set; }

        public string? RegionId { get; set; }

        public string? Image { get; set; }

        public string? DateCreate { get; set; }

        public virtual Region? Region { get; set; }

        public virtual Role? Role { get; set; }

        public RefreshToken? RefreshToken { get; set; }
    }
}
