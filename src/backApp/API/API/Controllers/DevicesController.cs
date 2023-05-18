using API.Models.Users;
using API.Services.Devices;
using API.Services.ProsumerService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DevicesController : Controller
    {
        private readonly IDevicesService devService;
        private readonly IProsumerService prosumerService;
        public DevicesController(IDevicesService devService, IProsumerService prosumerService)
        {
            this.devService = devService;
            this.prosumerService = prosumerService;
        }

        [HttpGet("GetAllDevicesForProsumer")]
        public async Task<IActionResult> GetAllDevicesForProsumer(string id, string role)
        {
            try
            {
                var devices = await devService.GetDevices(id);
                int realCount = devices[0].Count + devices[1].Count + devices[2].Count;
                if (role != "Prosumer") devices = devices.Select(list => list.Where(d => (bool)d["DsoView"]).ToList()).ToList();
                var consumers = devices[0];
                var producers = devices[1];
                var storage = devices[2];
                var usage = await devService.CurrentConsumptionAndProductionForProsumer(id);

                return Ok(new
                {
                    consumers = consumers,
                    producers = producers,
                    storage = storage,
                    currentConsumption = Math.Round(usage["consumption"], 2),
                    currentProduction = Math.Round(usage["production"], 2),
                    realDeviceCount = realCount,
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
        [Authorize(Roles = "Prosumer")]
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
                var simplifiedProsumers = prosumers.Select(p => new
                {
                    Id = (string)p["id"],
                    Firstname =  (string)p["firstname"],
                    Lastname = (string)p["lastname"],
                    UserName = (string)p["username"],
                    Address = (string)p["address"],
                    CityId = (long)p["cityId"],
                    CityName = prosumerService.GetCityNameById((long)p["cityId"]).Result,
                    NeigborhoodId = (string)p["neighborhoodId"],
                    NeigborhoodName = prosumerService.GetNeighborhoodByName((string)p["neighborhoodId"]).Result,
                    Latitude = (string)p["lat"],
                    Longitude = (string)p["long"],
                    Consumption = (double)p["consumption"],
                    Production = (double)p["production"],
                    DevCount = (int)p["devCount"]
                
            }).ToList();

                return Ok(new
                {
              
                    prosumers = simplifiedProsumers,
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
                var filtered = await devService.UpdatedProsumerFilter(minConsumption, maxConsumption, minProduction, maxProduction, minDeviceCount, maxDeviceCount, cityId, neighborhoodId);

                var simplifiedfilter = filtered.Select(p => new
                {
                    id = p["id"],
                    username = p["username"],
                    firstname = p["firstname"],
                    lastname  = p["lastname"],
                    address = p["address"],
                    cityId = p["cityId"],
                    cityName = prosumerService.GetCityNameById((long)p["cityId"]).Result,
                    neigborhoodNameId = p["neighborhoodId"],
                    neigborhoodName = prosumerService.GetNeighborhoodByName((string)p["neighborhoodId"]).Result,
                    latitude = p["lat"],
                    longitude = p["long"],
                    consumption = p["consumption"],
                    production = p["production"],
                    devCount = p["devCount"]

                }).ToList();
               return Ok(simplifiedfilter);

                //return Ok(filtered);
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

        [HttpPut("ToggleStorageActivity")]
        public async Task<IActionResult> ToggleStorageActivity(string deviceId, string role, int mode)
        {
            try
            {
                return Ok(await devService.ToggleStorageActivity(deviceId, role, mode));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("FilterRanges")]
        public async Task<IActionResult> FilterRanges(string cityId, string neighborhoodId)
        {
            try
            {
                return Ok(await devService.FilterRanges(cityId, neighborhoodId));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}