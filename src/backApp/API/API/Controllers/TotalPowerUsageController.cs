using API.Services.Devices;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TotalPowerUsageController : Controller
    {
        private readonly IDevicesService devService;
        public TotalPowerUsageController(IDevicesService serv)
        {
            devService = serv;
        }

        [HttpGet("ConsumptionAndProductionByProsumer")]
        public async Task<IActionResult> ConsumptionAndProductionByProsumer(string id)
        {
            try
            {
                return Ok(new
                {
                    consumption = (Math.Round(await devService.CurrentConsumptionForProsumer(id), 3)).ToString(),
                    production = (Math.Round(await devService.CurrentProductionForProsumer(id), 3)).ToString()
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("ThisMonthTotalConsumptionProductionForProsumer")]
        public async Task<IActionResult> ThisMonthTotalProduction(string prosumerId)
        {
            try
            {
                var all = await devService.ThisMonthTotalConsumptionProductionForProsumer(prosumerId);

                return Ok(new
                {
                    consumption = all.Item1,
                    production = all.Item2

                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("LastWeeksConsumptionProductionForAllProsumers")]
        public async Task<IActionResult> LastWeeksConsumptionForAllProsumers()
        {
            try
            {
                return Ok(new
                {
                    consumption = await devService.ConsumptionForLastWeekForAllProsumers(),
                    production = await devService.ProductionForLastWeekForAllProsumers()

                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("ThisWeekTotalProduction")]
        public async Task<IActionResult> ThisWeekTotalProduction()
        {
            try
            {
                var result = await devService.ThisWeekTotalProduction();

                return Ok(new
                {
                    productionforThisWeek = result.Item1,
                    productionforLastWeek = result.Item2,
                    ratio = result.Item3,
                    thisweek = result.Item4,
                    lastweek = result.Item5

                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("ThisWeekTotalConsumption")]
        public async Task<IActionResult> ThisWeekTotalConsumption()
        {
            try
            {
                var result = await devService.ThisWeekTotalConsumption();

                return Ok(new
                {
                    productionforThisWeek = result.Item1,
                    productionforLastWeek = result.Item2,
                    ratio = result.Item3,
                    thisweek = result.Item4,
                    lastweek = result.Item5

                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("NextWeekTotalPredictedConsumptionProduction")]
        public async Task<IActionResult> NextWeekTotalPredictedProduction()
        {
            try
            {
                return Ok(new
                {
                    consumption = await devService.NextWeekTotalPredictedConsumption(),
                    production = await devService.NextWeekTotalPredictedProduction()
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }        
    }
}
