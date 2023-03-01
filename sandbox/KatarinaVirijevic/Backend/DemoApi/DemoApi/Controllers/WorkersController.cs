using DemoApi.Data;
using DemoApi.Models;
using DemoApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DemoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkersController : ControllerBase
    {
        private readonly WorkersService _services;

        public WorkersController(WorkersService services)
        {
            _services = services;
        }

        [HttpGet]
        public async Task<List<Worker>> Get() =>
            await _services.Get();

        [HttpGet("{id}")]
        public async Task<ActionResult<Worker>> GetAWorker(string id)
        {
            var searced = await _services.Get(id);
            if (searced is null)
            {
                return BadRequest("Employee not found");
            }
            return Ok(searced);
        }

        [HttpPost]
        public async Task<ActionResult<string>> AddWorker([FromBody] newWorker addWorker)
        {
            Worker toAdd = new Worker();
            toAdd.Name = addWorker.Name;
            toAdd.Age = addWorker.Age;
            toAdd.Department = addWorker.Department;

            await _services.Create(toAdd);
            return Ok(new
            {
                error = false,
                message = "Employee Successfully Added!"
            });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<string>> UpdateWorker(string id, [FromBody] newWorker updateWorker)
        {
            Worker toUpdate = new Worker();
            toUpdate.Id = id;
            toUpdate.Name = updateWorker.Name;
            toUpdate.Age = updateWorker.Age;
            toUpdate.Department = updateWorker.Department;

            await _services.Update(id, toUpdate);
            return Ok(new
            {
                error = false,
                message = "Employee Successfully Updated!"
            });
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<string>> DeleteWorker(string id)
        {
            var toDelete = await _services.Get(id);
            if(toDelete is null)
            {
                return BadRequest(new
                {
                    error = true,
                    message = "Employee Not Found!"
                });
            }
            await _services.Remove(id);
            return Ok(new
            {
                error = false,
                message = "Employee Successfully Deleted!"
            });
        }
    }
}
