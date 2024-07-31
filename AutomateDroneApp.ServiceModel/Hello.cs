using ServiceStack;

namespace AutomateDroneApp.ServiceModel; 

[Route("/download/{Id}")]
public class DownloadRequest
{
    public int Id { get; set; }
}
 
public class AwsUrlResponse
{
    public string Url { get; set; }
}

[Route("/aws-url/{Id}")]
public class AwsUrlRequest : IReturn<AwsUrlResponse>
{
    public int Id { get; set; }
}
[Route("/hello/{Name}")]
public class Hello : IGet, IReturn<HelloResponse>
{
    public required string Name { get; set; }
}

public class HelloResponse
{
    public required string Result { get; set; }
}

public class GetWeatherForecast : IGet, IReturn<Forecast[]>
{
    public required DateOnly? Date { get; set; }
}

public record Forecast(DateOnly Date, int TemperatureC, string? Summary) : IGet, IReturn<Forecast[]>
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
