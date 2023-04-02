﻿using API.Models.Devices;
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
                    consumption = await devService.ConsumptionForAPeriodForProsumer(id, -7),
                    production = await devService.ProductionForAPeriodForProsumer(id, -7)
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
                    consumption = await devService.ConsumptionForAPeriodForProsumer(id, 7),
                    production = await devService.ProductionForAPeriodForProsumer(id, 7)                    
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

    }
}
