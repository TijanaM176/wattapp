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
using API.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
      
        private readonly AuthService authService;
        private static User user = new User();

        public AuthController(AuthService serv)
        {
            authService = serv;
        }

        
        [HttpPost("registerProsumer")]
        public async Task<ActionResult<Prosumer>> Register(ProsumerDto request)
        {
            authService.CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt); // vracamo dve vrednosti!

            Prosumer prosumer = new Prosumer(); // pravimo novog prosumer-a

            
            Guid id = Guid.NewGuid(); // proizvodimo novi id 
            string username = authService.CheckUserName(request);

            if (authService.IsValidEmail(request.Email) && authService.checkEmail(request))
            {
                prosumer.Id = id.ToString();
                prosumer.FirstName = request.FirstName;
                prosumer.LastName = request.LastName;
                prosumer.Username = username; // proveri validnost username 
                prosumer.Email = request.Email; // validnost email-a
                prosumer.Address = request.address;
                prosumer.Image = request.Image;
                prosumer.Token = null; // to je trenutno posle ide komunikacija
                prosumer.RoleId = authService.getRole("korisnik").Id; // -------  vratiIDRole("korisnik"); kada ga hardkodujem ne vraca gresku wtf?Morao sam ovako, izmeni sledeci put-------
                //prosumer.Role = vratiIDRole("korisnik");// ---ne radi fun ne znam zasto?
                prosumer.HashPassword = passwordHash;
                prosumer.SaltPassword = passwordSalt;
                prosumer.RegionId = "trenutno"; // ovo je trenutno dok se ne napravi Dso, Pa cemo da vracamo iz dso-a
                prosumer.NeigborhoodId = "trenutno"; // ovo isto vazi kao i za RegionId
                prosumer.DateCreate = DateTime.Now.ToString("MM/dd/yyyy");

                authService.InsertProsumer(prosumer); // sacuvaju se i izmene

                return Ok(prosumer);
            }
            else
            {
                return BadRequest("Email nije validan ili vec postoji takav!");
            }
            }
        [HttpPost("registerDsoWorker")]
        public async Task<ActionResult<Dso>> Register(DsoWorkerDto request)
        {
            authService.CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt); // vracamo dve vrednosti!

            Dso workerDSO = new Dso(); // pravimo novog DSO


            Guid id = Guid.NewGuid(); // proizvodimo novi id 
            string username = authService.CheckUserNameDSO(request);

            if (authService.IsValidEmail(request.Email) && authService.checkEmail(request))
            {
                workerDSO.Id = id.ToString();
                workerDSO.FirstName = request.FirstName;
                workerDSO.LastName = request.LastName;
                workerDSO.Username = username; // proveri validnost username 
                workerDSO.Email = request.Email; // validnost email-a
                workerDSO.Image = request.Image;
                workerDSO.Salary = request.Salary;
                workerDSO.Token = null; // to je trenutno posle ide komunikacija
                workerDSO.RoleId = authService.getRole("Dso").Id;
                workerDSO.HashPassword = passwordHash;
                workerDSO.SaltPassword = passwordSalt;
                workerDSO.RegionId = "trenutno"; // ovo je trenutno dok se ne napravi Dso, Pa cemo da vracamo iz dso-a
                workerDSO.DateCreate = DateTime.Now.ToString("MM/dd/yyyy");

                authService.InsertDSOWorker(workerDSO); // sacuvaju se i izmene

                return Ok(workerDSO);
            }
            else
            {
                return BadRequest("Email nije validan ili vec postoji takav!");
            }
        }

        [HttpPost("prosumerLogin")]
      
        public async Task<ActionResult<string>> ProsumerLogin(UserLogin request) // skratiti i ovo (1)
        {
            Prosumer prosumer = authService.GetProsumer(request.UsernameOrEmail);  //ako postoji, uzmi prosumera iz baze
            

            if (prosumer == null)
                return BadRequest(new
                {
                    error = true,
                    message = "This username/email does not exist."
                });
            
            if (!authService.VerifyPassword(request.Password, prosumer.SaltPassword, prosumer.HashPassword))    //provera sifre
                return BadRequest(new
                {
                    error = true,
                    message = "Wrong password."
                });

            string userToken = authService.CreateToken(prosumer);
            //authService.SaveToken(prosumer, userToken); mislim da je nepotrebno da se cuva u bazi token

            var refreshToken = authService.GenerateRefreshToken();
            //setovanje refresh tokena
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = refreshToken.Expires
            };
            Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);

            user = prosumer;
            user.RefreshToken = refreshToken;
            return Ok(new
            {
                error = false,
                token = userToken,
                refreshToken = refreshToken
            });

        }

        [HttpPost("DSOLogin")]
        public async Task<ActionResult<string>> DSOLogin(UserLogin request) // skratiti i ovo (2)
        {
            Dso dso = authService.GetDSO(request.UsernameOrEmail);  //ako postoji, uzmi prosumera iz baze
            
            if (dso == null)
                return BadRequest(new
                {
                    error = true,
                    message = "This username/email does not exist."
                });

            if (!authService.VerifyPassword(request.Password, dso.SaltPassword, dso.HashPassword))    //provera sifre
                return BadRequest(new
                {
                    error = true,
                    message = "Wrong password."
                });

            string dsoToken = authService.CreateToken(dso);
            //authService.SaveToken(dso, token);

            var refreshToken = authService.GenerateRefreshToken();
            //setovanje refresh tokena
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = refreshToken.Expires
            };
            Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);
            
            user = dso;
            user.RefreshToken = refreshToken;
            return Ok(new
            {
                token = dsoToken,
                refreshToken = refreshToken,
                user = user
            }) ;
        }

        [HttpGet("UsersProsumer")]
        public async Task<ActionResult<List<Prosumer>>> ListRegisterProsumer()
        {
            return Ok(authService.GetAllProsumers());
        }

        [HttpPost("refreshToken")]
        public async Task<ActionResult<string>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];

            if (!user.RefreshToken.Token.Equals(refreshToken))
                return Unauthorized("Invalid Refresh Token.");
            else if (user.RefreshToken.Expires < DateTime.Now)
                return Unauthorized("Expired Token.");

            string token = authService.CreateToken(user);
            var updatedRefreshToken = authService.GenerateRefreshToken();

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = updatedRefreshToken.Expires
            };
            Response.Cookies.Append("refreshToken", updatedRefreshToken.Token, cookieOptions);
            user.RefreshToken = updatedRefreshToken;

            return Ok(token);

        }
    }
}
