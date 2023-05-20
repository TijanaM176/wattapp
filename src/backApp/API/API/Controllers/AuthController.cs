using Microsoft.AspNetCore.Mvc;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Authorization;
using API.Models.Users;
using API.Services.Auth;
using API.Models.HelpModels;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {

        private readonly IAuthService authService;
       
        public AuthController(IAuthService serv)
        {
            authService = serv;
           
        }
       
        [HttpPost("registerProsumer")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Register(ProsumerDto request)
        {
            try{
                Prosumer prosumer = await authService.Register(request);
                if (prosumer != null)
                {
                    var json = new
                    {
                        ID = prosumer.Id,
                        Firstname = prosumer.FirstName,
                        Lastname = prosumer.LastName,
                        Username = prosumer.Username,
                        Email = prosumer.Email,
                        RoleId = prosumer.RoleId,
                        RegionId = prosumer.RegionId,
                        CityId = prosumer.CityId,
                        NeigborhoodId = prosumer.NeigborhoodId
                    };
                    return Ok(json);
                }

                else
                    return BadRequest("Error! Prosumer is null!");
            }
            catch(Exception ex)
            {


                return BadRequest(ex.Message);
            }
            
        }

        [HttpPost("registerDsoWorker")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Register( DsoWorkerDto request)
        {
            try
            {


                Dso dso = await authService.Register(request);
                if (dso != null)
                {
                    var json = new
                    {
                        ID = dso.Id,
                        Firstname = dso.FirstName,
                        Lastname = dso.LastName,
                        Username = dso.Username,
                        Email = dso.Email,
                        Salary = dso.Salary,
                        RoleId = dso.RoleId,
                        RegionId = dso.RegionId


                    };
                    return Ok(json);
                }
                else
                    return BadRequest("Error!");
            }
            catch(Exception ex)
            {


                return BadRequest(ex.Message);
            }
        }

        [HttpPost("setRefreshToken")]
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
            Prosumer prosumer;
            try
            {
                prosumer = await authService.GetProsumer(request.UsernameOrEmail);  //ako postoji, uzmi prosumera iz baze
            }
            catch (ArgumentException)
            {
                return BadRequest(new
                {
                    error = true,
                    message = "This username/email does not exist."
                });
            }
                     
            if (!authService.VerifyPassword(request.Password, prosumer.SaltPassword, prosumer.HashPassword))    //provera sifre
                return BadRequest(new
                {
                    error = true,
                    message = "Wrong password."
                });

            string userToken = await authService.CreateToken(prosumer);
            var refreshToken = authService.GenerateRefreshToken();
            SetRefreshToken(refreshToken);

            if (!await authService.SaveToken(prosumer, refreshToken.Token, refreshToken.Expires)) return Problem("Unable to save token");

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
            Dso dso;
            try
            {
                dso = await authService.GetDSO(request.UsernameOrEmail);  //ako postoji, uzmi prosumera iz baze
            }
            catch (Exception)
            {
                return BadRequest(new
                {
                    error = true,
                    message = "This username/email does not exist."
                });
            }

            if (!authService.VerifyPassword(request.Password, dso.SaltPassword, dso.HashPassword))    //provera sifre
                return BadRequest(new
                {
                    error = true,
                    message = "Wrong password."
                });

            string dsoToken = await authService.CreateToken(dso);
            var refreshToken = authService.GenerateRefreshToken();
            SetRefreshToken(refreshToken);
            if (!await authService.SaveToken(dso, refreshToken.Token, refreshToken.Expires)) return Problem("Unable to save token");

            return Ok(new
            {
                token = dsoToken,
                refreshToken = refreshToken.Token,
            }) ;
        }

            [HttpPost("refreshToken")]
            public async Task<ActionResult> RefreshToken([FromBody] ReceiveRefreshToken refreshToken)
            {
                //var refreshToken = Request.Cookies["refreshToken"];
                User user = null;
                if (refreshToken.role == "Prosumer")
                   user = await authService.GetProsumer(refreshToken.username);
                else
                    user = await authService.GetDSO(refreshToken.username);

                if (user == null) return BadRequest("Invalid username");

                if (!user.Token.Equals(refreshToken.refreshToken))
                    return Unauthorized("Invalid Refresh Token.");
                else if (user.TokenExpiry < DateTime.Now)
                    return Unauthorized("Expired Token.");

                string token = await authService.CreateToken(user);
                var updatedRefreshToken = authService.GenerateRefreshToken();
                SetRefreshToken(updatedRefreshToken);
                if (!await authService.SaveToken(user, updatedRefreshToken.Token, updatedRefreshToken.Expires)) return BadRequest("Token could not be saved!");
                
                return Ok(new
                {
                    token,
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
            
            message.Subject = "Volta: User "+emailUser +" has forgotten their password!";

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
            Prosumer prosumer;

            try
            {
                prosumer = await authService.GetProsumer(email);
            }
            catch (Exception)
            {
                return BadRequest("Prosumer is not found with that email");
            }
            
            if (!await authService.SaveToken(prosumer, authService.CreateRandomToken())) return BadRequest("Token could not be saved"); // kreiramo random token za prosumer-a koji ce da koristi za sesiju

            return Ok(new { error = false, resetToken = prosumer.Token });
        }

        [HttpPost("forgot_passwordWorker")]
        public async Task<ActionResult> ForgotPasswordWorker(string email)// mora da se napravi trenutni token  i datum kada istice 
        {
            //saljemo email 
            Dso worker;
            try
            {
                worker = await authService.GetDSO(email);
            }
            catch (Exception)
            {
                return BadRequest("Worker is not found with that email");
            }

            if (!await authService.SaveToken(worker, authService.CreateRandomToken())) return BadRequest("Token could not be saved"); // kreiramo random token za prosumer-a koji ce da koristi za sesiju

            return Ok(new { error = false, resetToken = worker.Token });
        }

        //reset password
        [HttpPost("reset_passwordProsumer")]
        public async Task<ActionResult> ResetPasswordProsumer(ResetPassworkForm reset) // mora da se napravi trenutni token  i datum kada istice 
        {
            Prosumer prosumer;

            try
            {
                prosumer = await authService.GetProsumerWithToken(reset.Token);
            }
            catch (Exception)
            {
                return Ok(new { error = true, message = "Prosumer is not found" });
            }
 
            authService.CreatePasswordHash(reset.Password, out byte[] passwordHash, out byte[] passwordSalt);
            
            prosumer.HashPassword = passwordHash;
            prosumer.SaltPassword = passwordSalt;
            prosumer.Token = null; //trenutno!

            if (!await authService.SaveToken(prosumer, authService.CreateRandomToken())) Ok(new { error = true, message = "Token could not be saved" }); // kreiramo random token za prosumer-a
            return Ok(new { error = false, message = "Password changed!" });
        }

        [HttpPost("reset_passwordWorker")]
        public async Task<ActionResult> ResetPasswordWorker(ResetPassworkForm reset) // mora da se napravi trenutni token  i datum kada istice 
        {

            Dso worker;
            try
            {
                worker = await authService.GetDSOWithToken(reset.Token);
            }
            catch (Exception)
            {
                return Ok(new { error = true, message = "Worker is not found" });
            }

            authService.CreatePasswordHash(reset.Password, out byte[] passwordHash, out byte[] passwordSalt);

            worker.HashPassword = passwordHash;
            worker.SaltPassword = passwordSalt;
            worker.Token = null; //trenutno!

            if (!await authService.SaveToken(worker, authService.CreateRandomToken())) return Ok(new { error = true, message = "Token could not be saved" }); // kreiramo random token za workera-a
            return Ok(new { error = false, message = "Password changed!"});
        }

        [HttpPut("Logout")]
        public async Task<IActionResult> Logout(string username, string role)
        {
            if (await authService.DeleteToken(username, role)) return Ok(true);
            else return BadRequest(false);
        }
    }
}
