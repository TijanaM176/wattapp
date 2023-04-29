using API.Models.HelpModels;
using API.Models.Paging;
using API.Models.Users;
using API.Services.ProsumerService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Xml.Linq;

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


            try
            {
                var prosumers = await prosumerService.GetProsumers(prosumerParameters);

                var simplifiedProsumers = prosumers.Select(p => new
                {
                    Id = p.Id,
                    FirstName = p.FirstName,
                    LastName = p.LastName,
                    UserName = p.Username,
                    Email = p.Email,
                    Address = p.Address,
                    Latitude = p.Latitude,
                    Longitude = p.Longitude,
                    ProsumerCreationDate = p.DateCreate,
                    RegionId = p.RegionId,
                    CityId = p.CityId,
                    NeigborhoodId = p.NeigborhoodId,
                    Image = p.Image,
                    RoleId = p.RoleId
                }).ToList();
                return Ok(simplifiedProsumers);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }
        }

        [HttpGet("GetAllProsumers")]
        public async Task<IActionResult> ListRegisterProsumer()
        {

            try
            {
                var prosumers = await prosumerService.GetAllProsumers();

                var simplifiedProsumers = prosumers.Select(p => new
                {
                    Id = p.Id,
                    FirstName = p.FirstName,
                    LastName = p.LastName,
                    UserName = p.Username,
                    Email = p.Email,
                    Address = p.Address,
                    Latitude = p.Latitude,
                    Longitude = p.Longitude,
                    ProsumerCreationDate = p.DateCreate,
                    RegionId = p.RegionId,
                    CityId = p.CityId,
                    NeigborhoodId = p.NeigborhoodId,
                    Image = p.Image,
                    RoleId = p.RoleId
                }).ToList();
                return Ok(simplifiedProsumers);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }
        }

        [HttpGet("getProsumerByID")]
        public async Task<IActionResult> getProsumerByID(string id)
        {
            var prosumer = await prosumerService.GetProsumerById(id);
            if (prosumer == null)
                return BadRequest("Prosumer with id " + id + " is not found");

            else
            {
                return Ok(new
                {
                    Id = prosumer.Id,
                    FirstName = prosumer.FirstName,
                    LastName = prosumer.LastName,
                    Username = prosumer.Username,
                    Email = prosumer.Email,
                    Address = prosumer.Address,
                    Latitude = prosumer.Latitude,
                    Longitude = prosumer.Longitude,
                    ProsumerCreationDate = prosumer.DateCreate,
                    RegionId = prosumer.RegionId,
                    CityId = prosumer.CityId,
                    NeigborhoodId = prosumer.NeigborhoodId,
                    Image = prosumer.Image,
                    RoleId = prosumer.RoleId
                });
            }
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
        [Authorize(Roles = "Prosumer")] // trebalo bi roles da bude Prosumer ne Dso
        public async Task<ActionResult> EditProsumer(string id,[FromBody] ProsumerEdit newValues)
        {
            if (!await prosumerService.EditProsumer(id, newValues)) return BadRequest("Error! Password!");
            return Ok(new
            {
                newPassword = newValues.newPassword,
                error= false,
                message = "User change password successfully!"
            });
        }

        [HttpGet("GetProsumersByNeighborhoodId")]
        public async Task<IActionResult> GetProsumersByNeighborhoodId(string id)
        {
          
            try
            {
                var prosumers = await prosumerService.GetProsumersByNeighborhoodId(id);

                var simplifiedProsumers = prosumers.Select(p => new
                {
                    Id = p.Id,
                    FirstName = p.FirstName,
                    LastName = p.LastName,
                    UserName = p.Username,
                    Email = p.Email,
                    Address = p.Address,
                    Latitude = p.Latitude,
                    Longitude = p.Longitude,
                    ProsumerCreationDate = p.DateCreate,
                    RegionId = p.RegionId,
                    CityId = p.CityId,
                    NeigborhoodId = p.NeigborhoodId,
                    Image = p.Image,
                    RoleId = p.RoleId
                }).ToList();
                return Ok(simplifiedProsumers);
            }
            catch (Exception)
            {
                return BadRequest("No users found in that neighborhood!");
            }
        }

        [HttpPut("SetCoordinates")]
        public async Task<ActionResult> SetCoordinates([FromForm] SaveCoordsDto prosumerCoords)
        {
            if (await prosumerService.SetCoordinates(prosumerCoords)) return Ok(new { message ="Coordinates are set!" });

            return BadRequest("Prosumer not found!");
        }

        [HttpPost("{UserId}/UploadImage")]
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
                return StatusCode(500, HttpContext.Request.RouteValues["UserId"].ToString() +"  is not found");
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
