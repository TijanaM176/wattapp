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
            List<Prosumer> listaProsumer = await _repository.GetAllProsumers();
            List<string> listaUsername = new List<string>();
            string username = "";
            bool check = true;
            int count = 1;
            foreach (var item in listaProsumer)
            {
                listaUsername.Add(item.Username);
            }

            while (check)
            {
                if (listaUsername.Contains(username = request.getUsername(count++)))
                    check = true;
                else
                    check = false;
            }

            return username;
        }

        public async Task<bool> checkEmail(UserDto request)
        {
            List<Prosumer> listaProsumer = await _repository.GetAllProsumers();
            List<string> listaEmail = new List<string>();

            foreach (var item in listaProsumer)
            {
                listaEmail.Add(item.Email);
            }


            if (listaEmail.Contains(request.Email))
                return false;

            return true;
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
                var contentPath = this.enviroment.ContentRootPath;
                //path = "c://projects/Imageapi/uploads"
                var path = Path.Combine(contentPath, "Uploads");

                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }
                //Check the allowed extenstions
                var ext = Path.GetExtension(ImageFile.FileName);
                var allowedExtensions = new string[] { ".jpg", ".png", ".jpeg" };

                if (!allowedExtensions.Contains(ext))
                {
                    string msg = string.Format("Only {0} extensions are allowed", string.Join(",", allowedExtensions));
                    return (0,msg);

                }
                string uniqueString = Guid.NewGuid().ToString();
                //we are trying to create a unique filename here

                var newFileName = uniqueString + ext;
                var fileWithPath = Path.Combine(path, newFileName);
                var stream = new FileStream(fileWithPath, FileMode.Create);

                ImageFile.CopyTo(stream);
                stream.Close();
                return (1,newFileName);
            }
            catch (Exception exc)
            {

                return (0,"ERROR!");
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
        public async Task<Prosumer> Register(ProsumerDto request)
        {
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
                if (request.imageFile != null)
                {
                    var result = this.SaveImage(request.imageFile);
                    if (result.Item1 == 1) // to je dobro pakuj path
                    {
                       

                        var image = result.Item2;
                       
                        var path = Path.Combine(enviroment.ContentRootPath, "Uploads", image);

                        if (System.IO.File.Exists(path))
                        {
                            using (var stream = new FileStream(path, FileMode.Open))
                            {
                                var bytes = new byte[stream.Length];
                                await stream.ReadAsync(bytes, 0, (int)stream.Length);

                                prosumer.Image = Convert.ToBase64String(bytes);
                            }
                        }
                        System.IO.File.Delete(path);
                    }
                  
                }
                else
                {
                    var defaultImage = "default.png";
                    prosumer.Image = defaultImage;
                   var path = Path.Combine(enviroment.ContentRootPath,"Uploads",defaultImage);

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
                }
             




                if (await InsertProsumer(prosumer)) return prosumer; // sacuvaju se i 

            }
            return null;
        }

        public async Task<Dso> Register(DsoWorkerDto request)
        {
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
                workerDSO.Image = request.Image;
                workerDSO.Salary = request.Salary;
                
                //token
                workerDSO.Token = null;

               
                workerDSO.Role = await getRole("WorkerDso");
                workerDSO.Region = await getRegion("Šumadija");

                workerDSO.RoleId = workerDSO.Role.Id;
                workerDSO.RegionId = workerDSO.Region.Id;


               //sifre
                workerDSO.HashPassword = passwordHash;
                workerDSO.SaltPassword = passwordSalt;
              
                //datum kreiranja
                workerDSO.DateCreate = DateTime.Now.ToString("MM/dd/yyyy");
           
                if (await InsertDSOWorker(workerDSO)) return workerDSO;   // sacuvaju se i izmene

            }
            return null;
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
