using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using API.Models.Users;
namespace API.Models;

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

    public virtual DbSet<Dso> Dsos { get; set; }

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
        modelBuilder.Entity<Prosumer>().Ignore(x => x.TokenExpiry);
        modelBuilder.Entity<Dso>().Ignore(x => x.TokenExpiry);


        modelBuilder.Entity<City>(entity =>
        {
            entity.ToTable("City");

            entity.Property(e => e.Name).HasColumnType("nvarchar(20)");

            entity.HasMany(c => c.Neighborhoods).WithOne(n => n.City).HasForeignKey(n => n.CityId);
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

            entity.HasOne(d => d.Region).WithMany(p => p.Dsos).HasForeignKey(d => d.RegionId);

            entity.HasOne(d => d.Role).WithMany(p => p.Dsos).HasForeignKey(d => d.RoleId);
        });

        modelBuilder.Entity<Neigborhood>(entity =>
        {
            entity.ToTable("Neigborhood");

            entity.Property(e => e.NeigbName).HasColumnType("nvarchar(50)");

            entity.HasMany(n => n.Prosumers).WithOne(p => p.Neigborhood).HasForeignKey(p => p.NeigborhoodId);
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

            entity.HasOne(d => d.City).WithMany(p => p.Prosumers).HasForeignKey(d => d.CityId);

            entity.HasOne(d => d.Neigborhood).WithMany(p => p.Prosumers).HasForeignKey(d => d.NeigborhoodId);

            entity.HasOne(d => d.Region).WithMany(p => p.Prosumers).HasForeignKey(d => d.RegionId);

            entity.HasOne(d => d.Role).WithMany(p => p.Prosumers).HasForeignKey(d => d.RoleId);
        });

        modelBuilder.Entity<ProsumerLink>(entity =>
        {
            entity.HasKey(l => new { l.ProsumerId, l.DeviceId });

            entity.HasOne(d => d.Prosumer).WithMany().HasForeignKey(d => d.ProsumerId);

            entity.HasOne(l => l.Prosumer).WithMany(u => u.Links).HasForeignKey(l => l.ProsumerId);
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

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
