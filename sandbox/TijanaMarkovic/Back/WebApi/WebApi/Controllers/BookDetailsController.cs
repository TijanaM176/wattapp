using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.Models;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookDetailsController : ControllerBase
    {
        private readonly BookDetailContext _context;

        public BookDetailsController(BookDetailContext context)
        {
            _context = context;
        }

        // GET: api/BookDetails
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDetail>>> GetBookDetails()
        {
            return await _context.BookDetails.ToListAsync();
        }

        // GET: api/BookDetails/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BookDetail>> GetBookDetail(int id)
        {
            var bookDetail = await _context.BookDetails.FindAsync(id);

            if (bookDetail == null)
            {
                return NotFound();
            }

            return bookDetail;
        }

        // PUT: api/BookDetails/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBookDetail(int id, BookDetail bookDetail)
        {
            if (id != bookDetail.BookID)
            {
                return BadRequest();
            }

            _context.Entry(bookDetail).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookDetailExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/BookDetails
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<BookDetail>> PostBookDetail(BookDetail bookDetail)
        {
            _context.BookDetails.Add(bookDetail);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBookDetail", new { id = bookDetail.BookID }, bookDetail);
        }

        // DELETE: api/BookDetails/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookDetail(int id)
        {
            var bookDetail = await _context.BookDetails.FindAsync(id);
            if (bookDetail == null)
            {
                return NotFound();
            }

            _context.BookDetails.Remove(bookDetail);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookDetailExists(int id)
        {
            return _context.BookDetails.Any(e => e.BookID == id);
        }
    }
}
