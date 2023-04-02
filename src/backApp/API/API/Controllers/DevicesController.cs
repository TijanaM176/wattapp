using API.Models.Devices;
using API.Models.Users;
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
                    consumption = await devService.GroupedConProdForAPeriodForProsumer(id, 0, -7, 12),
                    production = await devService.GroupedConProdForAPeriodForProsumer(id, 1, -7, 12)
                }) ;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("NextWeeksConsumptionAndProduction")]
        public async Task<IActionResult> NextWeeksConsumptionAndProduction(string id)
        {
            try
            {
                return Ok(new
                {
                    consumption = await devService.GroupedConProdForAPeriodForProsumer(id, 0, 7, 12),
                    production = await devService.GroupedConProdForAPeriodForProsumer(id, 1, 7, 12)
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("LastWeeksConsumptionForAllProsumers")]
        public async Task<IActionResult> LastWeeksConsumptionForAllProsumers()
        {
            try
            {
                return Ok(new
                {
                    consumptionForAllProsumersWeeks = await devService.ConsumptionForLastWeekForAllProsumers()

                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("LastWeeksProductionForAllProsumers")]
        public async Task<IActionResult> LastWeeksProductionForAllProsumers()
        {
            try
            {
                return Ok(new
                {
                    productionForAllProsumersWeeks = await devService.ProductionForLastWeekForAllProsumers()

                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("ProsumerFilter")]
        public async Task<IActionResult> ProsumerFilter(double minConsumption, double maxConsumption, double minProduction, double maxProduction, int minDeviceCount, int maxDeviceCount)
        {
            try
            {
                return Ok(await devService.ProsumerFilter(minConsumption, maxConsumption, minProduction, maxProduction, minDeviceCount, maxDeviceCount));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("ProsumerFilter2")]
        public async Task<IActionResult> ProsumerFilter2(string neighbourhood, double minConsumption, double maxConsumption, double minProduction, double maxProduction, int minDeviceCount, int maxDeviceCount)
        {
            try
            {
                return Ok(await devService.ProsumerFilter2(neighbourhood, minConsumption, maxConsumption, minProduction, maxProduction, minDeviceCount, maxDeviceCount));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("GetDeviceInfoById")]
        public async Task<IActionResult> GetDeviceInfoById(string id)
        {
            DeviceInfo DI = await devService.GetDeviceInfoById(id);
            try
            {
                return Ok(new
                {
                    ipAddress = DI.IpAddress,
                    Name = DI.Name,
                    CategoryID = DI.CategoryId,
                    TypeID = DI.TypeId,
                    Manufacturer = DI.Manufacturer,
                    Wattage = DI.Wattage

                });
            }
            catch(Exception ex)
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
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("LastWeeksConsumptionAndProductionTimestamps")]
        public async Task<IActionResult> LastWeeksConsumptionAndProductionTimestamps()
        {
            try
            {
                return Ok(new
                {
                    consumption = await devService.ConProdForAPeriodTimestamps(0, -7, 12),
                    production = await devService.ConProdForAPeriodTimestamps(1, -7, 12),
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("NextDaysConsumptionAndProductionTimestamps")]
        public async Task<IActionResult> NextDaysConsumptionAndProductionTimestamps()
        {
            try
            {
                return Ok(new
                {
                    consumption = await devService.ConProdForAPeriodTimestamps(0, 1, 1),
                    production = await devService.ConProdForAPeriodTimestamps(1, 1, 1),
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("ConsumptionAndProductionForNext3DaysTimestamps")]
        public async Task<IActionResult> ConsumptionAndProductionForNext3DaysTimestamps()
        {
            try
            {
                return Ok(new
                {
                    consumption = await devService.ConProdForAPeriodTimestamps(0, 3, 6),
                    production = await devService.ConProdForAPeriodTimestamps(1, 3, 6),
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("NextWeeksConsumptionAndProductionTimestamps")]
        public async Task<IActionResult> NextWeeksConsumptionAndProductionTimestamps()
        {
            try
            {
                return Ok(new
                {
                    consumption = await devService.ConProdForAPeriodTimestamps(0, 7, 12),
                    production = await devService.ConProdForAPeriodTimestamps(1, 7, 12),
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
