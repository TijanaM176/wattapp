using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using API.Models.Devices;
using System.Security.Cryptography;
using System.Text;

namespace API.Models.Users;

public partial class RegContext : DbContext
{
    public RegContext()
    {
    }

    public RegContext(DbContextOptions<RegContext> options)
        : base(options)
    {
    }

    public virtual DbSet<City> Cities { get; set; }

    public DbSet<DeviceInfo> Devices { get; set; }

    public DbSet<DeviceType> DeviceTypes { get; set; }

    public DbSet<DeviceCategory> DeviceCategories { get; set; }

    public virtual DbSet<Dso> Dsos { get; set; }

    public virtual DbSet<ElectricityPrice> ElectricityPrices { get; set; }

    public virtual DbSet<Neigborhood> Neigborhoods { get; set; }

    public virtual DbSet<Prosumer> Prosumers { get; set; }

    public virtual DbSet<ProsumerLink> ProsumerLinks { get; set; }

    public virtual DbSet<Region> Regions { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlite("Data Source=Reg.db");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        // baza ignorise refreshTokene
        modelBuilder.Entity<Prosumer>().Ignore(x => x.RefreshToken);
        modelBuilder.Entity<Dso>().Ignore(x => x.RefreshToken);
        //modelBuilder.Entity<Prosumer>().Ignore(x => x.TokenExpiry);
        //modelBuilder.Entity<Dso>().Ignore(x => x.TokenExpiry);


        modelBuilder.Entity<City>(entity =>
        {
            entity.ToTable("City");

            entity.Property(e => e.Name).HasColumnType("nvarchar(20)");

            entity.HasMany(c => c.Neighborhoods).WithOne(n => n.City).HasForeignKey(n => n.CityId);
        });

        modelBuilder.Entity<DeviceInfo>(entity =>
        {
            entity.ToTable("DeviceInfo");

            entity.HasKey(d => d.Id);
            entity.Property(d => d.Id).ValueGeneratedOnAdd();
            entity.Property(d => d.Name).HasMaxLength(30);
            entity.Property(d => d.Manufacturer).HasMaxLength(30);
            entity.HasOne(d => d.Category).WithMany(c => c.Devices).HasForeignKey(d => d.CategoryId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(d => d.Type).WithMany(t => t.Devices).HasForeignKey(d => d.TypeId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<DeviceType>(entity =>
        {
            entity.ToTable("DeviceType");
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Id).ValueGeneratedOnAdd();
            entity.Property(t => t.Name).HasMaxLength(30);
            entity.HasOne(t => t.Category).WithMany(c => c.Types).HasForeignKey(t => t.CategoryId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<DeviceCategory>(entity =>
        {
            entity.ToTable("DeviceCategory");
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Id).ValueGeneratedOnAdd();
            entity.Property(c => c.Name).HasMaxLength(100);
        });

        modelBuilder.Entity<Dso>(entity =>
        {
            entity.ToTable("DSO");

            entity.HasIndex(e => e.Username, "IX_DSO_Username").IsUnique();

            entity.Property(e => e.FirstName).HasColumnType("nvarchar (10)");
            entity.Property(e => e.HashPassword).HasColumnType("varbinary (2048)");
            entity.Property(e => e.LastName).HasColumnType("nvarchar (20)");
            entity.Property(e => e.SaltPassword).HasColumnType("varbinary (2048)");
            entity.Property(e => e.Username).HasColumnType("nvarchar (30)");

            entity.HasOne(d => d.Region).WithMany(p => p.Dsos).HasForeignKey(d => d.RegionId).OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.Role).WithMany(p => p.Dsos).HasForeignKey(d => d.RoleId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ElectricityPrice>(entity =>
        {
            entity.ToTable("ElectricityPrices");
            entity.HasKey(e => e.Timestamp);
            entity.Property(e => e.Price).ValueGeneratedOnAdd();
        });

        modelBuilder.Entity<Neigborhood>(entity =>
        {
            entity.ToTable("Neigborhood");

            entity.Property(e => e.NeigbName).HasColumnType("nvarchar(50)");

            entity.HasMany(n => n.Prosumers).WithOne(p => p.Neigborhood).HasForeignKey(p => p.NeigborhoodId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Prosumer>(entity =>
        {
            entity.ToTable("Prosumer");

            entity.HasIndex(e => e.Username, "IX_Prosumer_Username").IsUnique();

            entity.Property(e => e.Address).HasColumnType("VARCHAR (120)");
            entity.Property(e => e.CityId).HasColumnName("CityID");
            entity.Property(e => e.Email).HasColumnType("nvarchar (20)");
            entity.Property(e => e.FirstName).HasColumnType("nvarchar (10)");
            entity.Property(e => e.HashPassword).HasColumnType("varbinary (2048)");
            entity.Property(e => e.LastName).HasColumnType("nvarchar (20)");
            entity.Property(e => e.Latitude).HasColumnType("nvarchar (10)");
            entity.Property(e => e.Longitude).HasColumnType("nvarchar (10)");
            entity.Property(e => e.NeigborhoodId).HasColumnName("NeigborhoodID");
            entity.Property(e => e.RegionId).HasColumnName("RegionID");
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.SaltPassword).HasColumnType("varbinary (2048)");
            entity.Property(e => e.Username).HasColumnType("nvarchar (30)");

            entity.HasOne(d => d.City).WithMany(p => p.Prosumers).HasForeignKey(d => d.CityId).OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.Neigborhood).WithMany(p => p.Prosumers).HasForeignKey(d => d.NeigborhoodId).OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.Region).WithMany(p => p.Prosumers).HasForeignKey(d => d.RegionId).OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.Role).WithMany(p => p.Prosumers).HasForeignKey(d => d.RoleId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ProsumerLink>(entity =>
        {
            entity.ToTable("ProsumerLinks");

            entity.HasKey(l => l.Id);

            entity.HasOne(pl => pl.Prosumer).WithMany(p => p.Links).HasForeignKey(pl => pl.ProsumerId).OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(pl => pl.Device).WithMany(d => d.Links).HasForeignKey(pl => pl.ModelId).OnDelete(DeleteBehavior.Cascade);

        });

        modelBuilder.Entity<Region>(entity =>
        {
            entity.ToTable("Region");

            entity.HasIndex(e => e.RegionName, "IX_Region_RegionName").IsUnique();

            entity.Property(e => e.RegionName).HasColumnType("nvarchar(20)");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.ToTable("Role");

            entity.HasIndex(e => e.Id, "IX_Role_Id").IsUnique();

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.RoleName).HasColumnType("nvarchar(10)");
        });

        modelBuilder.Entity<City>().HasData(
            new City { Id = 1, Name = "Kragujevac" },
            new City { Id = 2, Name = "Topola" },
            new City { Id = 3, Name = "Čačak" },
            new City { Id = 4, Name = "Beograd" },
            new City { Id = 5, Name = "Smederevo" },
            new City { Id = 6, Name = "Lazarevac" },
            new City { Id = 7, Name = "Smederevska Palanka" },
            new City { Id = 8, Name = "Mladenovac" },
            new City { Id = 9, Name = "Aranđelovac" },
            new City { Id = 10, Name = "Gornji Milanovac" },
            new City { Id = 11, Name = "Rekovac" },
            new City { Id = 12, Name = "Kraljevo" },
            new City { Id = 13, Name = "Jagodina" },
            new City { Id = 14, Name = "Velika Plana" },
            new City { Id = 15, Name = "Varvarin" }
            );

        modelBuilder.Entity<DeviceCategory>().HasData(
            new DeviceCategory { Id = 1, Name = "Consumer" },
            new DeviceCategory { Id = 2, Name = "Producer" },
            new DeviceCategory { Id = 3, Name = "Storage" }
            );

        modelBuilder.Entity<DeviceInfo>().HasData(
            new DeviceInfo { Id = "6420b43190d65ae1554350a9", Name = "Frižider KG2500F", CategoryId = 1, TypeId = 1, Manufacturer = "VOX", Wattage = 0.04},
            new DeviceInfo { Id = "6420b43190d65ae1554350ae", Name = "TV 50UQ80003LB.AEU", CategoryId = 1, TypeId = 2, Manufacturer = "LG", Wattage = 0.18 },
            new DeviceInfo { Id = "6420b43190d65ae1554350ab", Name = "Kombinovani frižider NRK6191EW4", CategoryId = 1, TypeId = 1, Manufacturer = "Gorenje", Wattage = 0.083 },
            new DeviceInfo { Id = "6420b43190d65ae1554350aa", Name = "Kombinovani frižider GBF71PZDMN", CategoryId = 1, TypeId = 1, Manufacturer = "LG", Wattage = 0.069 },
            new DeviceInfo { Id = "6420b43190d65ae1554350ad", Name = "TV UE55AU7172UXXH SMART", CategoryId = 1, TypeId = 2, Manufacturer = "SAMSUNG", Wattage = 0.071 },
            new DeviceInfo { Id = "6420b43190d65ae1554350ac", Name = "SMART Televizor 32PHS6605/12", CategoryId = 1, TypeId = 2, Manufacturer = "Philips", Wattage = 0.12 },
            new DeviceInfo { Id = "6420b43190d65ae1554350b1", Name = "GE6A40WB Električni šporet", CategoryId = 1, TypeId = 3, Manufacturer = "Gorenje", Wattage = 2.1 },
            new DeviceInfo { Id = "6420b43190d65ae1554350b0", Name = "Električni šporet CS6400SX", CategoryId = 1, TypeId = 3, Manufacturer = "Tesla", Wattage = 1.5 },
            new DeviceInfo { Id = "6420b43190d65ae1554350af", Name = "FSE64320DS Kombinovani šporet", CategoryId = 1, TypeId = 3, Manufacturer = "BEKO", Wattage = 2.3 },
            new DeviceInfo { Id = "6420b43190d65ae1554350b4", Name = "Ventilator FS-451TB", CategoryId = 1, TypeId = 4, Manufacturer = "VIVAX", Wattage = 0.03 },
            new DeviceInfo { Id = "6420b43190d65ae1554350b3", Name = "Klima uređaj 180/BBFDB 181", CategoryId = 1, TypeId = 4, Manufacturer = "BEKO", Wattage = 1.8 },
            new DeviceInfo { Id = "6420b43190d65ae1554350b2", Name = "TT27X81-09410A Klima uređaj", CategoryId = 1, TypeId = 4, Manufacturer = "Tesla", Wattage = 0.73 },
            new DeviceInfo { Id = "6420b43190d65ae1554350b6", Name = "Mikrotalasna rerna NN-DF383BEPG", CategoryId = 1, TypeId = 5, Manufacturer = "Panasonic", Wattage = 0.4 },
            new DeviceInfo { Id = "6420b43190d65ae1554350b5", Name = "Mikrotalasna rerna MH6336GIB", CategoryId = 1, TypeId = 5, Manufacturer = "LG", Wattage = 0.6 },
            new DeviceInfo { Id = "6420b43190d65ae1554350b8", Name = "Mašina za pranje sudova SMS4HVW33E", CategoryId = 1, TypeId = 6, Manufacturer = "Bosch", Wattage = 1.5 },
            new DeviceInfo { Id = "6420b43190d65ae1554350b7", Name = "Mašina za pranje sudova GS520E15W", CategoryId = 1, TypeId = 6, Manufacturer = "Gorenje", Wattage = 1.2 },
            new DeviceInfo { Id = "6420b43190d65ae1554350bc", Name = "Inspiron 5402 - NOT19604", CategoryId = 1, TypeId = 8, Manufacturer = "DELL", Wattage = 0.04 },
            new DeviceInfo { Id = "6420b43190d65ae1554350bb", Name = "290 G3 - 123P9EA", CategoryId = 1, TypeId = 8, Manufacturer = "HP", Wattage = 0.15 },
            new DeviceInfo { Id = "6420b43190d65ae1554350ba", Name = "NUC BNUC11TNHI50002 Računar", CategoryId = 1, TypeId = 8, Manufacturer = "Intel", Wattage = 0.06 },
            new DeviceInfo { Id = "6420b43190d65ae1554350c2", Name = "DNE8B Mašina za sušenje veša", CategoryId = 1, TypeId = 10, Manufacturer = "Gorenje", Wattage = 2.7 },
            new DeviceInfo { Id = "6420b43190d65ae1554350c1", Name = "Mašina za sušenje veša WTX87KH1BY", CategoryId = 1, TypeId = 10, Manufacturer = "Bosch", Wattage = 2 },
            new DeviceInfo { Id = "6420b43190d65ae1554350c0", Name = "Mašina za pranje veša WED135 WPS", CategoryId = 1, TypeId = 9, Manufacturer = "Miele", Wattage = 0.7 },
            new DeviceInfo { Id = "6420b43190d65ae1554350bf", Name = "Mašina za pranje veša WNEI94ADS", CategoryId = 1, TypeId = 9, Manufacturer = "Gorenje", Wattage = 0.5 },
            new DeviceInfo { Id = "6420b43190d65ae1554350cb", Name = "Bojler Hydra EZV P50 R", CategoryId = 1, TypeId = 14, Manufacturer = "Metalac", Wattage = 10.2 },
            new DeviceInfo { Id = "6420b43190d65ae1554350ca", Name = "Bojler TGR50SMT", CategoryId = 1, TypeId = 14, Manufacturer = "Gorenje", Wattage = 8 },
            new DeviceInfo { Id = "6420b43190d65ae1554350d0", Name = "Grejalica SIRIO 20", CategoryId = 1, TypeId = 18, Manufacturer = "Radialight", Wattage = 1.5 },
            new DeviceInfo { Id = "642339d634ce75fedb564cc8", Name = "Solarni panel 165M monokristalni", CategoryId = 2, TypeId = 19, Manufacturer = "Felicity", Wattage = 0.35 },
            new DeviceInfo { Id = "642339d634ce75fedb564cc9", Name = "SD2 vetrenjača", CategoryId = 2, TypeId = 20, Manufacturer = "SD", Wattage = 1.5 },
            new DeviceInfo { Id = "6420b43190d65ae1554350c3", Name = "SD1 vetrenjača", CategoryId = 2, TypeId = 20 , Manufacturer = "SD", Wattage = 0.75},
            new DeviceInfo { Id = "6420b43190d65ae1554350c6", Name = "SD3 vetrenjača", CategoryId = 2, TypeId = 20, Manufacturer = "SD", Wattage = 1},
            new DeviceInfo { Id = "6420b43190d65ae1554350c5", Name = "SD4 vetrenjača", CategoryId = 2, TypeId = 20, Manufacturer = "SD", Wattage = 1.08},
            new DeviceInfo { Id = "6420b43190d65ae1554350c8", Name = "SD5 vetrenjača", CategoryId = 2, TypeId = 20, Manufacturer = "SD", Wattage = 2.1},
            new DeviceInfo { Id = "6420b43190d65ae1554350cd", Name = "SD6 vetrenjača", CategoryId = 2, TypeId = 20, Manufacturer = "SD", Wattage = 1.9},
            new DeviceInfo { Id = "6420b43190d65ae1554350b9", Name = "Solarni Panel 175M monokristalni", CategoryId = 2, TypeId = 19, Wattage = 0.4},
            new DeviceInfo { Id = "6420b43190d65ae1554350c4", Name = "Solarni panel 60M monokristalni", CategoryId = 2, TypeId = 19, Wattage = 0.23},
            new DeviceInfo { Id = "6420b43190d65ae1554350c9", Name = "Solarni panel 275M monokristalni", CategoryId = 2, TypeId = 19, Wattage = 2.5},
            new DeviceInfo { Id = "6420b43190d65ae1554350c7", Name = "Solarni panel 250M monokristalni", CategoryId = 2, TypeId = 19, Wattage = 1.8},
            new DeviceInfo { Id = "6420b43190d65ae1554350cc", Name = "Solarni panel 215M monokristalni", CategoryId = 2, TypeId = 19, Wattage = 1.4}
            );

        modelBuilder.Entity<DeviceType>().HasData(
            new DeviceType { Id = 1, CategoryId = 1, Name = "Fridge" },
            new DeviceType { Id = 2, CategoryId = 1, Name = "Tv" },
            new DeviceType { Id = 3, CategoryId = 1, Name = "Oven" },
            new DeviceType { Id = 4, CategoryId = 1, Name = "AC" },
            new DeviceType { Id = 5, CategoryId = 1, Name = "Microwave" },
            new DeviceType { Id = 6, CategoryId = 1, Name = "Dishwasher" },
            new DeviceType { Id = 8, CategoryId = 1, Name = "PC" },
            new DeviceType { Id = 9, CategoryId = 1, Name = "Washing Machine" },
            new DeviceType { Id = 10, CategoryId = 1, Name = "Dryer" },
            new DeviceType { Id = 14, CategoryId = 1, Name = "Boiler" },
            new DeviceType { Id = 18, CategoryId = 1, Name = "Heater" },
            new DeviceType { Id = 19, CategoryId = 2, Name = "Solar Panel" },
            new DeviceType { Id = 20, CategoryId = 2, Name = "Wind Turbine" }
            );

        var hmac = new HMACSHA512();
        
        modelBuilder.Entity<Dso>().HasData(
            new Dso { 
                Id = "7e38047f-8891-449b-8cd3-942c7fe2aa15",
                FirstName = "Laza",
                LastName = "Lazic",
                Username = "lazalazic9",
                Email = "laza@gmail.com",
                Salary = 0,
                Token = null,
                TokenExpiry = null,
                RoleId = 1,
                RegionId = "8963cd78-afa4-4723-9b67-331a3fc180f8",
                Image = null,
                DateCreate = DateTime.Now.Date.ToString(),
                SaltPassword = hmac.Key,
                HashPassword = hmac.ComputeHash(Encoding.UTF8.GetBytes("sifra"))
            }       
        );

        modelBuilder.Entity<Prosumer>().HasData(
            new Prosumer
            {
                Id = "2562a789-6d38-44bf-baf8-7b3a4f6c8ca5",
                FirstName = "Nikola",
                LastName = "Nikolic",
                Username = "nikolanikolic6",
                Email = "nikola@gmail.com",
                Token = null,
                TokenExpiry = null,
                SaltPassword = hmac.Key,
                HashPassword = hmac.ComputeHash(Encoding.UTF8.GetBytes("sifra")),
                Address = "Daniciceva 12",
                RegionId = "8963cd78-afa4-4723-9b67-331a3fc180f8",
                CityId = 1,
                NeigborhoodId = "c434223c-36e9-4d96-9114-d2dfe2cd76fa",
                Image = null,
                Latitude = "44.0111676",
                Longitude = "20.9098523",
                DateCreate = DateTime.Now.ToString(),
                RoleId = 3
            },
            new Prosumer
            {
                Id = "44fbdf08-7ae3-4811-908f-6910c7e2c11c",
                FirstName = "Pera",
                LastName = "Peric",
                Username = "peraperic6",
                Email = "pera@gmail.com",
                Token = null,
                TokenExpiry = null,
                SaltPassword = hmac.Key,
                HashPassword = hmac.ComputeHash(Encoding.UTF8.GetBytes("sifra")),
                Address = "Svetogorska 10",
                RegionId = "8963cd78-afa4-4723-9b67-331a3fc180f8",
                CityId = 1,
                NeigborhoodId = "03c9e550-8811-4ece-b145-594f56d43a60",
                Image = null,
                Latitude = "44.02943",
                Longitude = "20.91146",
                DateCreate = DateTime.Now.ToString(),
                RoleId = 3
            },
            new Prosumer
            {
                Id = "d2250fa2-2de2-4650-8945-c0578288afb9",
                FirstName = "Mika",
                LastName = "Mikic",
                Username = "mikamikic6",
                Email = "mika@gmail.com",
                Token = null,
                TokenExpiry = null,
                SaltPassword = hmac.Key,
                HashPassword = hmac.ComputeHash(Encoding.UTF8.GetBytes("sifra")),
                Address = "Bulevar Kraljice Marije 8",
                RegionId = "8963cd78-afa4-4723-9b67-331a3fc180f8",
                CityId = 1,
                NeigborhoodId = "e491da79-424d-48ce-841a-e82696ea9fb3",
                Image = null,
                Latitude = "44.0141",
                Longitude = "20.90061",
                DateCreate = DateTime.Now.ToString(),
                RoleId = 3
            }
            );

        modelBuilder.Entity<Neigborhood>().HasData(
            new Neigborhood { Id = "e491da79-424d-48ce-841a-e82696ea9fb3", CityId = 1, NeigbName = "Erdoglija" },
            new Neigborhood { Id = "c434223c-36e9-4d96-9114-d2dfe2cd76fa", CityId = 1, NeigbName = "Centar" },
            new Neigborhood { Id = "5f880a5e-331d-4318-8a70-451b4110fbba", CityId = 1, NeigbName = "Bresnica" },
            new Neigborhood { Id = "03c9e550-8811-4ece-b145-594f56d43a60", CityId = 1, NeigbName = "Aerodrom" },
            new Neigborhood { Id = "f1237e1a-8021-4419-97a7-a13c39b8ee44", CityId = 1, NeigbName = "Vinogradi" },
            new Neigborhood { Id = "76a3fa16-b9b2-4e6f-8e63-722ea72e3fb1", CityId = 1, NeigbName = "Stanovo" },
            new Neigborhood { Id = "d4423129-03df-4475-a7d8-b6c9451cceb8", CityId = 1, NeigbName = "Pivara" },
            new Neigborhood { Id = "e06b5e5f-f31f-45af-9d14-479c159f1987", CityId = 1, NeigbName = "Ilina Voda" },
            new Neigborhood { Id = "83da25bd-f0d2-4aae-b356-fcad17495df8", CityId = 1, NeigbName = "Šumarice" },
            new Neigborhood { Id = "4b71b345-2d49-4995-b7bf-a9c6fa148587", CityId = 1, NeigbName = "Ilićevo" },
            new Neigborhood { Id = "33c9626a-6edc-44cf-8b9e-aed8e578e0ab", CityId = 1, NeigbName = "Beloševac" },
            new Neigborhood { Id = "d9549b0d-e614-46f2-88ed-ad9608ad9ef2", CityId = 1, NeigbName = "Sušica" },
            new Neigborhood { Id = "68885c71-416b-448e-9791-e02b00f684d2", CityId = 1, NeigbName = "Petrovac" }
            //dodati za ostale gradove
            );

        modelBuilder.Entity<Region>().HasData(
            new Region { Id = "8963cd78-afa4-4723-9b67-331a3fc180f8", RegionName = "Šumadija" }
            );

        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, RoleName = "Admin"},
            new Role { Id = 2, RoleName = "Dispatcher" },
            new Role { Id = 3, RoleName = "Prosumer" }
            );

        modelBuilder.Entity<ElectricityPrice>().HasData(
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 01, 00, 00, 00), Price = 103.7687210958904 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 02, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 03, 00, 00, 00), Price = 108.32998356164381 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 04, 00, 00, 00), Price = 111.75093041095889 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 05, 00, 00, 00), Price = 103.7687210958904 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 06, 00, 00, 00), Price = 111.75093041095889 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 07, 00, 00, 00), Price = 124.29440219178082 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 08, 00, 00, 00), Price = 109.47029917808217 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 09, 00, 00, 00), Price = 109.47029917808217 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 10, 00, 00, 00), Price = 111.75093041095889 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 11, 00, 00, 00), Price = 108.32998356164381 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 12, 00, 00, 00), Price = 112.89124602739724 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 13, 00, 00, 00), Price = 108.32998356164381 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 14, 00, 00, 00), Price = 115.17187726027396 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 15, 00, 00, 00), Price = 122.0137709589041 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 16, 00, 00, 00), Price = 122.0137709589041 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 17, 00, 00, 00), Price = 123.15408657534246 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 18, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 19, 00, 00, 00), Price = 117.45250849315067 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 20, 00, 00, 00), Price = 110.61061479452053 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 21, 00, 00, 00), Price = 120.87345534246575 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 22, 00, 00, 00), Price = 120.87345534246575 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 23, 00, 00, 00), Price = 111.75093041095889 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 24, 00, 00, 00), Price = 104.90903671232876 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 25, 00, 00, 00), Price = 103.7687210958904 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 26, 00, 00, 00), Price = 107.18966794520546 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 27, 00, 00, 00), Price = 110.61061479452053 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 28, 00, 00, 00), Price = 125.43471780821918 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 29, 00, 00, 00), Price = 122.0137709589041 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 30, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 01, 31, 00, 00, 00), Price = 111.75093041095889 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 01, 00, 00, 00), Price = 123.15408657534246 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 02, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 03, 00, 00, 00), Price = 116.31219287671232 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 04, 00, 00, 00), Price = 108.32998356164381 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 05, 00, 00, 00), Price = 103.7687210958904 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 06, 00, 00, 00), Price = 106.04935232876711 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 07, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 08, 00, 00, 00), Price = 108.32998356164381 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 09, 00, 00, 00), Price = 119.73313972602739 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 10, 00, 00, 00), Price = 110.61061479452053 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 11, 00, 00, 00), Price = 125.43471780821918 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 12, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 13, 00, 00, 00), Price = 108.32998356164381 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 14, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 15, 00, 00, 00), Price = 107.18966794520546 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 16, 00, 00, 00), Price = 117.45250849315067 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 17, 00, 00, 00), Price = 110.61061479452053 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 18, 00, 00, 00), Price = 112.89124602739724 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 19, 00, 00, 00), Price = 103.7687210958904 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 20, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 21, 00, 00, 00), Price = 119.73313972602739 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 22, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 23, 00, 00, 00), Price = 111.75093041095889 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 24, 00, 00, 00), Price = 110.61061479452053 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 25, 00, 00, 00), Price = 103.7687210958904 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 26, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 27, 00, 00, 00), Price = 106.04935232876711 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 02, 28, 00, 00, 00), Price = 110.61061479452053 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 01, 00, 00, 00), Price = 122.0137709589041 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 02, 00, 00, 00), Price = 109.47029917808217 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 03, 00, 00, 00), Price = 119.73313972602739 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 04, 00, 00, 00), Price = 120.87345534246575 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 05, 00, 00, 00), Price = 120.87345534246575 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 06, 00, 00, 00), Price = 107.18966794520546 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 07, 00, 00, 00), Price = 122.0137709589041 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 08, 00, 00, 00), Price = 115.17187726027396 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 09, 00, 00, 00), Price = 104.90903671232876 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 10, 00, 00, 00), Price = 108.32998356164381 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 11, 00, 00, 00), Price = 108.32998356164381 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 12, 00, 00, 00), Price = 118.59282410958903 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 13, 00, 00, 00), Price = 124.29440219178082 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 14, 00, 00, 00), Price = 112.89124602739724 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 15, 00, 00, 00), Price = 108.32998356164381 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 16, 00, 00, 00), Price = 125.43471780821918 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 17, 00, 00, 00), Price = 108.32998356164381 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 18, 00, 00, 00), Price = 107.18966794520546 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 19, 00, 00, 00), Price = 119.73313972602739 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 20, 00, 00, 00), Price = 109.47029917808217 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 21, 00, 00, 00), Price = 104.90903671232876 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 22, 00, 00, 00), Price = 118.59282410958903 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 23, 00, 00, 00), Price = 104.90903671232876 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 24, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 25, 00, 00, 00), Price = 125.43471780821918 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 26, 00, 00, 00), Price = 106.04935232876711 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 27, 00, 00, 00), Price = 115.17187726027396 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 28, 00, 00, 00), Price = 117.45250849315067 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 29, 00, 00, 00), Price = 112.89124602739724 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 30, 00, 00, 00), Price = 109.47029917808217 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 03, 31, 00, 00, 00), Price = 117.45250849315067 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 01, 00, 00, 00), Price = 119.73313972602739 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 02, 00, 00, 00), Price = 110.61061479452053 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 03, 00, 00, 00), Price = 108.32998356164381 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 04, 00, 00, 00), Price = 104.90903671232876 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 05, 00, 00, 00), Price = 103.7687210958904 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 06, 00, 00, 00), Price = 108.32998356164381 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 07, 00, 00, 00), Price = 125.43471780821918 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 08, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 09, 00, 00, 00), Price = 117.45250849315067 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 10, 00, 00, 00), Price = 120.87345534246575 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 11, 00, 00, 00), Price = 118.59282410958903 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 12, 00, 00, 00), Price = 103.7687210958904 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 13, 00, 00, 00), Price = 104.90903671232876 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 14, 00, 00, 00), Price = 107.18966794520546 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 15, 00, 00, 00), Price = 117.45250849315067 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 16, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 17, 00, 00, 00), Price = 111.75093041095889 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 18, 00, 00, 00), Price = 124.29440219178082 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 19, 00, 00, 00), Price = 119.73313972602739 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 20, 00, 00, 00), Price = 107.18966794520546 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 21, 00, 00, 00), Price = 109.47029917808217 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 22, 00, 00, 00), Price = 104.90903671232876 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 23, 00, 00, 00), Price = 108.32998356164381 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 24, 00, 00, 00), Price = 119.73313972602739 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 25, 00, 00, 00), Price = 119.73313972602739 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 26, 00, 00, 00), Price = 123.15408657534246 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 27, 00, 00, 00), Price = 125.43471780821918 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 28, 00, 00, 00), Price = 109.47029917808217 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 29, 00, 00, 00), Price = 104.90903671232876 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 04, 30, 00, 00, 00), Price = 117.45250849315067 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 01, 00, 00, 00), Price = 106.04935232876711 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 02, 00, 00, 00), Price = 122.0137709589041 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 03, 00, 00, 00), Price = 123.15408657534246 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 04, 00, 00, 00), Price = 122.0137709589041 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 05, 00, 00, 00), Price = 116.31219287671232 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 06, 00, 00, 00), Price = 120.87345534246575 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 07, 00, 00, 00), Price = 122.0137709589041 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 08, 00, 00, 00), Price = 124.29440219178082 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 09, 00, 00, 00), Price = 108.32998356164381 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 10, 00, 00, 00), Price = 111.75093041095889 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 11, 00, 00, 00), Price = 112.89124602739724 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 12, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 13, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 14, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 15, 00, 00, 00), Price = 110.61061479452053 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 16, 00, 00, 00), Price = 125.43471780821918 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 17, 00, 00, 00), Price = 122.0137709589041 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 18, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 19, 00, 00, 00), Price = 117.45250849315067 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 20, 00, 00, 00), Price = 106.04935232876711 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 21, 00, 00, 00), Price = 104.90903671232876 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 22, 00, 00, 00), Price = 124.29440219178082 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 23, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 24, 00, 00, 00), Price = 106.04935232876711 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 25, 00, 00, 00), Price = 123.15408657534246 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 26, 00, 00, 00), Price = 117.45250849315067 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 27, 00, 00, 00), Price = 106.04935232876711 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 28, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 29, 00, 00, 00), Price = 116.31219287671232 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 30, 00, 00, 00), Price = 103.7687210958904 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 05, 31, 00, 00, 00), Price = 109.47029917808217 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 01, 00, 00, 00), Price = 117.45250849315067 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 02, 00, 00, 00), Price = 104.90903671232876 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 03, 00, 00, 00), Price = 116.31219287671232 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 04, 00, 00, 00), Price = 106.04935232876711 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 05, 00, 00, 00), Price = 109.47029917808217 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 06, 00, 00, 00), Price = 125.43471780821918 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 07, 00, 00, 00), Price = 107.18966794520546 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 08, 00, 00, 00), Price = 107.18966794520546 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 09, 00, 00, 00), Price = 104.90903671232876 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 10, 00, 00, 00), Price = 123.15408657534246 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 11, 00, 00, 00), Price = 110.61061479452053 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 12, 00, 00, 00), Price = 112.89124602739724 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 13, 00, 00, 00), Price = 125.43471780821918 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 14, 00, 00, 00), Price = 118.59282410958903 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 15, 00, 00, 00), Price = 115.17187726027396 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 16, 00, 00, 00), Price = 103.7687210958904 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 17, 00, 00, 00), Price = 110.61061479452053 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 18, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 19, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 20, 00, 00, 00), Price = 110.61061479452053 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 21, 00, 00, 00), Price = 116.31219287671232 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 22, 00, 00, 00), Price = 106.04935232876711 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 23, 00, 00, 00), Price = 109.47029917808217 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 24, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 25, 00, 00, 00), Price = 104.90903671232876 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 26, 00, 00, 00), Price = 111.75093041095889 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 27, 00, 00, 00), Price = 115.17187726027396 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 28, 00, 00, 00), Price = 112.89124602739724 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 29, 00, 00, 00), Price = 109.47029917808217 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 06, 30, 00, 00, 00), Price = 107.18966794520546 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 01, 00, 00, 00), Price = 109.47029917808217 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 02, 00, 00, 00), Price = 122.0137709589041 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 03, 00, 00, 00), Price = 122.0137709589041 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 04, 00, 00, 00), Price = 103.7687210958904 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 05, 00, 00, 00), Price = 120.87345534246575 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 06, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 07, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 08, 00, 00, 00), Price = 109.47029917808217 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 09, 00, 00, 00), Price = 112.89124602739724 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 10, 00, 00, 00), Price = 117.45250849315067 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 11, 00, 00, 00), Price = 120.87345534246575 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 12, 00, 00, 00), Price = 111.75093041095889 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 13, 00, 00, 00), Price = 112.89124602739724 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 14, 00, 00, 00), Price = 112.89124602739724 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 15, 00, 00, 00), Price = 111.75093041095889 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 16, 00, 00, 00), Price = 110.61061479452053 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 17, 00, 00, 00), Price = 103.7687210958904 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 18, 00, 00, 00), Price = 109.47029917808217 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 19, 00, 00, 00), Price = 110.61061479452053 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 20, 00, 00, 00), Price = 104.90903671232876 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 21, 00, 00, 00), Price = 123.15408657534246 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 22, 00, 00, 00), Price = 116.31219287671232 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 23, 00, 00, 00), Price = 118.59282410958903 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 24, 00, 00, 00), Price = 118.59282410958903 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 25, 00, 00, 00), Price = 119.73313972602739 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 26, 00, 00, 00), Price = 124.29440219178082 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 27, 00, 00, 00), Price = 123.15408657534246 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 28, 00, 00, 00), Price = 108.32998356164381 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 29, 00, 00, 00), Price = 116.31219287671232 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 30, 00, 00, 00), Price = 106.04935232876711 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 07, 31, 00, 00, 00), Price = 109.47029917808217 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 01, 00, 00, 00), Price = 116.31219287671232 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 02, 00, 00, 00), Price = 106.04935232876711 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 03, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 04, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 05, 00, 00, 00), Price = 111.75093041095889 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 06, 00, 00, 00), Price = 112.89124602739724 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 07, 00, 00, 00), Price = 103.7687210958904 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 08, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 09, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 10, 00, 00, 00), Price = 125.43471780821918 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 11, 00, 00, 00), Price = 106.04935232876711 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 12, 00, 00, 00), Price = 107.18966794520546 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 13, 00, 00, 00), Price = 124.29440219178082 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 14, 00, 00, 00), Price = 122.0137709589041 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 15, 00, 00, 00), Price = 107.18966794520546 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 16, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 17, 00, 00, 00), Price = 116.31219287671232 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 18, 00, 00, 00), Price = 125.43471780821918 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 19, 00, 00, 00), Price = 106.04935232876711 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 20, 00, 00, 00), Price = 110.61061479452053 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 21, 00, 00, 00), Price = 117.45250849315067 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 22, 00, 00, 00), Price = 123.15408657534246 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 23, 00, 00, 00), Price = 107.18966794520546 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 24, 00, 00, 00), Price = 111.75093041095889 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 25, 00, 00, 00), Price = 103.7687210958904 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 26, 00, 00, 00), Price = 106.04935232876711 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 27, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 28, 00, 00, 00), Price = 122.0137709589041 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 29, 00, 00, 00), Price = 119.73313972602739 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 30, 00, 00, 00), Price = 111.75093041095889 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 08, 31, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 01, 00, 00, 00), Price = 116.31219287671232 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 02, 00, 00, 00), Price = 107.18966794520546 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 03, 00, 00, 00), Price = 123.15408657534246 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 04, 00, 00, 00), Price = 115.17187726027396 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 05, 00, 00, 00), Price = 104.90903671232876 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 06, 00, 00, 00), Price = 118.59282410958903 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 07, 00, 00, 00), Price = 115.17187726027396 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 08, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 09, 00, 00, 00), Price = 123.15408657534246 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 10, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 11, 00, 00, 00), Price = 119.73313972602739 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 12, 00, 00, 00), Price = 123.15408657534246 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 13, 00, 00, 00), Price = 106.04935232876711 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 14, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 15, 00, 00, 00), Price = 123.15408657534246 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 16, 00, 00, 00), Price = 109.47029917808217 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 17, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 18, 00, 00, 00), Price = 117.45250849315067 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 19, 00, 00, 00), Price = 103.7687210958904 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 20, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 21, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 22, 00, 00, 00), Price = 120.87345534246575 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 23, 00, 00, 00), Price = 110.61061479452053 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 24, 00, 00, 00), Price = 108.32998356164381 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 25, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 26, 00, 00, 00), Price = 104.90903671232876 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 27, 00, 00, 00), Price = 103.7687210958904 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 28, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 29, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 09, 30, 00, 00, 00), Price = 103.7687210958904 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 01, 00, 00, 00), Price = 125.43471780821918 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 02, 00, 00, 00), Price = 106.04935232876711 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 03, 00, 00, 00), Price = 107.18966794520546 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 04, 00, 00, 00), Price = 123.15408657534246 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 05, 00, 00, 00), Price = 108.32998356164381 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 06, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 07, 00, 00, 00), Price = 122.0137709589041 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 08, 00, 00, 00), Price = 107.18966794520546 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 09, 00, 00, 00), Price = 125.43471780821918 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 10, 00, 00, 00), Price = 112.89124602739724 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 11, 00, 00, 00), Price = 123.15408657534246 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 12, 00, 00, 00), Price = 119.73313972602739 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 13, 00, 00, 00), Price = 116.31219287671232 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 14, 00, 00, 00), Price = 118.59282410958903 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 15, 00, 00, 00), Price = 110.61061479452053 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 16, 00, 00, 00), Price = 124.29440219178082 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 17, 00, 00, 00), Price = 125.43471780821918 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 18, 00, 00, 00), Price = 122.0137709589041 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 19, 00, 00, 00), Price = 117.45250849315067 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 20, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 21, 00, 00, 00), Price = 112.89124602739724 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 22, 00, 00, 00), Price = 117.45250849315067 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 23, 00, 00, 00), Price = 110.61061479452053 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 24, 00, 00, 00), Price = 115.17187726027396 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 25, 00, 00, 00), Price = 119.73313972602739 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 26, 00, 00, 00), Price = 122.0137709589041 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 27, 00, 00, 00), Price = 124.29440219178082 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 28, 00, 00, 00), Price = 115.17187726027396 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 29, 00, 00, 00), Price = 115.17187726027396 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 30, 00, 00, 00), Price = 107.18966794520546 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 10, 31, 00, 00, 00), Price = 123.15408657534246 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 01, 00, 00, 00), Price = 123.15408657534246 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 02, 00, 00, 00), Price = 119.73313972602739 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 03, 00, 00, 00), Price = 115.17187726027396 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 04, 00, 00, 00), Price = 117.45250849315067 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 05, 00, 00, 00), Price = 115.17187726027396 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 06, 00, 00, 00), Price = 112.89124602739724 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 07, 00, 00, 00), Price = 116.31219287671232 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 08, 00, 00, 00), Price = 104.90903671232876 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 09, 00, 00, 00), Price = 122.0137709589041 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 10, 00, 00, 00), Price = 123.15408657534246 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 11, 00, 00, 00), Price = 112.89124602739724 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 12, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 13, 00, 00, 00), Price = 111.75093041095889 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 14, 00, 00, 00), Price = 123.15408657534246 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 15, 00, 00, 00), Price = 111.75093041095889 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 16, 00, 00, 00), Price = 122.0137709589041 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 17, 00, 00, 00), Price = 107.18966794520546 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 18, 00, 00, 00), Price = 107.18966794520546 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 19, 00, 00, 00), Price = 116.31219287671232 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 20, 00, 00, 00), Price = 109.47029917808217 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 21, 00, 00, 00), Price = 125.43471780821918 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 22, 00, 00, 00), Price = 111.75093041095889 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 23, 00, 00, 00), Price = 119.73313972602739 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 24, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 25, 00, 00, 00), Price = 112.89124602739724 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 26, 00, 00, 00), Price = 124.29440219178082 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 27, 00, 00, 00), Price = 116.31219287671232 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 28, 00, 00, 00), Price = 111.75093041095889 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 29, 00, 00, 00), Price = 124.29440219178082 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 11, 30, 00, 00, 00), Price = 103.7687210958904 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 01, 00, 00, 00), Price = 107.18966794520546 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 02, 00, 00, 00), Price = 122.0137709589041 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 03, 00, 00, 00), Price = 112.89124602739724 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 04, 00, 00, 00), Price = 111.75093041095889 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 05, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 06, 00, 00, 00), Price = 123.15408657534246 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 07, 00, 00, 00), Price = 120.87345534246575 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 08, 00, 00, 00), Price = 106.04935232876711 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 09, 00, 00, 00), Price = 123.15408657534246 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 10, 00, 00, 00), Price = 124.29440219178082 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 11, 00, 00, 00), Price = 124.29440219178082 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 12, 00, 00, 00), Price = 111.75093041095889 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 13, 00, 00, 00), Price = 110.61061479452053 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 14, 00, 00, 00), Price = 103.7687210958904 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 15, 00, 00, 00), Price = 125.43471780821918 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 16, 00, 00, 00), Price = 117.45250849315067 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 17, 00, 00, 00), Price = 104.90903671232876 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 18, 00, 00, 00), Price = 112.89124602739724 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 19, 00, 00, 00), Price = 103.7687210958904 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 20, 00, 00, 00), Price = 106.04935232876711 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 21, 00, 00, 00), Price = 110.61061479452053 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 22, 00, 00, 00), Price = 115.17187726027396 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 23, 00, 00, 00), Price = 106.04935232876711 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 24, 00, 00, 00), Price = 114.0315616438356 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 25, 00, 00, 00), Price = 110.61061479452053 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 26, 00, 00, 00), Price = 102.62840547945204 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 27, 00, 00, 00), Price = 106.04935232876711 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 28, 00, 00, 00), Price = 104.90903671232876 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 29, 00, 00, 00), Price = 122.0137709589041 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 30, 00, 00, 00), Price = 108.32998356164381 },
            new ElectricityPrice { Timestamp = new DateTime(2023, 12, 31, 00, 00, 00), Price = 106.04935232876711 }
            );

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
