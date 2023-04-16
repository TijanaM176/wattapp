namespace API.Models.HelpModels
{
    public class SendPhoto
    {
        public String UserId { get; set; }
        public IFormFile imageFile { get; set; }
    }
}
