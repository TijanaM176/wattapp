namespace API.Models.Users
{
    public class DsoEdit
    {

        public string? FirstName { get; set; } = null;

        public string? LastName { get; set; } = null;
        public long? Salary { get; set; }
        public long? RoleId { get; set; } 
        public string? RegionId { get; set; } = null;
        public string? Email { get; set; } = null;
      
    }
}
