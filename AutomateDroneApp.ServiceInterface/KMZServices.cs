using AutomateDroneApp.Data;
using AutomateDroneApp.ServiceModel;
using ServiceStack;
using ServiceStack.DataAnnotations;

namespace AutomateDroneApp.ServiceInterface;


[ValidateIsAuthenticated]
[Tag("Maps")]
[AutoPopulate(nameof(DronePath.ApplicationUserId), Eval = "userAuthId")]
public class QueryDronePath : QueryDb<DronePath>
{
    public int? Id { get; set; }
    public string? Name { get; set; }
}


[Route("/donemap/create")]
public class CreateDronePath :  IReturn<DronePath>
{
    
    public List<LatLng>  LatLngs { get; set; }
    public int DroneProjectId { get; set; }
    public string Name { get; set; }
}

[ValidateIsAdmin]
public class QueryAppUser : QueryDb<ApplicationUser>
{
}

[ValidateIsAuthenticated]
[Tag("Files")]
[AutoFilter(QueryTerm.Ensure, nameof(S3FileItem.FileType), Eval = "`kmz`")]
[AutoPopulate(nameof(S3FileItem.ApplicationUserId), Eval = "userAuthId")]
public class QueryS3FileItems : QueryDb<S3FileItem>
{
    public FileAccessType? FileAccessTypes { get; set; }
    public int? Id { get; set; }
}

public interface IQueryFileItem
{
    public FileAccessType? FileAccessType { get; set; }
    public string? FileName { get; set; }
}

[ValidateIsAuthenticated]
[Tag("Projects")]
[AutoPopulate(nameof(DroneProject.ApplicationUserId), Eval = "userAuthId")]
public class QueryDroneProject : QueryDb<DroneProject>
{
    public string? Name { get; set; }
}

[ValidateIsAuthenticated]
[AutoPopulate(nameof(DroneProject.ApplicationUserId), Eval = "userAuthId")]
[Route("/project/create")]
[Tag("Projects")]
public class CreateDroneProject : ICreateDb<DroneProject>, IReturn<DroneProject>
{
    public string Name { get; set; }
}

 
[AutoFilter(QueryTerm.Ensure, nameof(DroneProject.ApplicationUserId), Eval = "userAuthId")]
[AutoPopulate(nameof(S3FileItem.ApplicationUserId), Eval = "userAuthId")]
[Route("/kmz/create")]
[Tag("Files")]
public class CreateS3FileItem : ICreateDb<S3FileItem>, IReturn<S3FileItem>, IFileItemRequest
{
    public FileAccessType? FileAccessType { get; set; }

    [Input(Type = "file"), UploadTo("s3")] public S3File GeometryFile { get; set; }
    [Reference] public DroneProject DroneProject { get; set; }
    [References(typeof(DroneProject))] public int DroneProjectId { get; set; }
    public string FileType { get; set; }
}

// [AutoPopulate(nameof(S3FileItem.ApplicationUserId), Eval = "userAuthId")]
// [Tag("Files")]
// public class UpdateS3FileItem : IUpdateDb<S3FileItem>, IReturn<S3FileItem>, IFileItemRequest
// {
//     public int Id { get; set; }
//     public FileAccessType? FileAccessType { get; set; }
//
//     [Input(Type = "file"), UploadTo("s3")] public S3File GeometryFile { get; set; }
//     public int DroneProjectId { get; set; }
// }

[ValidateIsAuthenticated]
[Tag("Files")]
public class DeleteS3FileItem : IDeleteDb<S3FileItem>, IReturnVoid
{
    public int Id { get; set; }
}