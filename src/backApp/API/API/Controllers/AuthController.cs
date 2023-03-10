using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration.UserSecrets;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System;
using System.Security.Cryptography.Xml;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
using System.Data;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using System.Security.Claims;
using System.IdentityModel.Tokens;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using API.Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
      
        private readonly AuthService authService;

        public AuthController(AuthService serv)
        {
            authService = serv;
        }

        
        [HttpPost("register")]
        public async Task<ActionResult<Prosumer>> Register(ProsumerDto request)
        {
            authService.CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt); // vracamo dve vrednosti!

            Prosumer prosumer = new Prosumer(); // pravimo novog prosumer-a

            
            Guid id = Guid.NewGuid(); // proizvodimo novi id 
            string username = authService.CheckUserName(request);

            if (authService.IsValidEmail(request.Email))
            {
                prosumer.Id = id.ToString();
                prosumer.FirstName = request.FirstName;
                prosumer.LastName = request.LastName;
                prosumer.Username = username; // proveri validnost username 
                prosumer.Email = request.Email; // validnost email-a
                prosumer.Address = request.address;
                prosumer.Image = request.Image;
                prosumer.Token = null; // to je trenutno posle ide komunikacija
                prosumer.RoleId = 3; // -------  vratiIDRole("korisnik"); kada ga hardkodujem ne vraca gresku wtf?Morao sam ovako, izmeni sledeci put-------
                //prosumer.Role = vratiIDRole("korisnik");// ---ne radi fun ne znam zasto?
                prosumer.HashPassword = passwordHash;
                prosumer.SaltPassword = passwordSalt;
                prosumer.RegionId = "trenutno"; // ovo je trenutno dok se ne napravi Dso, Pa cemo da vracamo iz dso-a
                prosumer.NeigborhoodId = "trenutno"; // ovo isto vazi kao i za RegionId
                prosumer.DateCreate = DateTime.Now.ToString("MM/dd/yyyy");

                authService.InsertProsumer(prosumer);
                return Ok(prosumer);
            }
            else
            {
                return BadRequest("Email nije validan!");
            }
            }

        [HttpPost("prosumerLogin")]
        public async Task<ActionResult<string>> ProsumerLogin(UserLogin request)
        {
            Prosumer prosumer = authService.GetProsumer(request.UsernameOrEmail);  //ako postoji, uzmi prosumera iz baze

            if (prosumer == null)
                return BadRequest("This username/email does not exist.");

            if (!authService.VerifyPassword(request.Password, prosumer.SaltPassword, prosumer.HashPassword))    //provera sifre
                return BadRequest("Wrong password.");

            string token = authService.CreateToken(prosumer);
            authService.SaveToken(prosumer, token);
            return Ok(token);
            
        }

        [HttpGet("UsersProsumer")]
        public async Task<ActionResult<List<Prosumer>>> ListRegisterProsumer()
        {
            return Ok(authService.GetAllProsumers());
        }

      
    }
}
