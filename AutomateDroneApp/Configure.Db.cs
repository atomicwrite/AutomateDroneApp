using System.Text;
using Microsoft.EntityFrameworkCore;
using ServiceStack.Data;
using ServiceStack.OrmLite;
using AutomateDroneApp.Data;
using Newtonsoft.Json;

[assembly: HostingStartup(typeof(AutomateDroneApp.ConfigureDb))]

namespace AutomateDroneApp;

using Amazon;
using Amazon.SecretsManager;
using Amazon.SecretsManager.Model;

public class ConfigureDb : IHostingStartup
{
    public async Task<string> GetSecretAsync(string secretArn)
    {
        var client = new AmazonSecretsManagerClient(RegionEndpoint.USEast1);

        var request = new GetSecretValueRequest
        {
            SecretId = secretArn
        };

        GetSecretValueResponse? response = null;
        try
        {
            response = await client.GetSecretValueAsync(request);
        }
        catch (ResourceNotFoundException)
        {
            Console.WriteLine("The requested secret " + secretArn + " was not found");
        }
        catch (InvalidRequestException e)
        {
            Console.WriteLine("The request was invalid due to: " + e.Message);
        }
        catch (InvalidParameterException e)
        {
            Console.WriteLine("The request had invalid params: " + e.Message);
        }

        if (response == null)
        {
            return string.Empty;
        }

        // Your secret is either in SecretString or SecretBinary. If you create a binary secret, you can convert it:
        if (response.SecretString != null)
        {
            return response.SecretString;
        }

        if (string.IsNullOrEmpty(response.SecretString))
        {
            return string.Empty;
        }

        var decodedBinarySecret = Encoding.UTF8.GetString(Convert.FromBase64String(response.SecretString));
        return decodedBinarySecret;
    }

    private class DbSecret
    {
        public string username { get; set; }
        public string password { get; set; }
    }
 
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) =>
        {
            var dbSecretTask = GetSecretAsync("arn:"); //store in secrets 
            dbSecretTask.Wait();
            var dbSecretString = dbSecretTask.GetResult();
            if (string.IsNullOrEmpty(dbSecretString))
            {
                throw new Exception("Could not get db auth");
            }

            var dbSecret = JsonConvert.DeserializeObject<DbSecret>(dbSecretString);
            if (dbSecret == null)
            {
                throw new Exception("Could not decode db auth");
            }
            if (context.HostingEnvironment.IsDevelopment())
            {
 
                var connectionString = $"Server=.rds.amazonaws.com; Database=production; User ID={dbSecret.username}; Password={dbSecret.password}";
                services.AddSingleton<IDbConnectionFactory>(new OrmLiteConnectionFactory(
                    connectionString, MySqlConnectorDialect.Provider));
                OrmLiteConfig.BeforeExecFilter = dbCmd => { Console.WriteLine(dbCmd.GetDebugString()); };
    
                services.AddDbContext<ApplicationDbContext>(options =>
                    options .UseMySQL(connectionString, b => b.MigrationsAssembly(nameof(AutomateDroneApp))));
            }
            else
            {
                var connectionString = $"Server=.rds.amazonaws.com; Database=production; User ID={dbSecret.username}; Password={dbSecret.password}";
                services.AddSingleton<IDbConnectionFactory>(new OrmLiteConnectionFactory(
                    connectionString, MySqlConnectorDialect.Provider));
       
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseMySQL(connectionString, b => b.MigrationsAssembly(nameof(AutomateDroneApp))));
            }

            
            services.AddPlugin(new AdminDatabaseFeature());
        });
}