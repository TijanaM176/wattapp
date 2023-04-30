using API.Services.Devices;
using API.Services.ProsumerService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DevicesController : Controller
    {
        private readonly IDevicesService devService;

        public DevicesController(IDevicesService devService)
        {
            this.devService = devService;
        }

        [HttpGet("GetAllDevicesForProsumer")]
        public async Task<IActionResult> GetAllDevicesForProsumer(string id, string role)
        {
            try
            {
                return Ok(new
                {
                    consumers = await devService.GetDevicesByCategory(id, "Consumer", role),
                    producers = await devService.GetDevicesByCategory(id, "Producer", role),
                    storage = await devService.GetDevicesByCategory(id, "Storage", role)
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetDevice")]
        public async Task<IActionResult> GetDevice(string id)
        {
            try
            {
                return Ok(await devService.GetDevice(id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("RegisterDevice")]
        public async Task<IActionResult> RegisterDevice(string prosumerId, string modelId, string name, bool dsoView, bool dsoControl)
        {
            try
            {
                await devService.RegisterDevice(prosumerId, modelId, name, dsoView, dsoControl);
                return Ok("Device registered!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteDevice")]
        [Authorize(Roles = "Prosumer")]
        public async Task<IActionResult> DeleteDevice(string idDevice)
        {
            try
            {
                var diBoolean = await devService.DeleteDevice(idDevice);
                return Ok("Deleted device!");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("EditDevice")]
        [Authorize(Roles = "Prosumer")]
        public async Task<IActionResult> EditDevice(string IdDevice, string model, string DeviceName, string IpAddress, bool dsoView, bool dsoControl)
        {
            try
            {
                await devService.EditDevice(IdDevice, model, DeviceName, IpAddress, dsoView, dsoControl);
                return Ok("Device edited successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpGet("AllProsumerInfo")]
        public async Task<IActionResult> AllProsumerInfo()
        {
            try
            {
                return Ok(await devService.AllProsumerInfo());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("UpdatedProsumerFilter")]
        public async Task<IActionResult> UpdatedProsumerFilter(double minConsumption, double maxConsumption,
            double minProduction, double maxProduction, int minDeviceCount, int maxDeviceCount)
        {
            try
            {
                return Ok(await devService.UpdatedProsumerFilter(minConsumption, maxConsumption, minProduction,
                    maxProduction, minDeviceCount, maxDeviceCount));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("UpdatedProsumerFilter2")]
        public async Task<IActionResult> UpdatedProsumerFilter2(string neighborhood, double minConsumption,
            double maxConsumption, double minProduction, double maxProduction, int minDeviceCount,
            int maxDeviceCount)
        {
            try
            {
                return Ok(await devService.UpdatedProsumerFilter2(neighborhood, minConsumption, maxConsumption,
                    minProduction, maxProduction, minDeviceCount, maxDeviceCount));
            }
             catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("ToggleActivity")]
        public async Task<IActionResult> ToggleActivity(string deviceId, string role)
        {
            try
            {
                return Ok(await devService.ToggleActivity(deviceId, role));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}