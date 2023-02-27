using back.Data;
using back.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace back.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GamesController : Controller
    {
        private readonly GamesDbContext gamesDbContext;
        public GamesController(GamesDbContext gamesDbContext)
        {
            this.gamesDbContext = gamesDbContext;
        }

        [HttpGet]
        public async Task<IActionResult> getAllGames()
        {
            var games = await gamesDbContext.Games.ToListAsync();
            return Ok(games);
        }

        [HttpGet]
        [Route("{id:guid}")]
        [ActionName("getGame")]
        public async Task<IActionResult> getGame([FromRoute] Guid id)
        {
            var game = await gamesDbContext.Games.FirstOrDefaultAsync(x => x.Id == id);
            if (game != null)
                return Ok(game);
            return NotFound("Game not found.");
        }

        [HttpPost]
        public async Task<IActionResult> addGame([FromBody] Game game)
        {
            game.Id = Guid.NewGuid();
            await gamesDbContext.Games.AddAsync(game);
            await gamesDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(getGame), new { id = game.Id }, game);
        }

        [HttpPut]
        [Route("{id:guid}")]
        public async Task<IActionResult> updateGame([FromRoute] Guid id, [FromBody] Game gameUpdate)
        {
            var game = await gamesDbContext.Games.FirstOrDefaultAsync(x => x.Id == id);
            if (game != null)
            {
                game.Developer = gameUpdate.Developer;
                game.Genre = gameUpdate.Genre;
                game.Description = gameUpdate.Description;
                game.Price = gameUpdate.Price;

                await gamesDbContext.SaveChangesAsync();
                return Ok(game);
            }
            return NotFound("Game not found.");
        }

        [HttpDelete]
        [Route("{id:guid}")]
        public async Task<IActionResult> deleteGame([FromRoute] Guid id)
        {
            var game = await gamesDbContext.Games.FirstOrDefaultAsync(x => x.Id == id);
            if (game != null)
            {
                gamesDbContext.Remove(game);
                await gamesDbContext.SaveChangesAsync();
                return Ok(game);
            }
            return NotFound("Game not found.");
        }
    }
}
