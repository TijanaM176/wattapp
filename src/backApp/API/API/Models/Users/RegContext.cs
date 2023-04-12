using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using API.Models.Devices;

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
            new DeviceInfo { Id = "642339d634ce75fedb564cc9", Name = "SD2 Wind Turbine", CategoryId = 2, TypeId = 20, Manufacturer = "SD", Wattage = 1.5 }
            );

        modelBuilder.Entity<DeviceType>().HasData(
            new DeviceType { Id = 1, CategoryId = 1, Name = "Fridge" },
            new DeviceType { Id = 2, CategoryId = 1, Name = "Tv" },
            new DeviceType { Id = 3, CategoryId = 1, Name = "Oven" },
            new DeviceType { Id = 4, CategoryId = 1, Name = "AC" },
            new DeviceType { Id = 5, CategoryId = 1, Name = "Micowave" },
            new DeviceType { Id = 6, CategoryId = 1, Name = "Dishwasher" },
            new DeviceType { Id = 8, CategoryId = 1, Name = "PC" },
            new DeviceType { Id = 9, CategoryId = 1, Name = "Washing Machine" },
            new DeviceType { Id = 10, CategoryId = 1, Name = "Dryer" },
            new DeviceType { Id = 14, CategoryId = 1, Name = "Boiler" },
            new DeviceType { Id = 18, CategoryId = 1, Name = "Heater" },
            new DeviceType { Id = 19, CategoryId = 2, Name = "Solar Panel" },
            new DeviceType { Id = 20, CategoryId = 2, Name = "Wind Turbine" }
            );

        modelBuilder.Entity<Region>().HasData(
            new Region { Id = "8963cd78-afa4-4723-9b67-331a3fc180f8", RegionName = "Šumadija" }
            );

        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, RoleName = "Dso"},
            new Role { Id = 2, RoleName = "WorkerDso" },
            new Role { Id = 3, RoleName = "Prosumer" }
            );

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
