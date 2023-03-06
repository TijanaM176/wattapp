namespace API.Models
{
    public class User
    {
        //dodaj sliku za user-a
        //automatski se unosi username
        public String Username { get; set; } = string.Empty;

        public String Email { get; set; } = string.Empty;

        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
    }
}
