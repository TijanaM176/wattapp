namespace API.Models
{
    public class Role
    { // admin , dso, korisnik [Authorization = "admin"] // sve vidi...
        public int Id { get; set; }
        public String NameRole { get; set; }
    }
}
