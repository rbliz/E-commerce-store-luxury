using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] 
    // by using this [controller] placeholder (instead of, for ex. /catalog)
    // it works for any controller which derives from the baseapicontroller
    public class BaseApiController : ControllerBase
    {
        
    }
}