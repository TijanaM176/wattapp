namespace API.Models.HelpModels
{
    public class SendPhoto
    {
        public String ProsumerId { get; set; }
        public IFormFile imageFile { get; set; }
    }
}
