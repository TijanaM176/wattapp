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
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using System.Reflection.Emit;
using System.Xml.Linq;
using System.ComponentModel;

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
                prosumer.Role = authService.getRole("korisnik");
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
                workerDSO.RoleId = authService.getRole("WorkerDso").Id;
                workerDSO.HashPassword = passwordHash;
                workerDSO.SaltPassword = passwordSalt;
                workerDSO.RegionId = "trenutno"; // ovo je trenutno dok se ne napravi Dso, Pa cemo da vracamo iz dso-a
                workerDSO.DateCreate = DateTime.Now.ToString("MM/dd/yyyy");
                workerDSO.Role = authService.getRole("WorkerDso");
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
                return BadRequest("This username/email does not exist.");

            if (!authService.VerifyPassword(request.Password, prosumer.SaltPassword, prosumer.HashPassword))    //provera sifre
                return BadRequest("Wrong password.");

            string token = authService.CreateToken(prosumer);
            authService.SaveToken(prosumer, token);
            return Ok(token);


        }

        [HttpPost("DSOLogin")]
        public async Task<ActionResult<string>> DSOLogin(UserLogin request) // skratiti i ovo (2)
        {
            Dso dso = authService.GetDSO(request.UsernameOrEmail);  //ako postoji, uzmi prosumera iz baze

            if (dso == null)
                return BadRequest("This username/email does not exist.");

            if (!authService.VerifyPassword(request.Password, dso.SaltPassword, dso.HashPassword))    //provera sifre
                return BadRequest("Wrong password.");

            string token = authService.CreateToken(dso);
            authService.SaveToken(dso, token);
            return Ok(token);
        }

        [HttpGet("UsersProsumer")]
        public async Task<IActionResult> ListRegisterProsumer()
        {
            return Ok(await authService.GetAllProsumers());
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
           
            var prosumer =  authService.GetProsumer(email);
                
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
            var worker = authService.GetDSO(email);

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
            var prosumer = authService.GetProsumerWithToken(reset.Token);
            

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
           
            var worker = authService.GetDSOWithToken(reset.Token);


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
