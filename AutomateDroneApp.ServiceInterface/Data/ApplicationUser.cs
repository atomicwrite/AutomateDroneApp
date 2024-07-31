
using ServiceStack;
using ServiceStack.DataAnnotations;

namespace AutomateDroneApp.Data;
 

using Microsoft.AspNetCore.Identity;
[Alias("AspNetUsers")] 
public class ApplicationUser : IdentityUser 
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? DisplayName { get; set; }
    [Format(FormatMethods.IconRounded)]
    [Input(Type = "file"), UploadTo("users")]
    public string? ProfileUrl { get; set; }
    public string? FacebookUserId { get; set; }
    public string? GoogleUserId { get; set; }
    public string? GoogleProfilePageUrl { get; set; }
    public string? MicrosoftUserId { get; set; }
}

