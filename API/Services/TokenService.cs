// the Services folder (some sort of a layer...) will contain what does not entail updating the database
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    // the configuration passed as argument to the constructor is to access the appsettings
    public class TokenService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _config;
        public TokenService(UserManager<User> userManager, IConfiguration config)
        {
            _userManager = userManager;
            _config = config;
        }

        public async Task<string> GenerateToken(User user)
        {
            // this is content that goes inside the payload
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            var roles = await _userManager.GetRolesAsync(user);
            foreach(var role in roles){
                claims.Add(new Claim(ClaimTypes.Role, role ));
            }

            // signature
            var key =  new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWTSettings:TokenKey"])); // we gotta add this in the appsettings.development
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            // this builds up the token adding everything we need inside the token
            var tokenOptions = new JwtSecurityToken(
                issuer: null, // null for development purposes, to keep it simple
                audience: null,
                signingCredentials: creds,
                claims: claims,
                expires: DateTime.Now.AddDays(7)
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);        }
    }
}