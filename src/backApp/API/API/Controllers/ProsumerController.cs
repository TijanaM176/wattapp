using API.Models.HelpModels;
using API.Models.Paging;
using API.Models.Users;
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

        public ProsumerController(IProsumerService prosumerService)
        {
                this.prosumerService = prosumerService;
        }

        [HttpGet("GetProsumersPaging")]
        public async Task<ActionResult<IEnumerable<Prosumer>>> getProsumersPaging([FromQuery] ProsumerParameters prosumerParameters)
        {
            return await prosumerService.GetProsumers(prosumerParameters);
        }
        
        [HttpGet("GetAllProsumers")]
        public async Task<IActionResult> ListRegisterProsumer()
        {
            return Ok(await prosumerService.GetAllProsumers());
        }

        [HttpGet("getProsumerByID")]
        public async Task<IActionResult> getProsumerByID(string id)
        {
            var prosumer = prosumerService.GetProsumerById(id);
            if (prosumer == null)
                return BadRequest("Prosumer with id " + id + " is not found");

            return Ok(await prosumer);
        }

        [HttpDelete("DeleteProsumer")]
        [Authorize(Roles = "Dso")]
        public async Task<ActionResult> DeleteProsumer(string id)
        {
            if (await prosumerService.DeleteProsumer(id)) return Ok(new
            {
                error = false,
                message = "Successfully deleted user!"
            }); 

            return BadRequest("Could not remove user!");
        }

        [HttpPut("UpdateProsumer")]
        [Authorize(Roles = "Dso")]
        public async Task<ActionResult> EditProsumer(string id, ProsumerEdit newValues)
        {
            if (!await prosumerService.EditProsumer(id, newValues)) return BadRequest("User could not be updated!");
            return Ok(new
            {
                error= false,
                message = "User updated successfully!"
            });
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
            if (await prosumerService.SetCoordinates(prosumerCoords)) return Ok(new { message ="Coordinates are set!" });

            return BadRequest("Prosumer not found!");
        }

        [HttpPost("{UserID}/UploadImage")]
        public async Task<IActionResult> UploadImage([FromRoute][FromForm] SendPhoto sp)
        {
            try
            {
                var result = await prosumerService.SaveImage(sp.UserId, sp.imageFile);

                if (result.Item2 == true)
                {
                    return Ok("Image is save");
                }
                else
                {
                    return BadRequest("ERROR!");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("{ProsumerId}/DeleteImage")]
        public async Task<IActionResult> DeleteImage([FromRoute]String ProsumerId)
        {
            try
            {
                var result = await prosumerService.DeleteImage(ProsumerId);
                if (result)
                {
                    return Ok();
                }
                else
                {
                    return BadRequest("Image not found for consumer.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
  
    }
}
