using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using ServiceStack;

namespace AutomateDroneApp.ServiceInterface;

public class AwsFileSigner
{
    private readonly AmazonS3Client _s3Client = new(RegionEndpoint.USWest1);

    public void Dispose()
    {
        _s3Client.Dispose();
    }

    public async Task<string> GenerateUrl(string objectKey)
    {
        const string bucketName = "droneappuploadbucket";

        const double timeoutDuration = 1;


        AWSConfigsS3.UseSignatureVersion4 = true;


        return await GeneratePresignedUrl(bucketName, objectKey, timeoutDuration);
    }

    private async Task<string> GeneratePresignedUrl(string bucketName, string objectKey, double duration)
    {
        try
        {
            var request = new GetPreSignedUrlRequest()
            {
                BucketName = bucketName,
                Key = objectKey,
                Expires = DateTime.UtcNow.AddHours(duration),
            };
            return await _s3Client.GetPreSignedURLAsync(request);
        }
        catch (AmazonS3Exception ex)
        {
            throw HttpError.NotFound(ex.Message);
        }
    }
}