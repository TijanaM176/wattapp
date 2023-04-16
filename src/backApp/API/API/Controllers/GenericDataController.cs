using API.Services.Devices;
using API.Services.DsoService;
using API.Services.ProsumerService;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenericDataController : Controller
    {
        private readonly IDsoService dsoService;
        private readonly IProsumerService prosumerService;
        private readonly IDevicesService devService;

        public GenericDataController(IDsoService dsoService, IProsumerService prosumerService, IDevicesService devicesService)
        {
            this.dsoService = dsoService;
            this.prosumerService = prosumerService;
            this.devService = devicesService;
        }

        [HttpGet("GetRoles")]
        public async Task<IActionResult> GetRoles()
        {
            try
            {
                return Ok(await dsoService.GetRoles());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetRegions")]
        public async Task<IActionResult> GetRegions()
        {
            try
            {
                return Ok(await dsoService.GetRegions());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetRoleName")]
        public async Task<IActionResult> GetRoleName(long id)
        {
            try
            {
                return Ok(await dsoService.GetRoleName(id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetRegionName")]
        public async Task<IActionResult> GetRegionName(string id)
        {
            try
            {
                return Ok(await dsoService.GetRegionName(id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetAllNeighborhoods")]
        public async Task<IActionResult> GetAllNeighborhoods()
        {
            try
            {
                return Ok(await prosumerService.GetNeigborhoods());
            }
            catch (Exception)
            {
                return BadRequest("No neighborhoods found!");
            }
        }

        [HttpGet("GetCities")]
        public async Task<IActionResult> GetCities()
        {
            try
            {
                return Ok(await prosumerService.GetCities());
            }
            catch (Exception)
            {
                return BadRequest("No cities found!");
            }

        }
        [HttpGet("GetNeighborhoodsByCityId")]
        public async Task<IActionResult> GetNeighborhoodsByCityId(long id)
        {
            try
            {
                return Ok(await prosumerService.GetNeighborhoodByCityId(id));
            }
            catch (Exception)
            {
                return BadRequest("No Neighborhoods found!");
            }

        }

        [HttpGet("GetCityNameById")]
        public async Task<IActionResult> GetCityNameById(long id)
        {
            try
            {
                return Ok(await prosumerService.GetCityNameById(id));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //??
        [HttpGet("GetNeighborhoodByName")]
        public async Task<IActionResult> GetNeighborhoodByName(string id)
        {

            try
            {
                return Ok(await prosumerService.GetNeighborhoodByName(id));
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
            }
            catch (Exception ex)
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
