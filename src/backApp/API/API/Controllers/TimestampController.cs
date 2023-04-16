﻿using API.Models.HelpModels;
using API.Services.Devices;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimestampController : Controller
    {
        private readonly IDevicesService devService;

        public TimestampController(IDevicesService serv)
        {
            devService = serv;
        }

        //PROSUMER

        [HttpGet("LastWeeksConsumptionAndProduction")]
        public async Task<IActionResult> LastWeeksConsumptionAndProduction(string id)
        {
            try
            {
                return Ok(new
                {
                    consumption = await devService.GroupedConProdForAPeriodForProsumer(id, 0, -7, 24),
                    production = await devService.GroupedConProdForAPeriodForProsumer(id, 1, -7, 24)
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
                    consumption = await devService.GroupedConProdForAPeriodForProsumer(id, 0, -30, 24 * 7),
                    production = await devService.GroupedConProdForAPeriodForProsumer(id, 1, -30, 24 * 7)
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
                    consumption = await devService.GroupedConProdForAPeriodForProsumer(id, 0, -365, 24 * 30),
                    production = await devService.GroupedConProdForAPeriodForProsumer(id, 1, -365, 24 * 30)
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("NextDaysConsumptionAndProduction")]
        public async Task<IActionResult> NextDaysConsumptionAndProduction(string id)
        {
            try
            {
                return Ok(new
                {
                    consumption = (await devService.GroupedConProdForAPeriodForProsumer(id, 0, 1, 2))["predictions"],
                    production = (await devService.GroupedConProdForAPeriodForProsumer(id, 1, 1, 2))["predictions"]
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpGet("Next3DaysConsumptionAndProduction")]
        public async Task<IActionResult> Next3DaysConsumptionAndProduction(string id)
        {
            try
            {
                return Ok(new
                {
                    consumption = (await devService.GroupedConProdForAPeriodForProsumer(id, 0, 3, 6))["predictions"],
                    production = (await devService.GroupedConProdForAPeriodForProsumer(id, 1, 3, 6))["predictions"]
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
                    consumption = (await devService.GroupedConProdForAPeriodForProsumer(id, 0, 7, 12))["predictions"],
                    production = (await devService.GroupedConProdForAPeriodForProsumer(id, 1, 7, 12))["predictions"]
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //ALL PROSUMERS


        [HttpGet("LastWeeksConsumptionAndProductionTimestamps")]
        public async Task<IActionResult> LastWeeksConsumptionAndProductionTimestamps()
        {
            try
            {
                return Ok(new
                {
                    consumption = await devService.ConProdForAPeriodTimestamps(0, -7, 24),
                    production = await devService.ConProdForAPeriodTimestamps(1, -7, 24),
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
                    consumption = await devService.ConProdForAPeriodTimestamps(0, -30, 24 * 7),
                    production = await devService.ConProdForAPeriodTimestamps(1, -30, 24 * 7),
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
                    consumption = await devService.ConProdForAPeriodTimestamps(0, -365, 24 * 30),
                    production = await devService.ConProdForAPeriodTimestamps(1, -365, 24 * 30),
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
                    consumption = (await devService.ConProdForAPeriodTimestamps(0, 1, 2))["predictions"],
                    production = (await devService.ConProdForAPeriodTimestamps(1, 1, 2))["predictions"],
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("Next3DaysConsumptionAndProductionTimestamps")]
        public async Task<IActionResult> Next3DaysConsumptionAndProductionTimestamps()
        {
            try
            {
                return Ok(new
                {
                    consumption = (await devService.ConProdForAPeriodTimestamps(0, 3, 6))["predictions"],
                    production = (await devService.ConProdForAPeriodTimestamps(1, 3, 6))["predictions"],
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
                    consumption = (await devService.ConProdForAPeriodTimestamps(0, 7, 24))["predictions"],
                    production = (await devService.ConProdForAPeriodTimestamps(1, 7, 24))["predictions"],
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //DEVICES

        [HttpGet("ProductionConsumptionForLastWeekForDevice")]
        public async Task<IActionResult> ProductionConsumptionForLastWeekForDevice(string idDevice)
        {

            try
            {

                var prodConsDevice = (await devService.GroupedTimestampsForDevice(idDevice, -7, 24));
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

        [HttpGet("ProductionConsumptionForLastMonthForDevice")]
        public async Task<IActionResult> ProductionConsumptionForLastMonthForDevice(string idDevice)
        {

            try
            {
                var prodConsDevice = (await devService.GroupedTimestampsForDevice(idDevice, -30, 24 * 7));
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

        [HttpGet("ProductionConsumptionForLastYearForDevice")]
        public async Task<IActionResult> ProductionConsumptionForLastYearForDevice(string idDevice)
        {

            try
            {
                var prodConsDevice = (await devService.GroupedTimestampsForDevice(idDevice, -365, 24 * 30));
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

        [HttpGet("PredictionForDevice")]
        public async Task<IActionResult> PredictionForDevice(string idDevice)
        {

            try
            {
                return Ok(new
                {
                    nextDay = (await devService.GroupedTimestampsForDevice(idDevice, 1, 2))["predictions"],
                    next3Days = (await devService.GroupedTimestampsForDevice(idDevice, 3, 6))["predictions"],
                    nextWeek = (await devService.GroupedTimestampsForDevice(idDevice, 7, 24))["predictions"]

                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
