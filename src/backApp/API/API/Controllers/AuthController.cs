﻿using API.Models;
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
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using System.Reflection.Emit;
using System.Xml.Linq;
using System.ComponentModel;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Security.Principal;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {

        private readonly IAuthService authService;
        private static User user = new User();

        public AuthController(IAuthService serv)
        {
            authService = serv;
        }

        [HttpPost("registerProsumer")]
        public async Task<ActionResult<Prosumer>> Register(ProsumerDto request)
        {
            Prosumer prosumer = await authService.Register(request);
            if (prosumer != null)
                return Ok(prosumer);
            else
                return BadRequest("Email nije validan ili vec postoji!");
        }

        [HttpPost("registerDsoWorker")]
        public async Task<ActionResult<Dso>> Register(DsoWorkerDto request)
        {
            Dso dso = await authService.Register(request);
            if (dso != null)
                return Ok(dso);
            else
                return BadRequest("Email nije validan ili vec postoji takav!");
        }

        public void SetRefreshToken(RefreshToken refreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = refreshToken.Expires
            };
            Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);
        }

        //loginovi bi trebalo nekako da se skrate
        [HttpPost("prosumerLogin")]

        public async Task<ActionResult<string>> ProsumerLogin(UserLogin request) // skratiti i ovo (1)
        {
            Prosumer prosumer = await authService.GetProsumer(request.UsernameOrEmail);  //ako postoji, uzmi prosumera iz baze
            
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

            string userToken = await authService.CreateToken(prosumer);
            //authService.SaveToken(prosumer, userToken); mislim da je nepotrebno da se cuva u bazi token

            var refreshToken = authService.GenerateRefreshToken();
            SetRefreshToken(refreshToken);
            //setovanje refresh tokena
            /*var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = refreshToken.Expires
            };*/
            //Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);

            user = prosumer;
            user.RefreshToken = refreshToken;
            return Ok(new
            {
                error = false,
                token = userToken,
                refreshToken = refreshToken.Token
            });

        }        

        [HttpPost("DSOLogin")]
        public async Task<ActionResult<string>> DSOLogin(UserLogin request) // skratiti i ovo (2)
        {
            Dso dso = await authService.GetDSO(request.UsernameOrEmail);  //ako postoji, uzmi prosumera iz baze
            
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

            string dsoToken = await authService.CreateToken(dso);
            //authService.SaveToken(dso, token);

            var refreshToken = authService.GenerateRefreshToken();
            SetRefreshToken(refreshToken);
            //setovanje refresh tokena
            /*var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = refreshToken.Expires
            };
            Response.Cookies.Append("refreshToken", refreshToken.Token, cookieOptions);*/
            
            user = dso;
            user.RefreshToken = refreshToken;
            return Ok(new
            {
                token = dsoToken,
                refreshToken = refreshToken.Token,
                user = user
            }) ;
        }

        [Authorize(Roles = "korisnik")]
        [HttpGet("UsersProsumer")]
        public async Task<IActionResult> ListRegisterProsumer()
        {
            return Ok(await authService.GetAllProsumers());
        }

        [HttpPost("refreshToken")]
        public async Task<ActionResult> RefreshToken([FromBody] ReceiveRefreshToken refreshToken)
        {
            //var refreshToken = Request.Cookies["refreshToken"];

            if (!user.RefreshToken.Token.Equals(refreshToken.refreshToken))
                return Unauthorized("Invalid Refresh Token.");
            else if (user.RefreshToken.Expires < DateTime.Now)
                return Unauthorized("Expired Token.");

            string token = await authService.CreateToken(user);
            var updatedRefreshToken = authService.GenerateRefreshToken();
            SetRefreshToken(updatedRefreshToken);
            
            user.RefreshToken = updatedRefreshToken;

            return Ok(token);

            /*var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = updatedRefreshToken.Expires
            };
            Response.Cookies.Append("refreshToken", updatedRefreshToken.Token, cookieOptions);*/
            user.RefreshToken = updatedRefreshToken;

            return Ok(new
            {
                token = token,
                refreshToken = updatedRefreshToken.Token
            });

        }

        [HttpPost("Send_E-mail")]
        public IActionResult SendEmail(string emailUser,string messagetoClientHTML)  // messagetoClinet mora biti HTML!!!
        {

         
            
            var message = new MimeMessage(); // Mime.Kit
            message.From.Add(MailboxAddress.Parse("VoltaDSO@gmail.com")); 
            message.To.Add(MailboxAddress.Parse(emailUser));//email how forgot a password
            message.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {


                Text = messagetoClientHTML

            }; // koristimo html
            
            message.Subject = "USER "+emailUser +" has forgotten his password!";

            var smtp = new SmtpClient(); //using MailKit.Net.Smtp;
            if (emailUser.Contains("gmail.com"))
                smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls); // za gmail , 587 je port, using MailKit.Security
            
            if (emailUser.Contains("hotmail.com"))
                smtp.Connect("smtp.office365.com", 587, SecureSocketOptions.StartTls); // za hotmail , 587 je port, using MailKit.Security
           
            if (emailUser.Contains("yahoo.com"))
                smtp.Connect("smtp.mail.yahoo.com", 465, SecureSocketOptions.StartTls); // za hotmail , 587 je port, using MailKit.Security

            smtp.Authenticate("VoltaDSO@gmail.com", "qdbfwrmrgkrzkbdx");
            smtp.Send(message);
            smtp.Disconnect(true);


            return Ok();
        }

        //forgot passw
        
        [HttpPost("forgot_passwordProsumer")]

        public async Task<ActionResult> ForgotPasswordProsumer(string email)// mora da se napravi trenutni token  i datum kada istice 
        {
            //saljemo email 
           
            var prosumer = await authService.GetProsumer(email);
                
            if (prosumer == null)
            {

                return BadRequest("Prosumer is not found with that email");
            }
            
            authService.SaveToken(prosumer, authService.CreateRandomToken()); // kreiramo random token za prosumer-a koji ce da koristi za sesiju
   
         
           

            return Ok("User found!");
        }
        [HttpPost("forgot_passwordWorker")]

        public async Task<ActionResult> ForgotPasswordWorker(string email)// mora da se napravi trenutni token  i datum kada istice 
        {
            //saljemo email 
            var worker = await authService.GetDSO(email);

            if (worker == null)
            {

                return BadRequest("Worker is not found with that email");
            }

            authService.SaveToken(worker, authService.CreateRandomToken()); // kreiramo random token za prosumer-a koji ce da koristi za sesiju

            return Ok("Worker DSO found!");
        }
        //reset password
        [HttpPost("reset_passwordProsumer")]
        public async Task<ActionResult> ResetPasswordProsumer(ResetPassworkForm reset) // mora da se napravi trenutni token  i datum kada istice 
        {
            //
            var prosumer = await authService.GetProsumerWithToken(reset.Token);
            

            if (prosumer == null)
            {

                return BadRequest("Prosumer is not found");
            }
            authService.CreatePasswordHash(reset.Password, out byte[] passwordHash, out byte[] passwordSalt);
            
            prosumer.HashPassword = passwordHash;
            prosumer.SaltPassword = passwordSalt;
            prosumer.Token = null; //trenutno!

            authService.SaveToken(prosumer, authService.CreateRandomToken()); // kreiramo random token za prosumer-a
            return Ok("Password reset!");
        }
        [HttpPost("reset_passwordWorker")]
        public async Task<ActionResult> ResetPasswordWorker(ResetPassworkForm reset) // mora da se napravi trenutni token  i datum kada istice 
        {
           
            var worker = await authService.GetDSOWithToken(reset.Token);


            if (worker == null)
            {

                return BadRequest("Worker is not found");
            }
            authService.CreatePasswordHash(reset.Password, out byte[] passwordHash, out byte[] passwordSalt);

            worker.HashPassword = passwordHash;
            worker.SaltPassword = passwordSalt;
            worker.Token = null; //trenutno!

            authService.SaveToken(worker, authService.CreateRandomToken()); // kreiramo random token za workera-a
            return Ok("Password reset!");
        }

    }
}
