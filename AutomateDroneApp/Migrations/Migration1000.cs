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
    
    
public class Migration1003: MigrationBase
{
    public override void Up()
    {
     
        Db.CreateTableIfNotExists<DroneProject>();
   
        
    }

    public override void Down()
    {
    }
}
public class Migration1002: MigrationBase
{
    public override void Up()
    {
     
        Db.CreateTableIfNotExists<DronePath>();
   
        
    }

    public override void Down()
    {
    }
}
  
public class Migration1001: MigrationBase
{
    public override void Up()
    {
     
        Db.CreateTableIfNotExists<DroneProject>();
        Db.CreateTableIfNotExists<S3FileItem>();
        Db.CreateTableIfNotExists<S3File>();
      
        
        Db.CreateTableIfNotExists<ApplicationUserFiles>();
        Db.CreateTableIfNotExists<DronePath>();
        Db.CreateTableIfNotExists<S3DronePathFileItem>();
        Db.CreateTableIfNotExists<S3DronePathFile>();
        
    }

    public override void Down()
    {
    }
}
public class Migration1000 : MigrationBase
{
    public override void Up()
    {
        Db.DropAndCreateTable<DroneProject>();
        Db.DropAndCreateTable<S3FileItem>();
        Db.DropAndCreateTable<S3File>();
      
        
        Db.DropAndCreateTable<ApplicationUserFiles>();
        Db.DropAndCreateTable<DronePath>();
        Db.DropAndCreateTable<S3DronePathFileItem>();
        Db.DropAndCreateTable<S3DronePathFile>();
        
    }

    public override void Down()
    {
    }
}