using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// this is what's need to serve our client app from our api server

namespace API.Controllers
{
    [AllowAnonymous]
    public class FallbackController : Controller
    {
        public IActionResult Index(){
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"),
                "text/HTML");
        }
    }
}