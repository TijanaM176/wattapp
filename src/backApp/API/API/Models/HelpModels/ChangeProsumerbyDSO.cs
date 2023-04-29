using System.ComponentModel.DataAnnotations;

namespace API.Models.HelpModels
{
    public class ChangeProsumerbyDSO
    {
        [Required(AllowEmptyStrings = true)]
        public string Id { get; set; } = null!;
    
        public string? FirstName { get; set; }
     
        public string? LastName { get; set; }

        public string? Username { get; set; }

        public string? Address { get; set; }

        public string? Email { get; set; }
   
        public string? CityName { get; set; }
  
        public string? NeigborhoodName { get; set; }

        public string? Latitude { get; set; }

        public string? Longitude { get; set; }
  
    }
}
