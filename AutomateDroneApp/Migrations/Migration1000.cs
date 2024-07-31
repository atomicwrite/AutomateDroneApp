using System.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using AutomateDroneApp.Data;
using AutomateDroneApp.ServiceModel;
using ServiceStack;
using ServiceStack.DataAnnotations;
using ServiceStack.OrmLite;

namespace AutomateDroneApp.Migrations;
public class Migration1003 : MigrationBase
{
    public override void Up()
    {
        
        Db.DropAndCreateTable<DroneProject>();
    }

    public override void Down()
    {
        
    }
}
public class Migration1002 : MigrationBase
{
    public override void Up()
    {
        
        Db.CreateTableIfNotExists<DroneProject>();
    }

    public override void Down()
    {
        
    }
}
public class Migration1001 : MigrationBase
{
    public override void Up()
    {
         
        Db.CreateTableIfNotExists<ApplicationUserFiles>();
    }

    public override void Down()
    {
        
    }
}
public class Migration1000 : MigrationBase
{
    public override void Up()
    {
        Db.CreateTableIfNotExists<S3File>();
        Db.CreateTableIfNotExists<S3FileItem>();
        Db.CreateTableIfNotExists<ApplicationUserFiles>();
    }

    public override void Down()
    {
        
    }
}