/* Options:
Date: 2024-07-30 15:26:20
Version: 8.31
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://localhost:5001

//GlobalNamespace: 
//MakePropertiesOptional: False
//AddServiceStackTypes: True
//AddResponseStatus: False
//AddImplicitVersion: 
//AddDescriptionAsComments: True
//IncludeTypes: 
//ExcludeTypes: 
//DefaultImports: 
*/

// @ts-nocheck

export interface IReturn<T>
{
    createResponse(): T;
}

export interface IReturnVoid
{
    createResponse(): void;
}

export interface IGet
{
}

export interface IHasSessionId
{
    sessionId?: string;
}

export interface IHasBearerToken
{
    bearerToken?: string;
}

export interface IPost
{
}

export interface IPut
{
}

export interface IDelete
{
}

export interface ICreateDb<Table>
{
}

export interface IUpdateDb<Table>
{
}

export interface IDeleteDb<Table>
{
}

// @DataContract
export class QueryBase
{
    // @DataMember(Order=1)
    public skip?: number;

    // @DataMember(Order=2)
    public take?: number;

    // @DataMember(Order=3)
    public orderBy: string;

    // @DataMember(Order=4)
    public orderByDesc: string;

    // @DataMember(Order=5)
    public include: string;

    // @DataMember(Order=6)
    public fields: string;

    // @DataMember(Order=7)
    public meta: { [index: string]: string; };

    public constructor(init?: Partial<QueryBase>) { (Object as any).assign(this, init); }
}

export class QueryData<T> extends QueryBase
{

    public constructor(init?: Partial<QueryData<T>>) { super(init); (Object as any).assign(this, init); }
}

export class QueryDb<T> extends QueryBase
{

    public constructor(init?: Partial<QueryDb<T>>) { super(init); (Object as any).assign(this, init); }
}

export class IdentityUser_1<TKey>
{
    public id: TKey;
    public userName?: string;
    public normalizedUserName?: string;
    public email?: string;
    public normalizedEmail?: string;
    public emailConfirmed: boolean;
    public passwordHash?: string;
    public securityStamp?: string;
    public concurrencyStamp?: string;
    public phoneNumber?: string;
    public phoneNumberConfirmed: boolean;
    public twoFactorEnabled: boolean;
    public lockoutEnd?: string;
    public lockoutEnabled: boolean;
    public accessFailedCount: number;

    public constructor(init?: Partial<IdentityUser_1<TKey>>) { (Object as any).assign(this, init); }
}

export class IdentityUser extends IdentityUser_1<string>
{

    public constructor(init?: Partial<IdentityUser>) { super(init); (Object as any).assign(this, init); }
}

export class ApplicationUser extends IdentityUser
{
    public firstName?: string;
    public lastName?: string;
    public displayName?: string;
    public profileUrl?: string;
    public facebookUserId?: string;
    public googleUserId?: string;
    public googleProfilePageUrl?: string;
    public microsoftUserId?: string;

    public constructor(init?: Partial<ApplicationUser>) { super(init); (Object as any).assign(this, init); }
}

export enum FileAccessType
{
    Private = 'Private',
    Team = 'Team',
    Public = 'Public',
}

export class DroneProject
{
    public id: number;
    public name: string;
    // @References("typeof(AutomateDroneApp.Data.ApplicationUser)")
    public applicationUserId: string;

    public constructor(init?: Partial<DroneProject>) { (Object as any).assign(this, init); }
}

export class S3File implements IFile
{
    public id: number;
    public fileName: string;
    public filePath: string;
    public contentType: string;
    public contentLength: number;
    // @References("typeof(AutomateDroneApp.ServiceModel.S3FileItem)")
    public sharedFileId: number;

    public constructor(init?: Partial<S3File>) { (Object as any).assign(this, init); }
}

export class S3FileItem implements IFileItem
{
    public id: number;
    public geometryFile: S3File;
    // @References("typeof(AutomateDroneApp.Data.ApplicationUser)")
    public applicationUserId: string;

