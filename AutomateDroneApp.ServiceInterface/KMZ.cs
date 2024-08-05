using AutomateDroneApp.Data;
using ServiceStack;
using ServiceStack.Auth;
using ServiceStack.DataAnnotations;

namespace AutomateDroneApp.ServiceModel;

public class LatLng
{
    public double Lat { get; set; }
    public double Lng { get; set; }
    public double Altitude { get; set; }
}

public class DronePath
{
    [AutoIncrement] public int Id { get; set; }
    public string Name { get; set; }

    [References(typeof(ApplicationUser))] public string ApplicationUserId { get; set; }

    [ForeignKey(typeof(DroneProject), OnDelete = "CASCADE")]

    public int DroneProjectId { get; set; }

    [Reference] public DroneProject DroneProject { get; set; }

    [Reference] public S3DronePathFile S3DronePathFile { get; set; }

    

    public List<LatLng> LatLngs { get; set; }
}

public class DroneProject
{
    [AutoIncrement] public int Id { get; set; }
    public string Name { get; set; }

    [References(typeof(ApplicationUser))] public string ApplicationUserId { get; set; }
}

public class S3File : IFile
{
    [PrimaryKey] [AutoIncrement] public int Id { get; set; }
    public string FileName { get; set; }

    [Format(FormatMethods.Attachment)] public string FilePath { get; set; }
    public string ContentType { get; set; }

    [Format(FormatMethods.Bytes)] public long ContentLength { get; set; }

    [ForeignKey(typeof(S3FileItem), OnDelete = "CASCADE")]

    public int SharedFileId { get; set; }
}

public class S3DronePathFile : IFile
{
    [PrimaryKey] [AutoIncrement] public int Id { get; set; }
    public string FileName { get; set; }

    [Format(FormatMethods.Attachment)] public string FilePath { get; set; }
    public string ContentType { get; set; }

    [Format(FormatMethods.Bytes)] public long ContentLength { get; set; }

    [ForeignKey(typeof(S3DronePathFileItem), OnDelete = "CASCADE")]

    public int DronePathId { get; set; }
}

public class ApplicationUserFiles
{
    [PrimaryKey] [AutoIncrement] public int Id { get; set; }
    [References(typeof(ApplicationUser))] public string? ApplicationUserId { get; set; }
    [References(typeof(S3FileItem))] public int? S3FileItemId { get; set; }
}

public record FileItemWithFile(IFileItem FileItem, IFile File);

public class S3DronePathFileItem : IFileItem
{
    [PrimaryKey] [AutoIncrement] public int Id { get; set; }


    [Reference] public S3DronePathFile GeometryFile { get; set; }


    [References(typeof(ApplicationUser))] public string ApplicationUserId { get; set; }


    [Reference] public DroneProject DroneProject { get; set; }

    [ForeignKey(typeof(DroneProject), OnDelete = "CASCADE")]

    public int DroneProjectId { get; set; }

    public string FileType { get; set; }
}

public class S3FileItem : IFileItem
{
    [PrimaryKey] [AutoIncrement] public int Id { get; set; }


    [Reference] public S3File GeometryFile { get; set; }


    [References(typeof(ApplicationUser))] public string ApplicationUserId { get; set; }


    [Reference]

    public DroneProject DroneProject { get; set; }

    [ForeignKey(typeof(DroneProject), OnDelete = "CASCADE")]

    public int DroneProjectId { get; set; }

    public string FileType { get; set; }
}

public enum FileAccessType
{
    Private,
    Team,
    Public
}

public interface IFileItem
{
    public int Id { get; set; }
}

public interface IFileItemRequest
{
}

public interface IFile
{
    public int Id { get; set; }
    public string FileName { get; set; }
    public string FilePath { get; set; }
    public string ContentType { get; set; }
    public long ContentLength { get; set; } 
}