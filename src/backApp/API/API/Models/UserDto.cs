namespace API.Models
{
    public class UserDto
    {
        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public String Password { get; set; } = string.Empty;

        public string Email { get; set; }
        public String getUsername(int numberK)
        {
            Random rnd = new Random();

            String Username = FirstName.ToLower() + LastName.ToLower();


            for (int i = 0; i < numberK; i++)
                Username += rnd.Next(10); // markomarkovic34

            return Username;

        }
    }
}
