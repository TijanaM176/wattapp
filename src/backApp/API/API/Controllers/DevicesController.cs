using API.Models.Devices;
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

        [HttpGet("GetAllDevicesForProsumer")]
        public async Task<IActionResult> GetAllDevicesForProsumer(string id)
        {
            try
            {
                return Ok(new
                {
                    consumers = await devService.GetDevicesByCategory(id, "Consumer"),
                    producers = await devService.GetDevicesByCategory(id, "Producer"),
                    storage = await devService.GetDevicesByCategory(id, "Storage")
                });

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("ConsumptionAndProductionByProsumer")]
        public async Task<IActionResult> ConsumptionAndProductionByProsumer(string id)
        {
            try
            {
                return Ok(new
                {
                    consumption = (await devService.CurrentConsumptionForProsumer(id)).ToString(),
                    production = (await devService.CurrentProductionForProsumer(id)).ToString()
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("LastWeeksConsumptionAndProduction")]
        public async Task<IActionResult> LastWeeksConsumptionAndProduction(string id)
        {
            try
            {
                return Ok(new
                {
                    consumption = await devService.ConsumptionForLastWeekForProsumer(id),
                    production = await devService.ProductionForLastWeekForProsumer(id)
                }) ;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
