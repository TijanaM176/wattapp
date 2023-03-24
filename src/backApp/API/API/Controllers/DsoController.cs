using API.Models.Paging;
using API.Models.Users;
using API.Services.DsoService;
using API.Services.ProsumerService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DsoController : Controller
    {
        private readonly IDsoService dsoService;
        private static User user = new User();

        public DsoController(IDsoService dsoService)
        {
            this.dsoService = dsoService;
        }

        [HttpGet("GetDsoById")]
        public async Task<ActionResult<Dso>> GetDsoWorkerById(string id)
        {
            Dso worker;
            try
            {
                worker = await dsoService.GetDsoWorkerById(id);
                return Ok(worker);
            }
            catch (Exception)
            {
                return BadRequest("No DSO Worker with that id!");
            }
        }

        [HttpDelete("DeleteDsoWorker")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteDsoWorker(string id)
        {
            if (await dsoService.DeleteDsoWorker(id)) return Ok(new { error = true, message = "Successfuly deleted user" });

            return BadRequest("Could not remove user!");
        }

        [HttpPut("UpdateDsoWorker")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> EditDsoWorker(string id, DsoEdit newValues)
        {
            if (!await dsoService.EditDsoWorker(id, newValues)) return BadRequest("User could not be updated!");
            return Ok("User updated successfully!");

        }

        [HttpGet("GetAllDsoWorkers")]
        public async Task<ActionResult> GetAllDsoWorkers()
        {
            try
            {
                return Ok(await dsoService.GetAllDsos());
            }
            catch (Exception)
            {
                return BadRequest("No DSO Workers found!");
            }
        }
        [HttpGet("GetDsoWorkerPaging")]
        public async Task<ActionResult<IEnumerable<Dso>>> getProsumersPaging([FromQuery] DsoWorkerParameters dsoWorkersParameters)
        {

            return await dsoService.GetDsoWorkers(dsoWorkersParameters);
           
        }
    }
}
