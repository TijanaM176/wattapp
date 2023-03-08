namespace API.Models
{
    public class ProsumerDto // odavde kupimo podatke sa registracije i stavljamo ih u bazu Prosumer! 
    {
      

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public String Password { get; set; } = string.Empty;

        public string Email { get; set; }

        public string address { get; set; }
        public string Image { get; set; }

        public String getUsername()
        {
            Random rnd = new Random();

           String Username = FirstName + LastName;

            for (int i = 0; i < 2; i++)
                Username += rnd.Next(10); // markomarkovic34

            return Username;
        }

      
    }
}
