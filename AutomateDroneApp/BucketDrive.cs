using Amazon;
using Amazon.S3;
using AutomateDroneApp.Data;
using AutomateDroneApp.ServiceInterface;
using AutomateDroneApp.ServiceModel;
using Microsoft.AspNetCore.Identity;
using ServiceStack.Auth;
using ServiceStack.Aws;
using ServiceStack.IO;
using ServiceStack.VirtualPath;
using ServiceStack.Web;

namespace AutomateDroneApp;

public class BucketDriverValidator
{
    public static string ResolveUploadPath(FilesUploadContext ctx)
    {
        if (ctx.Dto is not CreateS3FileItem createFile)
            throw HttpError.BadRequest("Invalid file creation request.");
        if (string.IsNullOrEmpty(ctx.UserAuthId))
        {
            throw HttpError.BadRequest("Unauthorized file creation request.");
        }

        // var userAuth = HostContext.Resolve<IAuthRepository>().GetUserAuth(ctx.UserAuthId);
        // if (userAuth == null)
        // {
        //     throw HttpError.BadRequest("Unauthorized file creation request.");
        // }


        var time = DateTimeOffset.Now.ToUnixTimeSeconds();
        return $"/{ctx.UserAuthId}/{time}/{ctx.FileName}";
    }

    public static void ValidateUpload(IRequest arg1, IHttpFile arg2)
    {
        var userAuthTask = GetUserAuthFromIRequest(arg1);
        userAuthTask.Wait();
        var userAuth = userAuthTask.Result;
    }

    private static async Task<ApplicationUser?> GetUserAuthFromIRequest(IRequest arg1)
    {
        var session = await arg1.GetSessionAsync();
        var userManager = HostContext.Resolve<UserManager<ApplicationUser>>();
        return await FindByIdAsync(userManager, session.UserAuthId);
    }

    private static async Task<ApplicationUser?> FindByIdAsync(UserManager<ApplicationUser> userManager, string userAuthId)
    {
        try
        {
            return await userManager.FindByIdAsync(userAuthId);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw HttpError.BadRequest("Unauthorized file creation request.");
        }
    }

    public static void ValidateDownload(IRequest arg1, IVirtualFile arg2)
    {
        //   var userAuth = GetUserAuthFromIRequest(arg1);
    }

    public static void ValidateDelete(IRequest arg1, IVirtualFile arg2)
    {
        //   var userAuth = GetUserAuthFromIRequest(arg1);
    }
}

public class BucketDrive : IPlugin, IPreInitPlugin
{
    public readonly S3VirtualFiles VirtualPathProvider;

    public BucketDrive()
    {
        var s3Client = new AmazonS3Client(RegionEndpoint.USEast1);
        this.VirtualPathProvider = new S3VirtualFiles(s3Client, "droneappuploadbucket");
    }

    public void BeforePluginsLoaded(IAppHost appHost)
    {
        appHost.InsertVirtualFileSources.Clear();
        appHost.InsertVirtualFileSources.Add(VirtualPathProvider);
    }

    public void Register(IAppHost appHost)
    {
    }
}