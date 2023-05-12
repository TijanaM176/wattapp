namespace API.Models.Users
{
    public class DsoEdit
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public long Salary { get; set; }
        public long RoleId { get; set; }
        public string RegionId { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string OldPassword { get; set; }
    }
}
