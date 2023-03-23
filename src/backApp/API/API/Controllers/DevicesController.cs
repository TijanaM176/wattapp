using API.Services.Devices;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class DevicesController : Controller
    {
        private readonly IDevicesService devService;
        public DevicesController(IDevicesService devService)
        {
            this.devService = devService;
        }

        [HttpGet("proba")]
        public async Task<IActionResult> proba(string id)
        {
            var dev = await devService.proba(id);
            return Ok(dev);
        }
    }
}
