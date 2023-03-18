using API.Models.Paging;
using API.Repositories;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProsumerController : Controller
    {
      

            //private readonly IAuthService authService;
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
    }
}
