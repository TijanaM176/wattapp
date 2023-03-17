﻿using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using API.Models;

using System.Web;
using API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace API.Services
{
    public class AuthService: IAuthService
    {
        private readonly IUserRepository _repository;
        private readonly IConfiguration _config;
        public AuthService(IUserRepository repository, IConfiguration config)
        {
            _repository = repository;
            _config = config;
        }

        
        
        public async Task<string> CheckUserName(UserDto request)
        {
            List<Prosumer> listaProsumer = await _repository.GetAllProsumers();
            List<String> listaUsername = new List<String>();
            string username = "";
            Boolean check = true;
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

        public async Task<Boolean> checkEmail(UserDto request)
        {
            List<Prosumer> listaProsumer = await _repository.GetAllProsumers();
            List<String> listaEmail = new List<String>();
         
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

        public async void InsertProsumer(Prosumer prosumer)
        {
            _repository.InsertProsumer(prosumer);
        }
        
        public async void InsertDSOWorker(Dso DSO_Worker)
        {
            _repository.InsertDSOWorker(DSO_Worker);
        }
        

        public bool VerifyPassword(string reqPassword, byte[] passwordSalt, byte[] passwordHash)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var reqPasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(reqPassword));

                return passwordHash.SequenceEqual(reqPasswordHash);
            }
        }

        //sta bi trebalo da vracam ako je null??
        public async Task<Role> getRole(string naziv)
        {
            var role = await _repository.getRole(naziv);
            if (role != null) return role;

            return null;
        }
        public async Task<string> getRoleName(long? id)
        {
            var roleName = await _repository.getRoleName(id);
            if (roleName != null) return roleName;

            return null;
        }

        public async Task<Prosumer> GetProsumer(string usernameOrEmail)
        {
            var prosumer = await _repository.GetProsumer(usernameOrEmail);
            if (prosumer != null) return prosumer;

            return null;
        }

        public async Task<Dso> GetDSO(string usernameOrEmail)
        {
            var dso = await _repository.GetDSO(usernameOrEmail);
            if (dso != null) return dso;

            return null;
        }
        

        public async Task<string> CreateToken(User user)
        {
            string roleName = await _repository.getRoleName(user.RoleId);
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, roleName)

            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Key").Value));
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
        
        public void SaveToken(User user, string token)
        {
            _repository.SaveToken(user, token);
        }
        
        public async Task<List<Prosumer>> GetAllProsumers()
        {
            var prosumers = await _repository.GetAllProsumers();
            if (prosumers != null) return prosumers;

            return null;
        }
        
        public RefreshToken GenerateRefreshToken()
        {
            return new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Created = DateTime.Now,
                Expires = DateTime.Now.AddMinutes(int.Parse(_config.GetSection("AppSettings:RefreshTokenValidity").Value))
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
            if (prosumer != null) return prosumer;

            return null;
        }

        public async Task<Dso> GetDSOWithToken(string token)
        {
            var dso = await _repository.GetDSOWithToken(token);
            if (dso != null) return dso;

            return null;
        }

        //REGISTER

        public async Task<Prosumer> Register(ProsumerDto request)
        {
            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt); // vracamo dve vrednosti!

            Prosumer prosumer = new Prosumer(); // pravimo novog prosumer-a


            Guid id = Guid.NewGuid(); // proizvodimo novi id 
            string username = await CheckUserName(request);

            if (IsValidEmail(request.Email) && await checkEmail(request))
            {
                prosumer.Id = id.ToString();
                prosumer.FirstName = request.FirstName;
                prosumer.LastName = request.LastName;
                prosumer.Username = username; // proveri validnost username 
                prosumer.Email = request.Email; // validnost email-a
                
                prosumer.Token = null; // to je trenutno posle ide komunikacija
                prosumer.RoleId = getRole("korisnik").Id; // -------  vratiIDRole("korisnik"); kada ga hardkodujem ne vraca gresku wtf?Morao sam ovako, izmeni sledeci put-------
                //prosumer.Role = vratiIDRole("korisnik");// ---ne radi fun ne znam zasto?
                prosumer.HashPassword = passwordHash;
                prosumer.SaltPassword = passwordSalt;
                prosumer.RegionId = "trenutno"; // ovo je trenutno dok se ne napravi Dso, Pa cemo da vracamo iz dso-a
                
                prosumer.DateCreate = DateTime.Now.ToString("MM/dd/yyyy");
                prosumer.Role = await getRole("korisnik");

                //prosumer only
                prosumer.NeigborhoodId = "trenutno"; // ovo isto vazi kao i za RegionId
                prosumer.Address = request.address;
                prosumer.Image = request.Image;

                InsertProsumer(prosumer); // sacuvaju se i izmene

                return prosumer;
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
                workerDSO.Id = id.ToString();
                workerDSO.FirstName = request.FirstName;
                workerDSO.LastName = request.LastName;
                workerDSO.Username = username; // proveri validnost username 
                workerDSO.Email = request.Email; // validnost email-a
                workerDSO.Image = request.Image;
                workerDSO.Salary = request.Salary;
                workerDSO.Token = null; // to je trenutno posle ide komunikacija
                workerDSO.RoleId = getRole("WorkerDso").Id;
                workerDSO.HashPassword = passwordHash;
                workerDSO.SaltPassword = passwordSalt;
                workerDSO.RegionId = "trenutno"; // ovo je trenutno dok se ne napravi Dso, Pa cemo da vracamo iz dso-a
                workerDSO.DateCreate = DateTime.Now.ToString("MM/dd/yyyy");
                workerDSO.Role = await getRole("WorkerDso");
                InsertDSOWorker(workerDSO); // sacuvaju se i izmene

                return workerDSO;
            }
            else
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