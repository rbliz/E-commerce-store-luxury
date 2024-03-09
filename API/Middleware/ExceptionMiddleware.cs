using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;
        private readonly IHostEnvironment _env;
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        
        }

        // Creating middleware
        public async Task InvokeAsync(HttpContext context)
        {
            try{
                await _next(context); // passing it to the next piece of middleware
            }
            catch(Exception ex){
                _logger.LogError(ex, ex.Message); // passing the exception to the logger
                // specifying our response below
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = 500;

                // (instanciating) creating our response
                var response = new ProblemDetails{
                        Status = 500,
                        // if we´re in development mode we want to get a StackTrace
                        // optional chaining (stacktrace(?)) if stacktrace is null
                        Detail = _env.IsDevelopment()? ex.StackTrace?.ToString(): null,
                        Title = ex.Message
                };

                //specifying our options to the json serializer because we are outside
                // the context of an api controller so we lose the defaults in the return
                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };
                //then we create our response
                var json = JsonSerializer.Serialize(response, options);

                // what we are gonna return to the client if we get the exception
                await context.Response.WriteAsync(json);
            }
        }
    }
}