    public droneProject: DroneProject;
    // @References("typeof(AutomateDroneApp.ServiceModel.DroneProject)")
    public droneProjectId: number;

    public constructor(init?: Partial<S3FileItem>) { (Object as any).assign(this, init); }
}

export interface IFileItemRequest
{
}

export interface IVirtualDirectory
{
}

export interface IVirtualPathProvider
{
    rootDirectory: IVirtualDirectory;
    virtualPathSeparator: string;
    realPathSeparator: string;
}

export interface IVirtualFile
{
    virtualPathProvider: IVirtualPathProvider;
    extension: string;
    length: number;
}

// @Flags()
export enum CacheControl
{
    None = 0,
    Public = 1,
    Private = 2,
    MustRevalidate = 4,
    NoCache = 8,
    NoStore = 16,
    NoTransform = 32,
    ProxyRevalidate = 64,
}

export interface IContentTypeWriter
{
}

// @Flags()
export enum RequestAttributes
{
    None = 0,
    Localhost = 1,
    LocalSubnet = 2,
    External = 4,
    Secure = 8,
    InSecure = 16,
    AnySecurityMode = 24,
    HttpHead = 32,
    HttpGet = 64,
    HttpPost = 128,
    HttpPut = 256,
    HttpDelete = 512,
    HttpPatch = 1024,
    HttpOptions = 2048,
    HttpOther = 4096,
    AnyHttpMethod = 8160,
    OneWay = 8192,
    Reply = 16384,
    AnyCallStyle = 24576,
    Soap11 = 32768,
    Soap12 = 65536,
    Xml = 131072,
    Json = 262144,
    Jsv = 524288,
    ProtoBuf = 1048576,
    Csv = 2097152,
    Html = 4194304,
    Jsonl = 8388608,
    MsgPack = 16777216,
    FormatOther = 33554432,
    AnyFormat = 67076096,
    Http = 67108864,
    MessageQueue = 134217728,
    Tcp = 268435456,
    Grpc = 536870912,
    EndpointOther = 1073741824,
    AnyEndpoint = 2080374784,
    InProcess = -2147483648,
    InternalNetworkAccess = -2147483645,
    AnyNetworkAccessType = -2147483641,
    Any = -1,
}

export interface IRequestPreferences
{
    acceptsBrotli: boolean;
    acceptsDeflate: boolean;
    acceptsGzip: boolean;
}

export interface IRequest
{
    originalRequest: Object;
    response: IResponse;
    operationName: string;
    verb: string;
    requestAttributes: RequestAttributes;
    requestPreferences: IRequestPreferences;
    dto: Object;
    contentType: string;
    isLocal: boolean;
    userAgent: string;
    cookies: { [index: string]: Cookie; };
    responseContentType: string;
    hasExplicitResponseContentType: boolean;
    items: { [index: string]: Object; };
    headers: NameValueCollection;
    queryString: NameValueCollection;
    formData: NameValueCollection;
    useBufferedStream: boolean;
    rawUrl: string;
    absoluteUri: string;
    userHostAddress: string;
    remoteIp: string;
    authorization: string;
    isSecureConnection: boolean;
    acceptTypes: string[];
    pathInfo: string;
    originalPathInfo: string;
    inputStream: string;
    contentLength: number;
    files: IHttpFile[];
    urlReferrer: string;
}

export interface IResponse
{
    originalResponse: Object;
    request: IRequest;
    statusCode: number;
    statusDescription: string;
    contentType: string;
    outputStream: string;
    dto: Object;
    useBufferedStream: boolean;
    isClosed: boolean;
    keepAlive: boolean;
    hasStarted: boolean;
    items: { [index: string]: Object; };
}

export class Forecast implements IGet
{
    public date: string;
    public temperatureC: number;
    public summary?: string;
    public temperatureF: number;

    public constructor(init?: Partial<Forecast>) { (Object as any).assign(this, init); }
}

// @DataContract
export class ResponseError
{
    // @DataMember(Order=1)
    public errorCode: string;

