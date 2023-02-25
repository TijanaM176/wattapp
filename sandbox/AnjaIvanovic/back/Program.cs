using back.Data;
using back.Models;
using back.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//sqlite connection
builder.Services.AddDbContext<GamesDbContext>(options =>
options.UseSqlite(builder.Configuration.GetConnectionString("GamesConnectionString")));

//mongodb connection
builder.Services.Configure<booksDbSettings>(
    builder.Configuration.GetSection("booksDatabase"));

builder.Services.AddSingleton<BooksService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
