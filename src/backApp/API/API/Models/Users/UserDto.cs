namespace API.Models.Users
{
    public class UserDto
    {
        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;
        public string PasswordAgain { get; set; } = string.Empty;
        public string Email { get; set; }
        public string getUsername(int numberK)
        {
            Random rnd = new Random();

            string Username = FirstName.ToLower() + LastName.ToLower();


            for (int i = 0; i < numberK; i++)
                Username += rnd.Next(10); // markomarkovic34

            return Username;

        }
    }
}
