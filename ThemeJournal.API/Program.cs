using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using ThemeJournal.Api.Services;
using ThemeJournal.ServiceLibrary.Data;
using ThemeJournal.ServiceLibrary.DataAccess;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder
    .Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));
builder.Services.AddControllers();

// Register services

// User service
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddHttpContextAccessor();

// Data Services
builder.Services.AddTransient<IDataAccess, SqlDataAccess>();
builder.Services.AddTransient<IObjectiveData, ObjectiveData>();
builder.Services.AddTransient<IProgressData, ProgressData>();
builder.Services.AddTransient<ITaskData, TaskData>();
builder.Services.AddTransient<IThemeData, ThemeData>();
builder.Services.AddTransient<IGratitudeData, GratitudeData>();
builder.Services.AddTransient<IThoughtData, ThoughtData>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder
    .Services
    .AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "ThemeJournal.API", Version = "v1" });
        var jwtSecurityScheme = new OpenApiSecurityScheme
        {
            BearerFormat = "jwt",
            Name = "JWT Authentication",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.Http,
            Scheme = JwtBearerDefaults.AuthenticationScheme,
            Description = "Put **_ONLY_** your JWT Bearer token on textbox below!",
            Reference = new OpenApiReference
            {
                Id = JwtBearerDefaults.AuthenticationScheme,
                Type = ReferenceType.SecurityScheme
            }
        };

        c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
        c.AddSecurityRequirement(
            new OpenApiSecurityRequirement { { jwtSecurityScheme, Array.Empty<string>() } }
        );
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
