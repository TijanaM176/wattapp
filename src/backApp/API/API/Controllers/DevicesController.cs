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
                var devices = await devService.GetDevices(id, role);
                var consumers = devices[0];
                var producers = devices[1];
                var storage = devices[2];
                return Ok(new
                {
                    consumers = consumers,
                    producers = producers,
                    storage = storage,
                    currentConsumption = await devService.CurrentUsageForProsumer(consumers.Select(x => (double)x["CurrentUsage"]).ToList()),
                    currentProduction = await devService.CurrentUsageForProsumer(producers.Select(x => (double)x["CurrentUsage"]).ToList()),
                    deviceCount = consumers.Count + producers.Count + storage.Count
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
                var prosumers = await devService.AllProsumerInfo();
                return Ok(new 
                { 
                    prosumers = prosumers,
                    minCons = (double)prosumers.Min(x => x["consumption"]) * 1000,
                    maxCons = (double)prosumers.Max(x => x["consumption"]) * 1000,
                    minProd = (double)prosumers.Min(x => x["production"]) * 1000,
                    maxProd = (double)prosumers.Max(x => x["production"]) * 1000,
                    minDevCount = (int)prosumers.Min(x => x["devCount"]),
                    maxDevCount = (int)prosumers.Max(x => x["devCount"])
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("UpdatedProsumerFilter")]
        public async Task<IActionResult> UpdatedProsumerFilter(double minConsumption, double maxConsumption, double minProduction, double maxProduction, int minDeviceCount, int maxDeviceCount, string cityId, string neighborhoodId)
        {
            try
            {
                return Ok(await devService.UpdatedProsumerFilter(minConsumption, maxConsumption, minProduction, maxProduction, minDeviceCount, maxDeviceCount, cityId, neighborhoodId));
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