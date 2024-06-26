using System.Text;
using API.Data;
using API.Entities;
using API.Middleware;
using API.RequestHelpers;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container. Here are the dependencies injected so I can use them in other parts of the app

builder.Services.AddControllers();
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

// configuring swagger to send the authentication, so when we get to the currentUser endpoint we get the userDto back
// after setting this, we'll go to the middleware to add config too there
builder.Services.AddSwaggerGen(c=>{
    var jwtSecuityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "Authorization", // it needs to have this precise name
        In = ParameterLocation.Header, // it will be inside the header
        Type = SecuritySchemeType.ApiKey,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Description = "Put Bearer + your token in the box below",
        Reference = new OpenApiReference{
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme,
        },
    };

    c.AddSecurityDefinition(jwtSecuityScheme.Reference.Id, jwtSecuityScheme);

    c.AddSecurityRequirement(new OpenApiSecurityRequirement{
        {
            jwtSecuityScheme, Array.Empty<string>()
        }
    });
}); 


string connString;
if (builder.Environment.IsDevelopment())
    connString = builder.Configuration.GetConnectionString("DefaultConnection");
else
{
    // Use connection string provided at runtime by FlyIO.
    var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

    // Parse connection URL to connection string for Npgsql
    connUrl = connUrl.Replace("postgres://", string.Empty);
    var pgUserPass = connUrl.Split("@")[0];
    var pgHostPortDb = connUrl.Split("@")[1];
    var pgHostPort = pgHostPortDb.Split("/")[0];
    var pgDb = pgHostPortDb.Split("/")[1];
    var pgUser = pgUserPass.Split(":")[0];
    var pgPass = pgUserPass.Split(":")[1];
    var pgHost = pgHostPort.Split(":")[0];
    var pgPort = pgHostPort.Split(":")[1];

    connString = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb}";
}
builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseNpgsql(connString);
});


builder.Services.AddCors();

// with the addition of the identitycore service, we now have another service called user manager which 
// allows us to manage our users inside the db via the EF

builder.Services.AddIdentityCore<User>(opt => {
    opt.User.RequireUniqueEmail = true;
})
    .AddRoles<Role>()
    .AddEntityFrameworkStores<StoreContext>(); // it will gives tables for our db (user, role, etc)
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
        };
    }); // after setting this we need to add middleware for authetntication below

builder.Services.AddAuthorization();
builder.Services.AddScoped<TokenService>(); // the scoped means that the service will be kept alive while the http request is processed then when finished it is disposed. The others are Trasient and Singleton
builder.Services.AddScoped<PaymentService>();
builder.Services.AddScoped<ImageService>();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseMiddleware<ExceptionMiddleware>(); // adding the middleware I created to the very top of the request pipeline

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    // this config allows the persistance of the authentication even after a browser refresh
    app.UseSwaggerUI(c => {
        c.ConfigObject.AdditionalItems.Add("persistAuthorization", "true");
    });
}

// to serve the client app from the api we need to specify middleware here before the useCors!
app.UseDefaultFiles(); // this means it will look inside its default directory (wwwroot) for an index.html file
app.UseStaticFiles();


// we need to allowcredentials() to be able to pass cookies to/from the client domain to the server domain
app.UseCors(opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
});

app.UseAuthentication(); // the order of the middleware is important. first the authentication
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToController("Index", "Fallback"); // to tell the api what to do when it finds a route it does not know about. Because now I have the client app hosted in the api

var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
try
{
    await context.Database.MigrateAsync();
    await DbInitializer.Initialize(context, userManager);
}
catch (Exception ex)
{
    
    logger.LogError(ex, "A problem occurred during migration");
}

app.Run();
