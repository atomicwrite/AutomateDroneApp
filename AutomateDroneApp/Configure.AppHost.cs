using System.Text;
using AutomateDroneApp.ServiceInterface;
using ServiceStack.Configuration;
using ServiceStack.Logging;
using ServiceStack.NativeTypes.TypeScript;

[assembly: HostingStartup(typeof(AutomateDroneApp.AppHost))]

namespace AutomateDroneApp;

public class AppHost() : AppHostBase("AutomateDroneApp"), IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) =>
        {
            // Configure ASP.NET Core IOC Dependencies
            services.AddSingleton(new AppConfig
            {
                AppBaseUrl = context.HostingEnvironment.IsDevelopment()
                    ? "https://localhost:5173"
                    : null,
                ApiBaseUrl = context.HostingEnvironment.IsDevelopment()
                    ? "https://localhost:5001"
                    : null,
            });
        });

    // Configure your AppHost with the necessary configuration and dependencies your App needs
    public override void Configure()
    {
        Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
        SetConfig(new HostConfig
        {
        });
        var bucketDrive = new BucketDrive();
        var validator = new BucketDriverValidator();
#if DEBUG
        LogManager.LogFactory = new DebugLogFactory(debugEnabled: true); //or console log
#else
#endif
        Plugins.Add(bucketDrive);
        Plugins.Add(new FilesUploadFeature(
            new UploadLocation("s3", bucketDrive.VirtualPathProvider,
                readAccessRole: RoleNames.AllowAnon,
                resolvePath: BucketDriverValidator.ResolveUploadPath,
               // allowExtensions: ["kmz"],
                validateUpload: BucketDriverValidator.ValidateUpload,
                validateDownload: BucketDriverValidator.ValidateDownload,
                validateDelete: BucketDriverValidator.ValidateDelete
                //      transformFile:validator.TransformFile
            )
        ));
        Plugins.Add(bucketDrive);
        TypeScriptGenerator.InsertTsNoCheck = true;
    }

    // TODO: Replace with your own License Key. FREE Individual or OSS License available from: https://servicestack.net/free
    public static void RegisterKey() =>
        Licensing.RegisterLicense(
            "OSS BSD-3-Clause 2024 https://github.com/NetCoreTemplates/vue-spa TT76agO8eEwZcyhauXTD7a/9eK2g/Ote0yQU3o0bMXR4T6I3k4R/sr1TAvUkbeTG+1t/qJQKjlUKe58L7bBdjUx3UfRuboyjP6LO38RFlKfNMhjzkwsklWWfnRIQxguX6bf1yD7iQumkgRoW9VoqKEhNppvl518+UnFJ4PVwQRw=");
}