    // @DataMember(Order=2)
    public fieldName: string;

    // @DataMember(Order=3)
    public message: string;

    // @DataMember(Order=4)
    public meta: { [index: string]: string; };

    public constructor(init?: Partial<ResponseError>) { (Object as any).assign(this, init); }
}

// @DataContract
export class ResponseStatus
{
    // @DataMember(Order=1)
    public errorCode: string;

    // @DataMember(Order=2)
    public message: string;

    // @DataMember(Order=3)
    public stackTrace: string;

    // @DataMember(Order=4)
    public errors: ResponseError[];

    // @DataMember(Order=5)
    public meta: { [index: string]: string; };

    public constructor(init?: Partial<ResponseStatus>) { (Object as any).assign(this, init); }
}

export interface IFileItem
{
    id: number;
}

export interface IFile
{
    id: number;
    fileName: string;
    filePath: string;
    contentType: string;
    contentLength: number;
    sharedFileId: number;
}

export interface IHttpFile
{
    name: string;
    fileName: string;
    contentLength: number;
    contentType: string;
    inputStream: string;
}

export class AwsUrlResponse
{
    public url: string;

    public constructor(init?: Partial<AwsUrlResponse>) { (Object as any).assign(this, init); }
}

export class HttpResult
{
    public responseText: string;
    public responseStream: string;
    public fileInfo: FileInfo;
    public virtualFile: IVirtualFile;
    public contentType: string;
    public headers: { [index: string]: string; };
    public cookies: Cookie[];
    public eTag: string;
    public age?: string;
    public maxAge?: string;
    public expires?: string;
    public lastModified?: string;
    public cacheControl: CacheControl;
    public resultScope: Func<IDisposable>;
    public allowsPartialResponse: boolean;
    public options: { [index: string]: string; };
    public status: number;
    public statusCode: HttpStatusCode;
    public statusDescription: string;
    public response: Object;
    public responseFilter: IContentTypeWriter;
    public requestContext: IRequest;
    public view: string;
    public template: string;
    public paddingLength: number;
    public isPartialRequest: boolean;

    public constructor(init?: Partial<HttpResult>) { (Object as any).assign(this, init); }
}

export class HelloResponse
{
    public result: string;

    public constructor(init?: Partial<HelloResponse>) { (Object as any).assign(this, init); }
}

// @DataContract
export class RegisterResponse implements IHasSessionId, IHasBearerToken
{
    // @DataMember(Order=1)
    public userId: string;

    // @DataMember(Order=2)
    public sessionId: string;

    // @DataMember(Order=3)
    public userName: string;

    // @DataMember(Order=4)
    public referrerUrl: string;

    // @DataMember(Order=5)
    public bearerToken: string;

    // @DataMember(Order=6)
    public refreshToken: string;

    // @DataMember(Order=7)
    public refreshTokenExpiry?: string;

    // @DataMember(Order=8)
    public roles: string[];

    // @DataMember(Order=9)
    public permissions: string[];

    // @DataMember(Order=10)
    public redirectUrl: string;

    // @DataMember(Order=11)
    public responseStatus: ResponseStatus;

    // @DataMember(Order=12)
    public meta: { [index: string]: string; };

    public constructor(init?: Partial<RegisterResponse>) { (Object as any).assign(this, init); }
}

export class Todo
{
    public id: number;
    public text: string;
    public isFinished: boolean;

    public constructor(init?: Partial<Todo>) { (Object as any).assign(this, init); }
}

// @DataContract
export class QueryResponse<Todo>
{
    // @DataMember(Order=1)
    public offset: number;

    // @DataMember(Order=2)
    public total: number;

    // @DataMember(Order=3)
    public results: Todo[];

    // @DataMember(Order=4)
    public meta: { [index: string]: string; };

    // @DataMember(Order=5)
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<QueryResponse<Todo>>) { (Object as any).assign(this, init); }
}

// @DataContract
export class AuthenticateResponse implements IHasSessionId, IHasBearerToken
{
    // @DataMember(Order=1)
    public userId: string;

