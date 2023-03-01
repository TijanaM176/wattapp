using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebApi.Models
{
    public class BookDetail
    {
        [Key]
        public int BookID { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string Naziv { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string Autor { get; set; }

        
        public int Godina { get; set; }
        
    }
}
