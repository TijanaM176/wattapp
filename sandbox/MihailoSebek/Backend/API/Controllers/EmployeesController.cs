using API.Data;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController:Controller
{

    private readonly CRUDDbContext _crudDbContext;
    
    public EmployeesController(CRUDDbContext crudDbContext)
    {
        _crudDbContext = crudDbContext;
    }
    [HttpGet]
    public async Task<IActionResult> GetAllEmployees()
    {
        var employees = await _crudDbContext.Employees.ToListAsync();

        return Ok(employees);
    }

    [HttpPost]
    public async Task<IActionResult> AddEmployee([FromBody]Employee employeeRequest)
    {
        employeeRequest.Id=Guid.NewGuid();

        await _crudDbContext.Employees.AddAsync((employeeRequest));
        await _crudDbContext.SaveChangesAsync();
        return Ok(employeeRequest);
    }

    [HttpGet]
    [Route("{id:Guid}")]
    public async Task<IActionResult> GetEmployee([FromRoute]Guid id)
    {
        var employee= await _crudDbContext.Employees.FirstOrDefaultAsync((x => x.Id == id));

        if (employee == null)
            return NotFound();

        return Ok(employee);
    }
    
}