using System.Text;
using AutomateDroneApp.Data;
using AutomateDroneApp.ServiceModel;
using ServiceStack;
using ServiceStack.IO;
using ServiceStack.OrmLite;
using SharpKml.Base;
using SharpKml.Dom;
using SharpKml.Engine;

namespace AutomateDroneApp.ServiceInterface;

public class FileServices : Service
{
    private readonly AwsFileSigner _awsFileSigner = new AwsFileSigner();

    public override void Dispose()
    {
        _awsFileSigner.Dispose();
        base.Dispose();
    }

    [Authenticate]
    public async Task<DronePath> Post(CreateDronePath request)
    {
        try
        {
            var droneProject = Db.Single<DroneProject>(request.DroneProjectId);

            var time = DateTimeOffset.Now.ToUnixTimeSeconds();
            var sess = SessionAs<CustomUserSession>();
            var polyLine = new LineString
            {
                Coordinates = [],
            };
            foreach (var requestLatLng in request.LatLngs)
            {
                polyLine.Coordinates.Add(new Vector(requestLatLng.Lat, requestLatLng.Lng, requestLatLng.Altitude));
            }

            var placeMark = new Placemark()
            {
                Name = "Drone Path",
                Geometry = polyLine,
            };
            var kml = new Kml
            {
                Feature = placeMark
            };

            var serializer = new Serializer();
            serializer.Serialize(kml);
            var userId = sess.UserAuthId;
            var fileName = request.Name;
            var filePath = $"/s3/{userId}/kmz/{time}/drone_path.kmz";


            var utfString = WriteKmzToAmz(serializer, filePath);

            S3DronePathFile file = new S3DronePathFile()
            {
                FilePath = filePath,
                ContentType = "application/vnd.google-earth.kmz",
                ContentLength = utfString.Length,
                FileName = fileName,
            };
            S3DronePathFileItem fileItem = new S3DronePathFileItem()
            {
                DroneProject = droneProject,
                DroneProjectId = droneProject.Id,
                ApplicationUserId = sess.UserAuthId,
                FileType = "drone"
                //GeometryFile = file
            };

            //fileItem.Id = (int)Db.Insert(fileItem, true);
            //file.SharedFileId = fileItem.Id;
            //file.Id = (int)Db.Insert(file, true);
            fileItem.GeometryFile = file;

            Db.Save(fileItem, true);

            var droneMap = new DronePath()
            {
                DroneProject = droneProject,
                DroneProjectId = droneProject.Id,
                ApplicationUserId = sess.UserAuthId,
                LatLngs = request.LatLngs,
                S3DronePathFile = file,
             
              
                Name = request.Name
            };
            Db.Save(droneMap, true);
            
            return droneMap;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    private string WriteKmzToAmz(Serializer serializer, string filePath)
    {
        using var memStream = new MemoryStream();
        var serializerXml = serializer.Xml;
        memStream.Write(serializerXml);
        memStream.Seek(0, SeekOrigin.Begin);

        //
        var kmzFile = KmlFile.Load(memStream);
        using KmzFile kmz = KmzFile.Create(kmzFile);
        using var kmzOut = new MemoryStream();
        Serializer serializerKMZ = new Serializer();
        serializerKMZ.Serialize(kmzFile.Root);
        kmzOut.Write(serializerKMZ.Xml);

        var readOnlyMemory = kmzOut.ToArray();
        string utfString = Encoding.UTF8.GetString(readOnlyMemory, 0, readOnlyMemory.Length);
        VirtualFileSources.WriteFile(filePath, utfString);
        return utfString;
    }

    [Authenticate]
    public async Task<AwsUrlResponse> Get(AwsUrlRequest request)
    {
        switch (request.FileType)
        {
            case "kmz":
                var s3FileItem = await Db.LoadSingleByIdAsync<S3FileItem>(request.Id); // Use your ORM/DB context here        


                if (s3FileItem == null)
                    throw HttpError.NotFound($"S3FileItem with Id {request.Id} does not exist");


                var geometryFileFilePath = s3FileItem.GeometryFile.FilePath;
                var url = await _awsFileSigner.GenerateUrl(s3FileItem.GeometryFile.FilePath.Substring(1));
                return new AwsUrlResponse
                {
                    Url = url
                };

            case "drone-path":
                var s3DronePathFileItem = await Db.LoadSingleByIdAsync<S3DronePathFileItem>(request.Id); // Use your ORM/DB context here        


                if (s3DronePathFileItem == null)
                    throw HttpError.NotFound($"s3DronePathFileItem with Id {request.Id} does not exist");

                var droneGeometryFileFilePath = s3DronePathFileItem.GeometryFile.FilePath;
                var url2 = await _awsFileSigner.GenerateUrl(s3DronePathFileItem.GeometryFile.FilePath.Substring(1));
                return new AwsUrlResponse
                {
                    Url = url2
                };
            default:
                return null;
        }
    }

    [Authenticate]
    public async Task<HttpResult?> Get(DownloadRequest request)
    {
        switch (request.FileType)
        {
            case "kmz":
                var s3FileItem = await Db.LoadSingleByIdAsync<S3FileItem>(request.Id); // Use your ORM/DB context here        


                if (s3FileItem == null)
                    throw HttpError.NotFound($"S3FileItem with Id {request.Id} does not exist");


                var geometryFileFilePath = s3FileItem.GeometryFile.FilePath;
                return GetAwsFile(geometryFileFilePath);

            case "drone-path":
                var s3DronePathFileItem = await Db.LoadSingleByIdAsync<S3DronePathFileItem>(request.Id); // Use your ORM/DB context here        


                if (s3DronePathFileItem == null)
                    throw HttpError.NotFound($"s3DronePathFileItem with Id {request.Id} does not exist");

                var droneGeometryFileFilePath = s3DronePathFileItem.GeometryFile.FilePath;
                return GetAwsFile(droneGeometryFileFilePath);
            default:
                return null;
        }
    }

    private HttpResult? GetAwsFile(string geometryFileFilePath)
    {
        var file = VirtualFileSources.GetFile(geometryFileFilePath);

        if (file == null)
            throw HttpError.NotFound($"File at {geometryFileFilePath} does not exist");

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