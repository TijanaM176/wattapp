using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using API.Repositories.UserRepository;
using System.Web;
using Microsoft.AspNetCore.Mvc;
using API.Models.Users;
using System.IO;
using MailKit.Security;
using MimeKit;
using MailKit.Net.Smtp;
using System.Reflection.Emit;
using System.Xml.Linq;
using Org.BouncyCastle.Asn1.Ocsp;
using static System.Net.WebRequestMethods;
using System;
using System.Data;

namespace API.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _repository;
        private readonly IConfiguration _config;
        private IWebHostEnvironment enviroment;
        public AuthService(IUserRepository repository, IConfiguration config, IWebHostEnvironment enviroment)
        {
            _repository = repository;
            _config = config;
            this.enviroment = enviroment;
        }

        public async Task<string> CheckUserName(UserDto request)
        {
            List<string> listaUsername = (await _repository.GetAllProsumers()).Select(p => p.Username).ToList();

            string username;
            for (int i = 1; ; i++)
            {
                username = request.getUsername(i);
                if (!listaUsername.Contains(username))
                {
                    break;
                }
            }

            return username;
        }

        public async Task<bool> checkEmail(UserDto request)
        {
            List<string> listaEmail = (await _repository.GetAllProsumers()).Select(p => p.Email).ToList();

            return !listaEmail.Contains(request.Email);
        }

        public bool IsValidEmail(string email)
        {
            Regex emailRegex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$", RegexOptions.IgnoreCase);

            return emailRegex.IsMatch(email);
        }

        public void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512()) // System.Security.Cryptography; Computes a Hash-based Message Authentication Code (HMAC) using the SHA512 hash function.
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password)); // using System.Text;   to je property Encoding.UTF8
            }
        }

        public async Task<bool> InsertProsumer(Prosumer prosumer)
        {
            try
            {
                await _repository.InsertProsumer(prosumer);
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }

        public async Task<bool> InsertDSOWorker(Dso DSO_Worker)
        {
            try
            {
                await _repository.InsertDSOWorker(DSO_Worker);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public bool VerifyPassword(string reqPassword, byte[] passwordSalt, byte[] passwordHash)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var reqPasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(reqPassword));

                return passwordHash.SequenceEqual(reqPasswordHash);
            }
        }

        public async Task<Role> getRole(string naziv)
        {
            try
            {
                var role = await _repository.getRole(naziv);
                return role;
            }
            catch (NullReferenceException)
            {
                throw;
            }
        }
        public async Task<Region> getRegion(string naziv)
        {
            try
            {
                var region = await _repository.getRegion(naziv);
                return region;
            }
            catch (NullReferenceException)
            {
                throw;
            }
        }
        public async Task<Neigborhood> getNeigborhood(string naziv)
        {
            try
            {
                var neigh = await _repository.getNeigborhood(naziv);
                return neigh;
            }
            catch (NullReferenceException)
            {
                throw;
            }
        }
        public async Task<City> getCity(string naziv)
        {
            try
            {
                var city = await _repository.getCity(naziv);
                return city;
            }
            catch (NullReferenceException)
            {
                throw;
            }
        }

        public async Task<string> getRoleName(long? id)
        {
            var roleName = await _repository.getRoleName(id);
            if (roleName == null) throw new ArgumentException("No role with this id!");

            return roleName;
        }



        public async Task<Prosumer> GetProsumer(string usernameOrEmail)
        {
            var prosumer = await _repository.GetProsumer(usernameOrEmail);
            if (prosumer == null) throw new ArgumentException("No prosumer found with this username or email!");

            return prosumer;
        }

        public async Task<Dso> GetDSO(string usernameOrEmail)
        {
            var dso = await _repository.GetDSO(usernameOrEmail);
            if (dso == null) throw new ArgumentException("No dso found with this username or email!");

            return dso;
        }

        public async Task<string> CreateToken(User user)
        {
            string roleName;
            try
            {
                roleName = await _repository.getRoleName(user.RoleId);
            }
            catch (Exception e)
            {
                //Console.Write(e.Message);
                return null;
            }
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, roleName),
                new Claim(JwtRegisteredClaimNames.Sub, user.Id)

            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Key").Value));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);
            var token = new JwtSecurityToken(
                issuer: _config.GetSection("AppSettings:Issuer").Value,
                audience: _config.GetSection("AppSettings:Audience").Value,
                claims: claims, expires: DateTime.Now.AddMinutes(int.Parse(_config.GetSection("AppSettings:AccessTokenValidity").Value)),
                signingCredentials: cred
            );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        public async Task<bool> SaveToken(User user, string token)
        {
            try
            {
                await _repository.SaveToken(user, token);
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }
        public async Task<bool> SaveToken(User user, string token, DateTime expiry)
        {
            try
            {
                await _repository.SaveToken(user, token, expiry);
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }

        public RefreshToken GenerateRefreshToken()
        {
            return new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Created = DateTime.Now,
                Expires = DateTime.Now.AddDays(int.Parse(_config.GetSection("AppSettings:RefreshTokenValidity").Value))
            };
        }

        // random token!
        public string CreateRandomToken()
        {

            return Convert.ToHexString(RandomNumberGenerator.GetBytes(64));
        }

        public async Task<Prosumer> GetProsumerWithToken(string token)
        {
            var prosumer = await _repository.GetProsumerWithToken(token);
            if (prosumer == null) throw new ArgumentException("No prosumer with that token!");

            return prosumer;
        }

        public async Task<Dso> GetDSOWithToken(string token)
        {
            var dso = await _repository.GetDSOWithToken(token);
            if (dso == null) throw new ArgumentException("No dso with that token");

            return dso;
        }

        //REGISTER

        //save image
        public (int,string) SaveImage(IFormFile ImageFile)
        {
            
                try
                {
                    // pročitaj sadržaj datoteke u byte array
                    byte[] imageBytes;
                    using (var stream = new MemoryStream())
                    {
                        ImageFile.CopyTo(stream);
                        imageBytes = stream.ToArray();
                    }

                    // konvertuj sliku u Base64 string
                    var base64String = Convert.ToBase64String(imageBytes);

                    // vrati Base64 string kao drugi element n-torke
                    return (1, base64String);
                }
                catch (Exception exc)
                {
                    return (0, "ERROR!");
                }
            

        }
        public Boolean DeleteImage(String PathImage)
        {
            try
            {
                var wwwPath = this.enviroment.WebRootPath;
                var path = Path.Combine(wwwPath, "Uploads\\", PathImage);
                if (System.IO.File.Exists(path))
                {
                    System.IO.File.Delete(path);
                    return true;
                }
                return false;
            }
            catch (Exception exc)
            {
                return false;
            }
        }

        private void SendRegisterEmail(User user, String Password)  // messagetoClinet mora biti HTML!!!
        {
            
            var message = new MimeMessage(); // Mime.Kit
            message.From.Add(MailboxAddress.Parse("VoltaDSO@gmail.com"));
            message.To.Add(MailboxAddress.Parse(user.Email)); //email how forgot a password
            
            StringBuilder cssCode = new StringBuilder();
            cssCode.AppendLine("<style>");
            cssCode.AppendLine(".notification {");
            cssCode.AppendLine("  background-color: #f2f2f2;");
            cssCode.AppendLine("  border-left: 15px solid #333;");
            cssCode.AppendLine("  margin: 20px 0;");
            cssCode.AppendLine("  padding: 12px;");
            cssCode.AppendLine("}");
            cssCode.AppendLine(".notification-content {");
            cssCode.AppendLine("  font-size: 16px;");
            cssCode.AppendLine("  line-height: 1.6;");
            cssCode.AppendLine("}");
            cssCode.AppendLine(".username {");
            cssCode.AppendLine("  font-weight: bold;");
            cssCode.AppendLine("}");
            cssCode.AppendLine(".usernamepass {");
            cssCode.AppendLine("  font-weight: bold;");
            cssCode.AppendLine("  color: black;");
            cssCode.AppendLine("}");
            cssCode.AppendLine("</style>");
            if (user is Prosumer)
            {
                // Build the HTML code
                StringBuilder htmlCode = new StringBuilder();
                string site ="http://softeng.pmf.kg.ac.rs:10073/login";

                htmlCode.AppendLine("<!DOCTYPE html>");
                htmlCode.AppendLine("<html>");
                htmlCode.AppendLine("<head>");
                htmlCode.AppendLine("<meta charset='UTF-8'>");
                htmlCode.AppendLine("<title>Notification</title>");
                htmlCode.AppendLine(cssCode.ToString()); // Add the CSS code to the HTML
                htmlCode.AppendLine("</head>");
                htmlCode.AppendLine("<body>");
                htmlCode.AppendLine("<div class='notification'>");
                htmlCode.AppendLine("<div class='notification-content'>");
                htmlCode.AppendLine($"<p>Your username is <span class='username'>{user.Username}</span></p>");
                htmlCode.AppendLine($"<p>Your password is <span class='usernamepass'>{Password}</span></p>");
                htmlCode.AppendLine($"<p>Click <a href='{site}'>Here</a> to access our app.</p>");
                htmlCode.AppendLine("</div>");
                htmlCode.AppendLine("</div>");
                htmlCode.AppendLine("</body>");
                htmlCode.AppendLine("</html>");

                message.Body = new TextPart(MimeKit.Text.TextFormat.Html)
                {
                    Text = htmlCode.ToString()
                };


                message.Subject = "Volta: Prosumer " + user.FirstName + " " + user.LastName + " ,we have sent you account information"; 
            
            }
            else
            {
                
                    // Build the HTML code
                    StringBuilder htmlCode = new StringBuilder();
                    string site = "http://softeng.pmf.kg.ac.rs:10072/login";

                    htmlCode.AppendLine("<!DOCTYPE html>");
                    htmlCode.AppendLine("<html>");
                    htmlCode.AppendLine("<head>");
                    htmlCode.AppendLine("<meta charset='UTF-8'>");
                    htmlCode.AppendLine("<title>Notification</title>");
                    htmlCode.AppendLine(cssCode.ToString()); // Add the CSS code to the HTML
                    htmlCode.AppendLine("</head>");
                    htmlCode.AppendLine("<body>");
                    htmlCode.AppendLine("<div class='notification'>");
                    htmlCode.AppendLine("<div class='notification-content'>");
                    htmlCode.AppendLine($"<p>Your username is <span class='username'>{user.Username}</span></p>");
                    htmlCode.AppendLine($"<p>Your password is <span class='usernamepass'>{Password}</span></p>");
                    htmlCode.AppendLine($"<p>Click <a href='{site}'>Here</a> to access our app.</p>");
                    htmlCode.AppendLine("</div>");
                    htmlCode.AppendLine("</div>");
                    htmlCode.AppendLine("</body>");
                    htmlCode.AppendLine("</html>");

                    message.Body = new TextPart(MimeKit.Text.TextFormat.Html)
                    {
                        Text = htmlCode.ToString()
                    };


                    message.Subject = "Volta: Dispatcher " + user.FirstName + " " + user.LastName + " ,we have sent you account information";

                }




            
            var smtp = new SmtpClient(); //using MailKit.Net.Smtp;
            if (user.Email.Contains("gmail.com"))
                smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls); // za gmail , 587 je port, using MailKit.Security

            if (user.Email.Contains("hotmail.com"))
                smtp.Connect("smtp.office365.com", 587, SecureSocketOptions.StartTls); // za hotmail , 587 je port, using MailKit.Security

            if (user.Email.Contains("yahoo.com"))
                smtp.Connect("smtp.mail.yahoo.com", 465, SecureSocketOptions.StartTls); // za hotmail , 587 je port, using MailKit.Security

            smtp.Authenticate("VoltaDSO@gmail.com", "qdbfwrmrgkrzkbdx");
            smtp.Send(message);
            smtp.Disconnect(true);

           
        }
        public async Task<Prosumer> Register(ProsumerDto request)
        {
            if (!request.Password.Equals(request.PasswordAgain))
                throw new Exception("Sifre se ne poklapaju!");
            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt); // vracamo dve vrednosti!

            Prosumer prosumer = new Prosumer(); // pravimo novog prosumer-a

            Guid id = Guid.NewGuid(); // proizvodimo novi id 
            string username = await CheckUserName(request);

            if (IsValidEmail(request.Email) && await checkEmail(request))
            {
                //osnovni podaci
                prosumer.Id = id.ToString();
                prosumer.FirstName = request.FirstName;
                prosumer.LastName = request.LastName;
                prosumer.Username = username;
                prosumer.Email = request.Email;
                prosumer.Address = request.Address;

                //sifre
                prosumer.HashPassword = passwordHash;
                prosumer.SaltPassword = passwordSalt;

                //token 
                prosumer.Token = null;


                City city = await getCity(request.City);
                Neigborhood neigborhood = await getNeigborhood(request.NeigbName);

                if (city == null || neigborhood == null) return null;


                //rola, region, neiborhood, city
                prosumer.Role = await getRole("Prosumer");
                prosumer.Region = await getRegion("Šumadija");
                prosumer.City = city;
                prosumer.Neigborhood = neigborhood;

                prosumer.RoleId = getRole("Prosumer").Id;
                prosumer.RegionId = (await getRegion("Šumadija")).Id;
                prosumer.NeigborhoodId = prosumer.Neigborhood.Id;
                prosumer.CityId = prosumer.City.Id;

                // kordinate

                prosumer.Longitude = null;
                prosumer.Latitude = null;

                //datum kreiranja
                prosumer.DateCreate = DateTime.Now.ToString("MM/dd/yyyy");


                //slika

                var defaultImage = "default.png";
                prosumer.Image = defaultImage;
                var path = Path.Combine(enviroment.ContentRootPath, "Uploads", defaultImage);

                if (System.IO.File.Exists(path))
                {
                    using (var stream = new FileStream(path, FileMode.Open))
                    {
                        var bytes = new byte[stream.Length];
                        await stream.ReadAsync(bytes, 0, (int)stream.Length);

                        prosumer.Image = Convert.ToBase64String(bytes);
                    }
                }
                else
                {
                    // ako default slika ne postoji, koristi null umesto slike
                    prosumer.Image = null;
                }






                if (await InsertProsumer(prosumer))
                {
                    // send e-mail 
                    SendRegisterEmail(prosumer, request.Password);

                    return prosumer; // sacuvaju se i 
                }
            }
            else throw new Exception("Niste uneli validan e-mail!");
            return null;
        }

        public async Task<Dso> Register(DsoWorkerDto request)
        {
            if (!request.Password.Equals(request.PasswordAgain))
                throw new Exception("Sifre se ne poklapaju!"); 
            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt); // vracamo dve vrednosti!

            Dso workerDSO = new Dso(); // pravimo novog DSO


            Guid id = Guid.NewGuid(); // proizvodimo novi id 
            string username = await CheckUserName(request);

            if (IsValidEmail(request.Email) && await checkEmail(request))
            {
                //osnovni podaci
                workerDSO.Id = id.ToString();
                workerDSO.FirstName = request.FirstName;
                workerDSO.LastName = request.LastName;
                workerDSO.Username = username; 
                workerDSO.Email = request.Email;
                workerDSO.Salary = request.Salary;
                
                //token
                workerDSO.Token = null;

               
               // workerDSO.Role = await getRole("WorkerDso");
               // workerDSO.Region = await getRegion("Šumadija");

                workerDSO.RoleId = (await getRole("Dispatcher")).Id;
                workerDSO.RegionId = (await getRegion("Šumadija")).Id;


                //sifre
                workerDSO.HashPassword = passwordHash;
                workerDSO.SaltPassword = passwordSalt;
              
                //datum kreiranja
                workerDSO.DateCreate = DateTime.Now.ToString("MM/dd/yyyy");

                /*
                if (request.imageFile != null)
                {
                    var result = this.SaveImage(request.imageFile);
                    if (result.Item1 == 1) // to je dobro pakuj path
                    {
                        workerDSO.Image = result.Item2;

                    }

                }*/
                if(!string.IsNullOrEmpty(request.image64String)) 
                {

                    workerDSO.Image = request.image64String;
                }
                else
                {
                    var defaultImage = "defaultWorker.png";
                    workerDSO.Image = defaultImage;
                    var path = Path.Combine(enviroment.ContentRootPath, "Uploads", defaultImage);

                    if (System.IO.File.Exists(path))
                    {
                        using (var stream = new FileStream(path, FileMode.Open))
                        {
                            var bytes = new byte[stream.Length];
                            await stream.ReadAsync(bytes, 0, (int)stream.Length);

                            workerDSO.Image = Convert.ToBase64String(bytes);
                        }
                    }
                    else
                    {
                        // ako default slika ne postoji, koristi null umesto slike
                        workerDSO.Image = null;
                    }
                }

                if (await InsertDSOWorker(workerDSO))
                {
                    SendRegisterEmail(workerDSO, request.Password);

                    return workerDSO;   // sacuvaju se i izmene
                }
            }
            else throw new Exception("Niste uneli validan e-mail!");
           
            return null;
        }

        public async Task<bool> DeleteToken(string username, string role)
        {
            User user;
            if (role == "Prosumer") user = await GetProsumer(username);
            else user = await GetDSO(username);

            user.Token = null;
            user.TokenExpiry = null;

            try
            {
                await _repository.Save();
                return true;
            }
            catch (Exception) 
            {
                return false;
            }
        }
        /*
        public string CreateBody()
        {
            string filePath = @"ImpView\sendmail.html";
            string html = string.Empty;
            if (File.Exists(filePath))
            {
                using (FileStream fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
                {
                    using (StreamReader streamReader = new StreamReader(fileStream, Encoding.UTF8))
                    {
                        html = streamReader.ReadToEnd();
                    }
                }
            }
            return html;
        }
       */ //ne koristi se, samo radi probe!!!
    }
}
