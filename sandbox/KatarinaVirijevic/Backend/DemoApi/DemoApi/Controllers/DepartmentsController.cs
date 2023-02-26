using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DemoApi.Data;

namespace DemoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentsController : Controller
    {
        private readonly DepartmentsContext _context;

        public DepartmentsController(DepartmentsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDepartments()
        {
            return Ok(await _context.Departments.ToListAsync());
        }

        [HttpGet("{name}")]
        public async Task<IActionResult> GetDepartment(string name)
        {
            var dep = await _context.Departments.FirstOrDefaultAsync(x => x.Name == name);
            if (dep is null)
            {
                return BadRequest("Department not found.");
            }
            return Ok(dep);
        }
    }
}
