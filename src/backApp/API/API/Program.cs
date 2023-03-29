global using Microsoft.EntityFrameworkCore;
global using API.Models;
using System.Text.Json.Serialization;
using API.Controllers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using API.Services.Auth;
using API.Services.ProsumerService;
using API.Services.DsoService;
using API.Repositories.DsoRepository;
using API.Repositories.ProsumerRepository;
using API.Models.Devices;
using API.Services.Devices;
using Microsoft.Extensions.Options;
using API.Repositories.DeviceRepository;
using API.Repositories.UserRepository;
using API.Models.Users;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//add dbContext
builder.Services.AddDbContext<RegContext>();
builder.Services.Configure<DevicesSettings>(builder.Configuration.GetSection("devicesDatabase"));

// register DevicesContext
builder.Services.AddSingleton(sp =>
{
    var options = sp.GetService<IOptions<DevicesSettings>>();
    return new DevicesContext(options);
});

builder.Services.AddScoped<IDsoRepository, DsoRepository>();
builder.Services.AddScoped<IProsumerRepository, ProsumerRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProsumerService, ProsumerService>();
builder.Services.AddScoped<IDsoService, DsoService>();
//builder.Services.AddScoped<IDeviceRepository, DeviceRepository>();
//builder.Services.AddScoped<IDevicesService, DevicesService>();



builder.Services.AddCors((setup) =>
{
    setup.AddPolicy("default", (options) =>
    {
        options.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin();
    });
}); //this way we are not blocking any ui trying to communicate with api

// sada radi uz ovo getIdRole("korisnik")
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles
);

//autentikacija za jwt
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options => { 
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["AppSettings:Issuer"],
        ValidAudience = builder.Configuration["AppSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:Key"])),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors("default");

app.UseAuthentication();
app.UseAuthorization();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
