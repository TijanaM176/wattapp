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
                var roles = await dsoService.GetRoles();
                var simplifiedRoles = roles.Select(r => new { Id = r.Id, RoleName = r.RoleName }).ToList();
                return Ok(simplifiedRoles);
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
                var regions = await dsoService.GetRegions();
                var simplifiedRegions = regions.Select(r => new { Id = r.Id, RegionName = r.RegionName}).ToList();
                return Ok(simplifiedRegions);

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
                var heighborhoods = await prosumerService.GetNeigborhoods();
                var simplifiedheighborhoods = heighborhoods.Select(h => new { Id = h.Id, NeigbName = h.NeigbName, CityId = h.CityId }).ToList();
                return Ok(simplifiedheighborhoods);
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
                var cities = await prosumerService.GetCities();
                var simplifiedcities = cities.Select(c => new { Id = c.Id, CityName = c.Name }).ToList();
                return Ok(simplifiedcities);
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
                var neighCities = await prosumerService.GetNeighborhoodByCityId(id);
                var simplifiedcities = neighCities.Select(c => new { Id = c.Id, NeigbName = c.NeigbName}).ToList();
                return Ok(simplifiedcities);
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
                var categories = await devService.GetCategories();
                var simplifiedcategories = categories.Select(c => new { Id = c.Id, CategoryName = c.Name }).ToList();
                return Ok(simplifiedcategories);
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
                var types = await devService.GetTypesByCategory(categoryId);
                var simplifiedtypes = types.Select(t => new { Id = t.Id, CategoryId = t.CategoryId, Name = t.Name}).ToList();
                return Ok(simplifiedtypes);
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
                var models = await devService.GetModels(typeId);
                var simplifiedmodels = models.Select(m => new { Id = m.Id, Name = m.Name, CategoryId = m.CategoryId, TypeId = m.TypeId, Manufacturer = m.Manufacturer, Wattage = m.Wattage}).ToList();
                return Ok(simplifiedmodels);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetCitiesWithProsumers")]
        public async Task<IActionResult> GetCitiesWithProsumers()
        {
            try
            {
                var cities = await prosumerService.GetCitiesWithProsumers();
                var simplifiedcities = cities.Select(c => new { Id = c.Id, CityName = c.Name }).ToList();
                return Ok(simplifiedcities);
            }
            catch (Exception)
            {
                return BadRequest("No cities found!");
            }

        }

        [HttpGet("GetNeighborhoodsWithProsumersByCityId")]
        public async Task<IActionResult> GetNeighborhoodsWithProsumersByCityId(long id)
        {
            try
            {
                var neighCities = await prosumerService.GetNeighborhoodsWithProsumersByCityId(id);
                var simplifiedcities = neighCities.Select(c => new { Id = c.Id, NeigbName = c.NeigbName }).ToList();
                return Ok(simplifiedcities);
            }
            catch (Exception)
            {
                return BadRequest("No Neighborhoods found!");
            }

        }
    }
}