    // @DataMember(Order=2)
    public sessionId: string;

    // @DataMember(Order=3)
    public userName: string;

    // @DataMember(Order=4)
    public displayName: string;

    // @DataMember(Order=5)
    public referrerUrl: string;

    // @DataMember(Order=6)
    public bearerToken: string;

    // @DataMember(Order=7)
    public refreshToken: string;

    // @DataMember(Order=8)
    public refreshTokenExpiry?: string;

    // @DataMember(Order=9)
    public profileUrl: string;

    // @DataMember(Order=10)
    public roles: string[];

    // @DataMember(Order=11)
    public permissions: string[];

    // @DataMember(Order=12)
    public responseStatus: ResponseStatus;

    // @DataMember(Order=13)
    public meta: { [index: string]: string; };

    public constructor(init?: Partial<AuthenticateResponse>) { (Object as any).assign(this, init); }
}

// @Route("/aws-url/{Id}")
export class AwsUrlRequest implements IReturn<AwsUrlResponse>
{
    public id: number;

    public constructor(init?: Partial<AwsUrlRequest>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'AwsUrlRequest'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new AwsUrlResponse(); }
}

// @Route("/download/{Id}")
export class DownloadRequest implements IReturn<HttpResult>
{
    public id: number;

    public constructor(init?: Partial<DownloadRequest>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DownloadRequest'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new HttpResult(); }
}

// @Route("/hello/{Name}")
export class Hello implements IReturn<HelloResponse>, IGet
{
    public name: string;

    public constructor(init?: Partial<Hello>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'Hello'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new HelloResponse(); }
}

export class GetWeatherForecast implements IReturn<Forecast[]>, IGet
{
    public date?: string;

    public constructor(init?: Partial<GetWeatherForecast>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetWeatherForecast'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new Array<Forecast>(); }
}

/** @description Sign Up */
// @Api(Description="Sign Up")
// @DataContract
export class Register implements IReturn<RegisterResponse>, IPost
{
    // @DataMember(Order=1)
    public userName: string;

    // @DataMember(Order=2)
    public firstName: string;

    // @DataMember(Order=3)
    public lastName: string;

    // @DataMember(Order=4)
    public displayName: string;

    // @DataMember(Order=5)
    public email: string;

    // @DataMember(Order=6)
    public password: string;

    // @DataMember(Order=7)
    public confirmPassword: string;

    // @DataMember(Order=8)
    public autoLogin?: boolean;

    // @DataMember(Order=10)
    public errorView: string;

    // @DataMember(Order=11)
    public meta: { [index: string]: string; };

    public constructor(init?: Partial<Register>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'Register'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new RegisterResponse(); }
}

// @Route("/confirm-email")
export class ConfirmEmail implements IReturnVoid, IGet
{
    public userId: string;
    public code: string;
    public returnUrl?: string;

    public constructor(init?: Partial<ConfirmEmail>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'ConfirmEmail'; }
    public getMethod() { return 'GET'; }
    public createResponse() {}
}

// @Route("/todos", "GET")
export class QueryTodos extends QueryData<Todo> implements IReturn<QueryResponse<Todo>>
{
    public id?: number;
    public ids?: number[];
    public textContains?: string;

    public constructor(init?: Partial<QueryTodos>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryTodos'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<Todo>(); }
}

// @Route("/todos", "POST")
export class CreateTodo implements IReturn<Todo>, IPost
{
    // @Validate(Validator="NotEmpty")
    public text: string;

    public constructor(init?: Partial<CreateTodo>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateTodo'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new Todo(); }
}

// @Route("/todos/{Id}", "PUT")
export class UpdateTodo implements IReturn<Todo>, IPut
{
    public id: number;
    // @Validate(Validator="NotEmpty")
    public text: string;

    public isFinished: boolean;

