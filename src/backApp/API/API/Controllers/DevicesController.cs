using API.Models.Devices;
using API.Models.HelpModels;
using API.Models.Users;
using API.Services.Devices;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.Intrinsics.X86;

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
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("LastMonthsConsumptionAndProduction")]
        public async Task<IActionResult> LastMonthsConsumptionAndProduction(string id)
        {
            try
            {
                return Ok(new
                {
                    consumption = await devService.LastMonthsGroupedConProdByWeekForProsumer(id, 0),
                    production = await devService.LastMonthsGroupedConProdByWeekForProsumer(id, 1)
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("LastYearsConsumptionAndProduction")]
        public async Task<IActionResult> LastYearsConsumptionAndProduction(string id)
        {
            try
            {
                return Ok(new
                {
                    consumption = await devService.LastYearsGroupedConProdByMonthForProsumer(id, 0),
                    production = await devService.LastYearsGroupedConProdByMonthForProsumer(id, 1)
                });
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

        //izbaciti
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

        //i ovo
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
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }
        [HttpGet("ProductionConsumptionForLastWeekForDevice")]
        public async Task<IActionResult> ProductionConsumptionForLastWeekForDevice(string idDevice)
        {

            try
            {

                var prodConsDevice = (await devService.ProductionConsumptionForLastWeekForDevice(idDevice));
                EnumCategory.DeviceCatergory deviceCategory = await devService.getDeviceCategoryEnum(idDevice);

                if (deviceCategory == EnumCategory.DeviceCatergory.Consumer)
                {

                    return Ok(new
                    {
                        consumption = prodConsDevice

                    });
                }
                else
                {
                    return Ok(new
                    {
                        production = prodConsDevice

                    });

                }


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

        [HttpGet("LastMonthsConsumptionAndProductionTimestamps")]
        public async Task<IActionResult> LastMonthsConsumptionAndProductionTimestamps()
        {
            try
            {
                return Ok(new
                {
                    consumption = await devService.ConProdByWeekTimestamps(0),
                    production = await devService.ConProdByWeekTimestamps(1),
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("LastYearsConsumptionAndProductionTimestamps")]
        public async Task<IActionResult> LastYearsConsumptionAndProductionTimestamps()
        {
            try
            {
                return Ok(new
                {
                    consumption = await devService.ConProdByMonthTimestamps(0),
                    production = await devService.ConProdByMonthTimestamps(1),
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

        [HttpGet("DsoSidebarInfo")]
        public async Task<IActionResult> DsoSidebarInfo()
        {
            try
            {
                return Ok(new
                {
                    totalConsumption = (Math.Round(await devService.TotalCurrentConsumption(),3)).ToString(),
                    totalProduction = (Math.Round(await devService.TotalCurrentProduction(),3)).ToString(),
                });
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
        public async Task<IActionResult> UpdatedProsumerFilter(double minConsumption, double maxConsumption, double minProduction, double maxProduction, int minDeviceCount, int maxDeviceCount)
        {
            try
            {
                return Ok(await devService.UpdatedProsumerFilter(minConsumption, maxConsumption, minProduction, maxProduction, minDeviceCount, maxDeviceCount));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("UpdatedProsumerFilter2")]
        public async Task<IActionResult> UpdatedProsumerFilter2(string neighborhood, double minConsumption, double maxConsumption, double minProduction, double maxProduction, int minDeviceCount, int maxDeviceCount)
        {
            try
            {
                return Ok(await devService.UpdatedProsumerFilter2(neighborhood, minConsumption, maxConsumption, minProduction, maxProduction, minDeviceCount, maxDeviceCount));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("RegisterDevice")]
        public async Task<IActionResult> RegisterDevice(string prosumerId, string modelId, string name)
        {
            try
            {
                await devService.RegisterDevice(prosumerId, modelId, name);
                return Ok("Device registered!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetCategories")]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                return Ok(await devService.GetCategories());
            }catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetTypesByCategory")]
        public async Task<IActionResult> GetTypesByCategory(long categoryId)
        {
            try
            {
                return Ok(await devService.GetTypesByCategory(categoryId));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetModels")]
        public async Task<IActionResult> GetModels(long typeId)
        {
            try
            {
                return Ok(await devService.GetModels(typeId));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
