using AutomateDroneApp.ServiceModel;
using ServiceStack;
using ServiceStack.IO;
using ServiceStack.OrmLite;

namespace AutomateDroneApp.ServiceInterface;

public class FileServices : Service
{
    private readonly AwsFileSigner _awsFileSigner = new AwsFileSigner();

    public override void Dispose()
    {
        _awsFileSigner.Dispose();
        base.Dispose();
    }

    public async Task<AwsUrlResponse> Get(AwsUrlRequest request)
    {
        var s3FileItem = await Db.LoadSingleByIdAsync<S3FileItem>(request.Id); // Use your ORM/DB context here

        if (s3FileItem == null)
            throw HttpError.NotFound($"S3FileItem with Id {request.Id} does not exist");


        var file = VirtualFileSources.GetFile(s3FileItem.GeometryFile.FilePath);

        if (file == null)
            throw HttpError.NotFound($"File at {s3FileItem.GeometryFile.FilePath} does not exist");

        var url = await _awsFileSigner.GenerateUrl(s3FileItem.GeometryFile.FilePath.Substring(1));
        return new AwsUrlResponse
        {
            Url = url
        };
    }

    public async Task<HttpResult> Get(DownloadRequest request)
    {
        var s3FileItem = await Db.LoadSingleByIdAsync<S3FileItem>(request.Id); // Use your ORM/DB context here

        if (s3FileItem == null)
            throw HttpError.NotFound($"S3FileItem with Id {request.Id} does not exist");


        var file = VirtualFileSources.GetFile(s3FileItem.GeometryFile.FilePath);

        if (file == null)
            throw HttpError.NotFound($"File at {s3FileItem.GeometryFile.FilePath} does not exist");

        return new HttpResult(file)
        {
            Headers =
            {
                [HttpHeaders.ContentDisposition] = $"attachment; filename={file.Name}",
                [HttpHeaders.ContentType] = MimeTypes.GetMimeType(file.Name)
            }
        };
    }
}