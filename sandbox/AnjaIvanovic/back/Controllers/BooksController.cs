using back.Models;
using back.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace back.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : Controller
    {
        private readonly BooksService booksService;

        public BooksController(BooksService booksService)
        {
            this.booksService = booksService;
        }


        [HttpGet]
        public async Task<IActionResult> getAllBooks()
        {
            var books = await booksService.GetAllBooksAsync();
            return Ok(books);
        }

        [HttpGet]
        [Route("{id:length(24)}")]
        [ActionName("getBook")]
        public async Task<IActionResult> getBook([FromRoute] string id)
        {
            var book = await booksService.GetBookAsync(id);
            if (book != null)
                return Ok(book);
            return NotFound("Book not found.");
        }

        [HttpPost]
        public async Task<IActionResult> addBook([FromBody] Book book)
        {
            book.Id = ObjectId.GenerateNewId().ToString();
            await booksService.InsertBookAsync(book);

            return CreatedAtAction(nameof(getBook), new { id = book.Id }, book);
        }

        [HttpPut]
        [Route("{id:length(24)}")]
        public async Task<IActionResult> updateBook([FromRoute] string id, [FromBody] Book bookUpdate)
        {
            var book = await booksService.GetBookAsync(id);
            if (book != null)
            {
                bookUpdate.Id = book.Id;
                book = bookUpdate;
                await booksService.UpdateBookAsync(id, book);
                return NoContent();
            }
            return NotFound("Book not found.");

        }

        [HttpDelete]
        [Route("{id:length(24)}")]
        public async Task<IActionResult> deleteBook([FromRoute] string id)
        {
            var book = await booksService.GetBookAsync(id);
            if (book != null)
            {
                await booksService.RemoveBookAsync(id);
                return NoContent();
            }
            return NotFound("Book not found.");
        }
    }
}
