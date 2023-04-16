namespace API.Models.Users
{
    public class DsoWorkerDto : UserDto
    {
        public long Salary { get; set; }
        public IFormFile? imageFile { get; set; }

    }
}
