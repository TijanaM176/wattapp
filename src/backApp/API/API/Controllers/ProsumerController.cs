using API.Models.Paging;
using API.Models.Users;
using API.Repositories;
using API.Services.ProsumerService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProsumerController : Controller
    {
        private readonly IProsumerService prosumerService;
        private static User user = new User();

        public ProsumerController(IProsumerService prosumerService)
        {
                this.prosumerService = prosumerService;
        }

        [HttpGet("GetProsumersPaging")]
        public async Task<ActionResult<IEnumerable<Prosumer>>> getProsumersPaging([FromQuery] ProsumerParameters prosumerParameters)
        {

            return await prosumerService.GetProsumers(prosumerParameters);
        }
        
       // [Authorize(Roles = "WorkerDso")]
        [HttpGet("GetAllProsumers")]
        public async Task<IActionResult> ListRegisterProsumer()
        {
            return Ok(await prosumerService.GetAllProsumers());
        }

        /*
        [HttpGet("GetAllProsumers")]
        public async Task<IActionResult> ListRegisterProsumer()
        {
            try
            {
                return Ok(await prosumerService.GetAllProsumers());
            }
            catch (Exception)
            {
                return BadRequest("No prosumers found!");
            }
        }
        */

        [HttpGet("getProsumerByID")]
        public async Task<IActionResult> getProsumerByID(string id)
        {
            var prosumer = prosumerService.GetProsumerById(id);
            if (prosumer == null)
                return BadRequest("Prosumer with id " + id + " is not found");

            return Ok(await prosumer);
        }

        [HttpDelete("DeleteProsumer")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteProsumer(string id)
        {
            if (await prosumerService.DeleteProsumer(id)) return Ok("Successfully deleted user!");

            return BadRequest("Could not remove user!");
        }

        [HttpPut("UpdateProsumer")]
        [Authorize]
        public async Task<ActionResult> EditProsumer(string id, ProsumerEdit newValues)
        {
            if (!await prosumerService.EditProsumer(id, newValues)) return BadRequest("User could not be updated!");
            return Ok("User updated successfully!");
        }

        [HttpGet("GetAllNeighborhoods")]
        public async Task<IActionResult> GetAllNeighborhoods()
        {
            try
            {
                return Ok(await prosumerService.GetNeigborhoods());
            }
            catch (Exception)
            {
                return BadRequest("No neighborhoods found!");
            }
        }

        [HttpGet("GetProsumersByNeighborhoodId")]
        public async Task<IActionResult> GetProsumersByNeighborhoodId(string id)
        {
            try
            {
                return Ok(await prosumerService.GetProsumersByNeighborhoodId(id));
            }
            catch (Exception)
            {
                return BadRequest("No users found in that neighborhood!");
            }
        }

        [HttpPut("SetCoordinates")]
        public async Task<ActionResult> SetCoordinates(SaveCoordsDto prosumerCoords)
        {
            if (await prosumerService.SetCoordinates(prosumerCoords)) return Ok("Coordinates are set!");

            return BadRequest("No found Prosumer!");

        }

    }
}
