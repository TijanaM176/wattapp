using System.ComponentModel.DataAnnotations;

namespace Studenti.API.Models
{
    public class Student
    {
        [Key]
        public Guid ID { get; set; }
        public string Ime { get; set; }
        public string Prezime { get; set; }

        public string Indeks { get; set; }

        public string Pol { get; set; }

         
    }
}