    public constructor(init?: Partial<UpdateTodo>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateTodo'; }
    public getMethod() { return 'PUT'; }
    public createResponse() { return new Todo(); }
}

// @Route("/todos/{Id}", "DELETE")
export class DeleteTodo implements IReturnVoid, IDelete
{
    public id: number;

    public constructor(init?: Partial<DeleteTodo>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteTodo'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

// @Route("/todos", "DELETE")
export class DeleteTodos implements IReturnVoid, IDelete
{
    public ids: number[];

    public constructor(init?: Partial<DeleteTodos>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteTodos'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

/** @description Sign In */
// @Route("/auth", "GET,POST")
// @Route("/auth/{provider}", "POST")
// @Api(Description="Sign In")
// @DataContract
export class Authenticate implements IReturn<AuthenticateResponse>, IPost
{
    /** @description AuthProvider, e.g. credentials */
    // @DataMember(Order=1)
    public provider: string;

    // @DataMember(Order=2)
    public userName: string;

    // @DataMember(Order=3)
    public password: string;

    // @DataMember(Order=4)
    public rememberMe?: boolean;

    // @DataMember(Order=5)
    public accessToken: string;

    // @DataMember(Order=6)
    public accessTokenSecret: string;

    // @DataMember(Order=7)
    public returnUrl: string;

    // @DataMember(Order=8)
    public errorView: string;

    // @DataMember(Order=9)
    public meta: { [index: string]: string; };

    public constructor(init?: Partial<Authenticate>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'Authenticate'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new AuthenticateResponse(); }
}

// @ValidateRequest(Validator="IsAdmin")
export class QueryAppUser extends QueryDb<ApplicationUser> implements IReturn<QueryResponse<ApplicationUser>>
{

    public constructor(init?: Partial<QueryAppUser>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryAppUser'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<ApplicationUser>(); }
}

// @ValidateRequest(Validator="IsAuthenticated")
export class QueryS3FileItems extends QueryDb<S3FileItem> implements IReturn<QueryResponse<S3FileItem>>
{
    public fileAccessTypes?: FileAccessType;
    public id?: number;

    public constructor(init?: Partial<QueryS3FileItems>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryS3FileItems'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<S3FileItem>(); }
}

// @ValidateRequest(Validator="IsAuthenticated")
export class QueryDroneProject extends QueryDb<DroneProject> implements IReturn<QueryResponse<DroneProject>>
{
    public name?: string;

    public constructor(init?: Partial<QueryDroneProject>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryDroneProject'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryResponse<DroneProject>(); }
}

// @Route("/project/create")
// @ValidateRequest(Validator="IsAuthenticated")
export class CreateDroneProject implements IReturn<DroneProject>, ICreateDb<DroneProject>
{
    public name: string;

    public constructor(init?: Partial<CreateDroneProject>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateDroneProject'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new DroneProject(); }
}

// @Route("/kmz/create")
export class CreateS3FileItem implements IReturn<S3FileItem>, ICreateDb<S3FileItem>, IFileItemRequest
{
    public fileAccessType?: FileAccessType;
    public geometryFile: S3File;
    public droneProject: DroneProject;
    // @References("typeof(AutomateDroneApp.ServiceModel.DroneProject)")
    public droneProjectId: number;

    public constructor(init?: Partial<CreateS3FileItem>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateS3FileItem'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new S3FileItem(); }
}

export class UpdateS3FileItem implements IReturn<S3FileItem>, IUpdateDb<S3FileItem>, IFileItemRequest
{
    public id: number;
    public fileAccessType?: FileAccessType;
    public geometryFile: S3File;
    public droneProjectId: number;

    public constructor(init?: Partial<UpdateS3FileItem>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateS3FileItem'; }
    public getMethod() { return 'PUT'; }
    public createResponse() { return new S3FileItem(); }
}

// @ValidateRequest(Validator="IsAuthenticated")
export class DeleteS3FileItem implements IReturnVoid, IDeleteDb<S3FileItem>
{
    public id: number;

    public constructor(init?: Partial<DeleteS3FileItem>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteS3FileItem'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

