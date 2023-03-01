using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Studenti.API.Data;
using Studenti.API.Models;
using System.ComponentModel.DataAnnotations;

namespace Studenti.API.Controllers
{

    [Route("api/[controller]")] // api/student
    public class StudentController : Controller
    {
        private readonly StudentDbContext _context;
        public StudentController(StudentDbContext context)
        {
            _context = context;
        }

        
        [HttpGet] //get metoda za sve studente
        public async Task<IActionResult> dajMiSveStudente()
        {
            var studenti = await _context.dajSveStudente.ToListAsync();
            return Ok(studenti); // moze i toList();
        }
        [HttpGet] //get metoda za studenta sa id 
        [Route("{id:guid}")]
        [ActionName("dajMiSveStudenteSaID")]
        public async Task<IActionResult> dajMiSveStudenteSaID([FromRoute] Guid id)
        {

            var student = await _context.dajSveStudente.FirstOrDefaultAsync(x => x.ID == id);

            if(student == null)
            {

                return BadRequest("Nema studenta sa takvim id!");
            }
            return Ok(student);
        }

        [HttpDelete]
        [Route("{id:guid}")]
        public async Task<IActionResult> ObrisiStudenta([FromRoute] Guid id)
        {
            var Obrisistudent = await _context.dajSveStudente.FirstOrDefaultAsync(x => x.ID == id);
            if(Obrisistudent != null)
            {
                _context.Remove(Obrisistudent);
                await _context.SaveChangesAsync();
                return Ok(Obrisistudent);
            }


            return NotFound("Student nije obrisan!");
        }
        //post metod
        [HttpPost]
        public async Task<IActionResult> dodajStudenta([FromBody] Student student)
        {
            
            student.ID = Guid.NewGuid();
            await _context.dajSveStudente.AddAsync(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(dajMiSveStudenteSaID),new { id = student.ID }, student);
        }
        /* public IActionResult Index()
         {
             return View();
         }*/
    }
}
