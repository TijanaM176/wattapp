using API.Services.Devices;
using API.Services.DsoService;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardDataController : Controller
    {
        private readonly IDsoService dsoService;
        private readonly IDevicesService devService;

        public DashboardDataController(IDsoService dsoService, IDevicesService devicesService)
        {
            this.dsoService = dsoService;
            this.devService = devicesService;
        }

        [HttpGet("CurrentPrice")]
        public async Task<IActionResult> CurrentPrice()
        {
            try
            {
                return Ok(await dsoService.CurrentPrice());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("ProsumerCount")]
        public async Task<IActionResult> ProsumerCount()
        {
            try
            {
                return Ok(new
                {
                    prosumerCount = (await dsoService.ProsumerCount()).ToString()
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
                var usage = await devService.TotalCurrentConsumptionAndProduction();
                return Ok(new
                {
                    totalConsumption = (Math.Round(usage["consumption"], 3)).ToString(),
                    totalProduction = (Math.Round(usage["production"], 3)).ToString(),
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("Top5Consumers")]
        public async Task<IActionResult> Top5Consumers()
        {
            try
            {
                return Ok(await devService.Top5Consumers());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("Top5Producers")]
        public async Task<IActionResult> Top5Producers()
        {
            try
            {
                return Ok(await devService.Top5Producers());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("ConsumerProducerRatio")]
        public async Task<IActionResult> ConsumerProducerRatio()
        {
            try
            {
                return Ok(await devService.ConsumerProducerRatio());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("CityPercentages")]
        public async Task<IActionResult> CityPercentages()
        {
            try
            {
                return Ok(await devService.CityPercentages());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
       
    }
}
