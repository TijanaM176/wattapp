using API.Models.HelpModels;
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
        private readonly IProsumerService prosumerService;

        public DsoController(IDsoService dsoService, IProsumerService prosumerService)
        {
            this.dsoService = dsoService;
            this.prosumerService = prosumerService;
        }

        [HttpGet("GetDsoById")]
        public async Task<ActionResult<Dso>> GetDsoWorkerById(string id)
        {
            Dso worker;
            try
            {
                worker = await dsoService.GetDsoWorkerById(id);

           
                    return Ok(new
                    {
                        Id = worker.Id,
                        FirstName = worker.FirstName,
                        LastName = worker.LastName,
                        UserName = worker.Username,
                        Email = worker.Email,
                        Salary = worker.Salary,
                        ProsumerCreationDate = worker.DateCreate,
                        RoleId = worker.RoleId,
                        RoleName = dsoService.GetRoleName((long)worker.RoleId).Result,
                        RegionId = worker.RegionId,
                        Image = worker.Image

                    });
             }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);

                }
            }

        [HttpDelete("DeleteDsoWorker")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteDsoWorker(string id)
        {
            if (await dsoService.DeleteDsoWorker(id)) return Ok(new { error = true, message = "Successfuly deleted user" });

            return BadRequest("Could not remove user!");
        }

        [HttpPut("UpdateDsoWorker")]
        [Authorize(Roles = "Admin")]
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
                    var dsoworkers = await dsoService.GetAllDsos();

                    var simplifiedDsoworkers = dsoworkers.Select(d => new
                    {
                        Id = d.Id,
                        FirstName = d.FirstName,
                        LastName = d.LastName,
                        UserName = d.Username,
                        Email = d.Email,
                        Salary = d.Salary,
                        ProsumerCreationDate = d.DateCreate,
                        RoleId = d.RoleId,
                        RoleName = dsoService.GetRoleName(d.RoleId.GetValueOrDefault()).Result,
                        Image = d.Image,
                        
                    }).ToList();
                    return Ok(simplifiedDsoworkers);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);

                }
         }
        [HttpGet("GetDsoWorkerPaging")]
        public async Task<ActionResult<IEnumerable<Dso>>> getProsumersPaging([FromQuery] DsoWorkerParameters dsoWorkersParameters)
        {
            
            try
            {
                var dsoworkers = await dsoService.GetDsoWorkers(dsoWorkersParameters);

                var simplifiedDsoworkers = dsoworkers.Select(d => new
                {
                    Id = d.Id,
                    FirstName = d.FirstName,
                    LastName = d.LastName,
                    UserName = d.Username,
                    Email = d.Email,
                    Salary = d.Salary,
                    ProsumerCreationDate = d.DateCreate,
                    RoleId = d.RoleId,
                    RoleName = dsoService.GetRoleName((long)d.RoleId).Result,
                    Image = d.Image
                }).ToList();
                return Ok(simplifiedDsoworkers);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }
        }
        [HttpGet("GetWorkersByRegionId")]
        public async Task<ActionResult<List<Dso>>> GetWorkersByRegionId(string RegionID)
        {
            try
            {
                var dsoworkers = await dsoService.GetDsoWorkersByRegionId(RegionID);

                var simplifiedDsoworkers = dsoworkers.Select(d => new
                {
                    Id = d.Id,
                    FirstName = d.FirstName,
                    LastName = d.LastName,
                    UserName = d.Username,
                    Email = d.Email,
                    Salary = d.Salary,
                    ProsumerCreationDate = d.DateCreate,
                    RoleId = d.RoleId,
                    RoleName = dsoService.GetRoleName((long)d.RoleId).Result,
                    Image = d.Image
                }).ToList();
                return Ok(simplifiedDsoworkers);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);

            }
        }

        [HttpGet("GetWorkersByRoleId")]
        public async Task<ActionResult<List<Dso>>> GetWorkersbyRoleId(long RoleID)
        {
                try
                {
                    var dsoworkers = await dsoService.GetWorkersbyRoleId(RoleID);

                    var simplifiedDsoworkers = dsoworkers.Select(d => new
                    {
                        Id = d.Id,
                        FirstName = d.FirstName,
                        LastName = d.LastName,
                        UserName = d.Username,
                        Email = d.Email,
                        Salary = d.Salary,
                        ProsumerCreationDate = d.DateCreate,
                        RoleId = d.RoleId,
                        RoleName = dsoService.GetRoleName((long)d.RoleId).Result,
                        Image = d.Image
                    }).ToList();
                    return Ok(simplifiedDsoworkers);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);

                }
        }

        [HttpGet("GetWorkerByFilter")]
        public async Task<ActionResult<IEnumerable<Dso>>> GetWorkerByFilter(string RegionID, long RoleID)
        {
         
                try
                {
                    var dsoworkers = await dsoService.GetWorkerByFilter(RegionID, RoleID);

                    var simplifiedDsoworkers = dsoworkers.Select(d => new
                    {
                        Id = d.Id,
                        FirstName = d.FirstName,
                        LastName = d.LastName,
                        UserName = d.Username,
                        Email = d.Email,
                        Salary = d.Salary,
                        ProsumerCreationDate = d.DateCreate,
                        RoleId = d.RoleId,
                        RoleName = dsoService.GetRoleName((long)d.RoleId).Result,
                        Image = d.Image
                    }).ToList();
                    return Ok(simplifiedDsoworkers);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);

                }
            }

        [HttpPut("UpdateProsumerByDso")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProsumerByDso(ChangeProsumerbyDSO change)
        {
            Prosumer prosumer = await dsoService.UpdateProsumerByDso(change);
            if(prosumer == null) return BadRequest("ID Prosumer is not exists in database!");
            try
            {
                return Ok(new
                {
                    UpdateProsumerID = prosumer.Id,
                    FirstName = prosumer.FirstName,
                    LastName = prosumer.LastName,
                    UserName = prosumer.Username,
                    Address = prosumer.Address,
                    Email = prosumer.Email,
                    CityID = prosumer.CityId,
                    CityName = prosumerService.GetCityNameById((long)prosumer.CityId).Result,
                    NeigborhoodID = prosumer.NeigborhoodId,
                    NeigborhoodName = prosumerService.GetNeighborhoodByName(prosumer.NeigborhoodId).Result,
                    Latitude = prosumer.Latitude,
                    Longitude = prosumer.Longitude,
                    RoleId = prosumer.RoleId,
                    RoleName = prosumerService.GetRoleName((long)prosumer.RoleId).Result

                });
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpPost("{UserId}/UploadImage")]
        public async Task<IActionResult> UploadImage([FromBody] SendPhoto sp)
        {
            try
            {
                var result = await dsoService.SaveImage(sp.UserId, sp.base64String);

                if (result.Item2 == true)
                {
                    return Ok(new
                    {
                        message = "Image saved"
                    });
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

        [HttpDelete("{DsoWorkerID}/DeleteImage")]
        public async Task<IActionResult> DeleteImage([FromRoute] String DsoWorkerID)
        {
            try
            {
                var result = await dsoService.DeleteImage(DsoWorkerID);
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
        [HttpPut("ChangePasswordDispatcher")]
        [Authorize(Roles = "Admin,Dispatcher")] 
        public async Task<ActionResult> ChangePasswordDSO(string id, string oldPassword,string newPassword)
        {
            if (!await dsoService.ChangePasswordDSO(id, oldPassword, newPassword)) return BadRequest("Error! Password!");
            return Ok(new
            {
                newPassword = newPassword,
                error = false,
                message = "Dispatcher change password successfully!"
            });
        }

    }
}
