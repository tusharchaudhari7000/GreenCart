using System.Text.Json.Serialization;
using GreenCart_Admin_Service_.NET_.Models;
using Microsoft.EntityFrameworkCore;
using Steeltoe.Discovery.Client;

namespace GreenCart_Admin_Service_.NET_
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Controllers & JSON
            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                });

            // DbContext
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                                 ?? "server=localhost;port=3306;user=root;password=root;database=greencartdb";

            builder.Services.AddDbContext<GreencartdbContext>(options =>
                options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

            // Swagger
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // ✅ Steeltoe Discovery Client (Eureka)
            builder.Services.AddDiscoveryClient(builder.Configuration);

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // app.UseHttpsRedirection(); // intentionally disabled

            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
