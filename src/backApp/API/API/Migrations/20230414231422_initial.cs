using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "City",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "nvarchar(20)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_City", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DeviceCategory",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeviceCategory", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ElectricityPrices",
                columns: table => new
                {
                    Timestamp = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Price = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ElectricityPrices", x => x.Timestamp);
                });

            migrationBuilder.CreateTable(
                name: "Region",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    RegionName = table.Column<string>(type: "nvarchar(20)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Region", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false),
                    RoleName = table.Column<string>(type: "nvarchar(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Neigborhood",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    CityId = table.Column<long>(type: "INTEGER", nullable: false),
                    NeigbName = table.Column<string>(type: "nvarchar(50)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Neigborhood", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Neigborhood_City_CityId",
                        column: x => x.CityId,
                        principalTable: "City",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DeviceType",
                columns: table => new
                {
                    Id = table.Column<long>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CategoryId = table.Column<long>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeviceType", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DeviceType_DeviceCategory_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "DeviceCategory",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DSO",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Salary = table.Column<long>(type: "INTEGER", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar (10)", nullable: true),
                    LastName = table.Column<string>(type: "nvarchar (20)", nullable: true),
                    Username = table.Column<string>(type: "nvarchar (30)", nullable: true),
                    Email = table.Column<string>(type: "TEXT", nullable: true),
                    Token = table.Column<string>(type: "TEXT", nullable: true),
                    TokenExpiry = table.Column<DateTime>(type: "TEXT", nullable: true),
                    RoleId = table.Column<long>(type: "INTEGER", nullable: true),
                    HashPassword = table.Column<byte[]>(type: "varbinary (2048)", nullable: true),
                    SaltPassword = table.Column<byte[]>(type: "varbinary (2048)", nullable: true),
                    RegionId = table.Column<string>(type: "TEXT", nullable: true),
                    Image = table.Column<string>(type: "TEXT", nullable: true),
                    DateCreate = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DSO", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DSO_Region_RegionId",
                        column: x => x.RegionId,
                        principalTable: "Region",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DSO_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Prosumer",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Address = table.Column<string>(type: "VARCHAR (120)", nullable: true),
                    CityID = table.Column<long>(type: "INTEGER", nullable: true),
                    NeigborhoodID = table.Column<string>(type: "TEXT", nullable: true),
                    Latitude = table.Column<string>(type: "nvarchar (10)", nullable: true),
                    Longitude = table.Column<string>(type: "nvarchar (10)", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar (10)", nullable: true),
                    LastName = table.Column<string>(type: "nvarchar (20)", nullable: true),
                    Username = table.Column<string>(type: "nvarchar (30)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar (20)", nullable: true),
                    Token = table.Column<string>(type: "TEXT", nullable: true),
                    TokenExpiry = table.Column<DateTime>(type: "TEXT", nullable: true),
                    RoleID = table.Column<long>(type: "INTEGER", nullable: true),
                    HashPassword = table.Column<byte[]>(type: "varbinary (2048)", nullable: true),
                    SaltPassword = table.Column<byte[]>(type: "varbinary (2048)", nullable: true),
                    RegionID = table.Column<string>(type: "TEXT", nullable: true),
                    Image = table.Column<string>(type: "TEXT", nullable: true),
                    DateCreate = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prosumer", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Prosumer_City_CityID",
                        column: x => x.CityID,
                        principalTable: "City",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Prosumer_Neigborhood_NeigborhoodID",
                        column: x => x.NeigborhoodID,
                        principalTable: "Neigborhood",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Prosumer_Region_RegionID",
                        column: x => x.RegionID,
                        principalTable: "Region",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Prosumer_Role_RoleID",
                        column: x => x.RoleID,
                        principalTable: "Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DeviceInfo",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 30, nullable: true),
                    CategoryId = table.Column<long>(type: "INTEGER", nullable: false),
                    TypeId = table.Column<long>(type: "INTEGER", nullable: false),
                    Manufacturer = table.Column<string>(type: "TEXT", maxLength: 30, nullable: true),
                    Wattage = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeviceInfo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DeviceInfo_DeviceCategory_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "DeviceCategory",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DeviceInfo_DeviceType_TypeId",
                        column: x => x.TypeId,
                        principalTable: "DeviceType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProsumerLinks",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    ProsumerId = table.Column<string>(type: "TEXT", nullable: false),
                    ModelId = table.Column<string>(type: "TEXT", nullable: false),
                    IpAddress = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Activity = table.Column<bool>(type: "INTEGER", nullable: false),
                    DsoView = table.Column<bool>(type: "INTEGER", nullable: false),
                    DsoControl = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProsumerLinks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProsumerLinks_DeviceInfo_ModelId",
                        column: x => x.ModelId,
                        principalTable: "DeviceInfo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProsumerLinks_Prosumer_ProsumerId",
                        column: x => x.ProsumerId,
                        principalTable: "Prosumer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "City",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1L, "Kragujevac" },
                    { 2L, "Topola" },
                    { 3L, "Čačak" },
                    { 4L, "Beograd" },
                    { 5L, "Smederevo" },
                    { 6L, "Lazarevac" },
                    { 7L, "Smederevska Palanka" },
                    { 8L, "Mladenovac" },
                    { 9L, "Aranđelovac" },
                    { 10L, "Gornji Milanovac" },
                    { 11L, "Rekovac" },
                    { 12L, "Kraljevo" },
                    { 13L, "Jagodina" },
                    { 14L, "Velika Plana" },
                    { 15L, "Varvarin" }
                });

            migrationBuilder.InsertData(
                table: "DeviceCategory",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1L, "Consumer" },
                    { 2L, "Producer" },
                    { 3L, "Storage" }
                });

            migrationBuilder.InsertData(
                table: "ElectricityPrices",
                columns: new[] { "Timestamp", "Price" },
                values: new object[,]
                {
                    { new DateTime(2022, 7, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 96.439999999999998 },
                    { new DateTime(2022, 7, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 101.58 },
                    { new DateTime(2022, 7, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 86.719999999999999 },
                    { new DateTime(2022, 7, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), 80.819999999999993 },
                    { new DateTime(2022, 7, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 98.909999999999997 },
                    { new DateTime(2022, 7, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), 89.980000000000004 },
                    { new DateTime(2022, 7, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), 106.52 },
                    { new DateTime(2022, 7, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), 105.15000000000001 },
                    { new DateTime(2022, 7, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), 94.989999999999995 },
                    { new DateTime(2022, 7, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 82.010000000000005 },
                    { new DateTime(2022, 7, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), 79.379999999999995 },
                    { new DateTime(2022, 7, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 98.670000000000002 },
                    { new DateTime(2022, 7, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), 101.45999999999999 },
                    { new DateTime(2022, 7, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 92.989999999999995 },
                    { new DateTime(2022, 7, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 96.620000000000005 },
                    { new DateTime(2022, 7, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), 98.640000000000001 },
                    { new DateTime(2022, 7, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), 80.019999999999996 },
                    { new DateTime(2022, 7, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 64.519999999999996 },
                    { new DateTime(2022, 7, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), 99.939999999999998 },
                    { new DateTime(2022, 7, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 104.54000000000001 },
                    { new DateTime(2022, 7, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), 97.329999999999998 },
                    { new DateTime(2022, 7, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), 91.400000000000006 },
                    { new DateTime(2022, 7, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), 90.200000000000003 },
                    { new DateTime(2022, 7, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), 80.180000000000007 },
                    { new DateTime(2022, 7, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), 66.140000000000001 },
                    { new DateTime(2022, 7, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), 98.769999999999996 },
                    { new DateTime(2022, 7, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), 102.58 },
                    { new DateTime(2022, 7, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), 118.15000000000001 },
                    { new DateTime(2022, 7, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), 118.42 },
                    { new DateTime(2022, 7, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), 125.59 },
                    { new DateTime(2022, 7, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), 106.15000000000001 },
                    { new DateTime(2022, 8, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 72.079999999999998 },
                    { new DateTime(2022, 8, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 90.969999999999999 },
                    { new DateTime(2022, 8, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 128.15000000000001 },
                    { new DateTime(2022, 8, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), 143.75 },
                    { new DateTime(2022, 8, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 123.23999999999999 },
                    { new DateTime(2022, 8, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), 124.45999999999999 },
                    { new DateTime(2022, 8, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), 92.150000000000006 },
                    { new DateTime(2022, 8, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), 91.75 },
                    { new DateTime(2022, 8, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), 146.50999999999999 },
                    { new DateTime(2022, 8, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 138.84999999999999 },
                    { new DateTime(2022, 8, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), 131.80000000000001 },
                    { new DateTime(2022, 8, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 119.56 },
                    { new DateTime(2022, 8, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), 110.44 },
                    { new DateTime(2022, 8, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 108.89 },
                    { new DateTime(2022, 8, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 95.870000000000005 },
                    { new DateTime(2022, 8, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), 114.01000000000001 },
                    { new DateTime(2022, 8, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), 107.97 },
                    { new DateTime(2022, 8, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 109.3 },
                    { new DateTime(2022, 8, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), 103.23999999999999 },
                    { new DateTime(2022, 8, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 104.73999999999999 },
                    { new DateTime(2022, 8, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), 97.299999999999997 },
                    { new DateTime(2022, 8, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), 87.319999999999993 },
                    { new DateTime(2022, 8, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), 103.56999999999999 },
                    { new DateTime(2022, 8, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), 109.94 },
                    { new DateTime(2022, 8, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), 111.31 },
                    { new DateTime(2022, 8, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), 111.12 },
                    { new DateTime(2022, 8, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), 111.59 },
                    { new DateTime(2022, 8, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), 92.670000000000002 },
                    { new DateTime(2022, 8, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), 80.790000000000006 },
                    { new DateTime(2022, 8, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), 112.09999999999999 },
                    { new DateTime(2022, 8, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), 125.63 },
                    { new DateTime(2022, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 118.02 },
                    { new DateTime(2022, 9, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 118.78 },
                    { new DateTime(2022, 9, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 115.06999999999999 },
                    { new DateTime(2022, 9, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), 107.84999999999999 },
                    { new DateTime(2022, 9, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 93.670000000000002 },
                    { new DateTime(2022, 9, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), 127.84999999999999 },
                    { new DateTime(2022, 9, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), 127.56999999999999 },
                    { new DateTime(2022, 9, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), 120.83 },
                    { new DateTime(2022, 9, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), 130.21000000000001 },
                    { new DateTime(2022, 9, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 137.65000000000001 },
                    { new DateTime(2022, 9, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), 124.05 },
                    { new DateTime(2022, 9, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 113.27 },
                    { new DateTime(2022, 9, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), 143.91 },
                    { new DateTime(2022, 9, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 148.40000000000001 },
                    { new DateTime(2022, 9, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 164.38999999999999 },
                    { new DateTime(2022, 9, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), 160.0 },
                    { new DateTime(2022, 9, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), 159.00999999999999 },
                    { new DateTime(2022, 9, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 138.22999999999999 },
                    { new DateTime(2022, 9, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), 107.05 },
                    { new DateTime(2022, 9, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 155.47 },
                    { new DateTime(2022, 9, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), 155.59 },
                    { new DateTime(2022, 9, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), 151.24000000000001 },
                    { new DateTime(2022, 9, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), 120.28 },
                    { new DateTime(2022, 9, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), 132.41999999999999 },
                    { new DateTime(2022, 9, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), 142.44 },
                    { new DateTime(2022, 9, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), 125.75 },
                    { new DateTime(2022, 9, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), 157.0 },
                    { new DateTime(2022, 9, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), 165.05000000000001 },
                    { new DateTime(2022, 9, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), 150.87 },
                    { new DateTime(2022, 9, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), 142.19 },
                    { new DateTime(2022, 10, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 148.16 },
                    { new DateTime(2022, 10, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 138.88999999999999 },
                    { new DateTime(2022, 10, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 135.58000000000001 },
                    { new DateTime(2022, 10, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), 186.05000000000001 },
                    { new DateTime(2022, 10, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 174.50999999999999 },
                    { new DateTime(2022, 10, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), 189.06 },
                    { new DateTime(2022, 10, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), 325.68000000000001 },
                    { new DateTime(2022, 10, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), 201.22999999999999 },
                    { new DateTime(2022, 10, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), 152.13999999999999 },
                    { new DateTime(2022, 10, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 160.91 },
                    { new DateTime(2022, 10, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), 204.93000000000001 },
                    { new DateTime(2022, 10, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 208.97 },
                    { new DateTime(2022, 10, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), 219.77000000000001 },
                    { new DateTime(2022, 10, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 210.03 },
                    { new DateTime(2022, 10, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 198.69 },
                    { new DateTime(2022, 10, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), 210.18000000000001 },
                    { new DateTime(2022, 10, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), 193.15000000000001 },
                    { new DateTime(2022, 10, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 227.71000000000001 },
                    { new DateTime(2022, 10, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), 234.72999999999999 },
                    { new DateTime(2022, 10, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 228.78 },
                    { new DateTime(2022, 10, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), 222.53999999999999 },
                    { new DateTime(2022, 10, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), 231.16999999999999 },
                    { new DateTime(2022, 10, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), 218.25999999999999 },
                    { new DateTime(2022, 10, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), 179.06 },
                    { new DateTime(2022, 10, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), 224.03 },
                    { new DateTime(2022, 10, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), 237.77000000000001 },
                    { new DateTime(2022, 10, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), 233.62 },
                    { new DateTime(2022, 10, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), 210.91999999999999 },
                    { new DateTime(2022, 10, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), 193.96000000000001 },
                    { new DateTime(2022, 10, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), 183.22 },
                    { new DateTime(2022, 10, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), 162.31999999999999 },
                    { new DateTime(2022, 11, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 147.37 },
                    { new DateTime(2022, 11, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 211.16999999999999 },
                    { new DateTime(2022, 11, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 209.69 },
                    { new DateTime(2022, 11, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), 187.86000000000001 },
                    { new DateTime(2022, 11, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 194.66 },
                    { new DateTime(2022, 11, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), 153.02000000000001 },
                    { new DateTime(2022, 11, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), 132.69999999999999 },
                    { new DateTime(2022, 11, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), 217.43000000000001 },
                    { new DateTime(2022, 11, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), 199.65000000000001 },
                    { new DateTime(2022, 11, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 211.58000000000001 },
                    { new DateTime(2022, 11, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), 203.02000000000001 },
                    { new DateTime(2022, 11, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 210.46000000000001 },
                    { new DateTime(2022, 11, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), 202.13999999999999 },
                    { new DateTime(2022, 11, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 182.28999999999999 },
                    { new DateTime(2022, 11, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 220.19999999999999 },
                    { new DateTime(2022, 11, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), 229.77000000000001 },
                    { new DateTime(2022, 11, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), 232.81 },
                    { new DateTime(2022, 11, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 266.00999999999999 },
                    { new DateTime(2022, 11, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), 238.99000000000001 },
                    { new DateTime(2022, 11, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 218.72999999999999 },
                    { new DateTime(2022, 11, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), 214.66999999999999 },
                    { new DateTime(2022, 11, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), 248.31 },
                    { new DateTime(2022, 11, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), 272.95999999999998 },
                    { new DateTime(2022, 11, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), 310.18000000000001 },
                    { new DateTime(2022, 11, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), 292.37 },
                    { new DateTime(2022, 11, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), 240.47 },
                    { new DateTime(2022, 11, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), 217.75999999999999 },
                    { new DateTime(2022, 11, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), 193.86000000000001 },
                    { new DateTime(2022, 11, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), 273.10000000000002 },
                    { new DateTime(2022, 11, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), 215.28 },
                    { new DateTime(2022, 12, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 220.59 },
                    { new DateTime(2022, 12, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 258.52999999999997 },
                    { new DateTime(2022, 12, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 220.84999999999999 },
                    { new DateTime(2022, 12, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), 210.09999999999999 },
                    { new DateTime(2022, 12, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 169.06999999999999 },
                    { new DateTime(2022, 12, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), 226.22999999999999 },
                    { new DateTime(2022, 12, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), 234.22999999999999 },
                    { new DateTime(2022, 12, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), 200.00999999999999 },
                    { new DateTime(2022, 12, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), 282.16000000000003 },
                    { new DateTime(2022, 12, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 245.83000000000001 },
                    { new DateTime(2022, 12, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), 213.0 },
                    { new DateTime(2022, 12, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 183.80000000000001 },
                    { new DateTime(2022, 12, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), 274.52999999999997 },
                    { new DateTime(2022, 12, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 314.56 },
                    { new DateTime(2022, 12, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 306.85000000000002 },
                    { new DateTime(2022, 12, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), 357.23000000000002 },
                    { new DateTime(2022, 12, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), 333.62 },
                    { new DateTime(2022, 12, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 257.74000000000001 },
                    { new DateTime(2022, 12, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), 226.33000000000001 },
                    { new DateTime(2022, 12, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 353.98000000000002 },
                    { new DateTime(2022, 12, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), 397.54000000000002 },
                    { new DateTime(2022, 12, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), 420.38999999999999 },
                    { new DateTime(2022, 12, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), 344.86000000000001 },
                    { new DateTime(2022, 12, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), 226.09999999999999 },
                    { new DateTime(2022, 12, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), 205.38999999999999 },
                    { new DateTime(2022, 12, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), 170.94 },
                    { new DateTime(2022, 12, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), 211.63 },
                    { new DateTime(2022, 12, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), 174.40000000000001 },
                    { new DateTime(2022, 12, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), 168.69 },
                    { new DateTime(2022, 12, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), 130.88999999999999 },
                    { new DateTime(2022, 12, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), 97.359999999999999 },
                    { new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 89.280000000000001 },
                    { new DateTime(2023, 1, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 98.959999999999994 },
                    { new DateTime(2023, 1, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 152.36000000000001 },
                    { new DateTime(2023, 1, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), 178.31999999999999 },
                    { new DateTime(2023, 1, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 147.44999999999999 },
                    { new DateTime(2023, 1, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), 193.75 },
                    { new DateTime(2023, 1, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), 198.91 },
                    { new DateTime(2023, 1, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), 185.28999999999999 },
                    { new DateTime(2023, 1, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), 171.11000000000001 },
                    { new DateTime(2023, 1, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 249.44 },
                    { new DateTime(2023, 1, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), 250.11000000000001 },
                    { new DateTime(2023, 1, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 239.78999999999999 },
                    { new DateTime(2023, 1, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), 220.66999999999999 },
                    { new DateTime(2023, 1, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 199.09 },
                    { new DateTime(2023, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 229.27000000000001 },
                    { new DateTime(2023, 1, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), 192.49000000000001 },
                    { new DateTime(2023, 1, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), 236.68000000000001 },
                    { new DateTime(2023, 1, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 241.22999999999999 },
                    { new DateTime(2023, 1, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), 234.59999999999999 },
                    { new DateTime(2023, 1, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 202.97 },
                    { new DateTime(2023, 1, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), 213.78 },
                    { new DateTime(2023, 1, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), 200.68000000000001 },
                    { new DateTime(2023, 1, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), 188.44 },
                    { new DateTime(2023, 1, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), 238.41999999999999 },
                    { new DateTime(2023, 1, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), 275.48000000000002 },
                    { new DateTime(2023, 1, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), 268.29000000000002 },
                    { new DateTime(2023, 1, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), 281.80000000000001 },
                    { new DateTime(2023, 1, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), 242.18000000000001 },
                    { new DateTime(2023, 1, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), 221.61000000000001 },
                    { new DateTime(2023, 1, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), 214.66 },
                    { new DateTime(2023, 1, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), 239.52000000000001 },
                    { new DateTime(2023, 2, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 230.63 },
                    { new DateTime(2023, 2, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 240.28 },
                    { new DateTime(2023, 2, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 218.44999999999999 },
                    { new DateTime(2023, 2, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), 235.40000000000001 },
                    { new DateTime(2023, 2, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 213.63 },
                    { new DateTime(2023, 2, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), 201.87 },
                    { new DateTime(2023, 2, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), 199.44 },
                    { new DateTime(2023, 2, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), 189.91999999999999 },
                    { new DateTime(2023, 2, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), 232.49000000000001 },
                    { new DateTime(2023, 2, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 218.06999999999999 },
                    { new DateTime(2023, 2, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), 220.65000000000001 },
                    { new DateTime(2023, 2, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 190.63999999999999 },
                    { new DateTime(2023, 2, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), 173.65000000000001 },
                    { new DateTime(2023, 2, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 215.77000000000001 },
                    { new DateTime(2023, 2, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 210.63 },
                    { new DateTime(2023, 2, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), 204.47999999999999 },
                    { new DateTime(2023, 2, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), 180.36000000000001 },
                    { new DateTime(2023, 2, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 168.93000000000001 },
                    { new DateTime(2023, 2, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), 139.43000000000001 },
                    { new DateTime(2023, 2, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 149.5 },
                    { new DateTime(2023, 2, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), 171.34 },
                    { new DateTime(2023, 2, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), 153.41999999999999 },
                    { new DateTime(2023, 2, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), 170.96000000000001 },
                    { new DateTime(2023, 2, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), 173.59 },
                    { new DateTime(2023, 2, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), 235.81 },
                    { new DateTime(2023, 2, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), 221.78999999999999 },
                    { new DateTime(2023, 2, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), 159.90000000000001 },
                    { new DateTime(2023, 2, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), 245.46000000000001 },
                    { new DateTime(2023, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 271.44 },
                    { new DateTime(2023, 3, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 276.45999999999998 },
                    { new DateTime(2023, 3, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 334.01999999999998 },
                    { new DateTime(2023, 3, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), 384.79000000000002 },
                    { new DateTime(2023, 3, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 335.74000000000001 },
                    { new DateTime(2023, 3, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), 339.32999999999998 },
                    { new DateTime(2023, 3, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), 416.77999999999997 },
                    { new DateTime(2023, 3, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), 536.45000000000005 },
                    { new DateTime(2023, 3, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), 517.0 },
                    { new DateTime(2023, 3, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 367.82999999999998 },
                    { new DateTime(2023, 3, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), 320.35000000000002 },
                    { new DateTime(2023, 3, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 281.57999999999998 },
                    { new DateTime(2023, 3, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), 263.44 },
                    { new DateTime(2023, 3, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 336.29000000000002 },
                    { new DateTime(2023, 3, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 307.87 },
                    { new DateTime(2023, 3, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), 287.69 },
                    { new DateTime(2023, 3, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), 255.71000000000001 },
                    { new DateTime(2023, 3, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 238.02000000000001 },
                    { new DateTime(2023, 3, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), 190.22999999999999 },
                    { new DateTime(2023, 3, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 182.25 },
                    { new DateTime(2023, 3, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), 236.69 },
                    { new DateTime(2023, 3, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), 247.25999999999999 },
                    { new DateTime(2023, 3, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), 244.61000000000001 },
                    { new DateTime(2023, 3, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), 245.75 },
                    { new DateTime(2023, 3, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), 247.97 },
                    { new DateTime(2023, 3, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), 209.99000000000001 },
                    { new DateTime(2023, 3, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), 211.49000000000001 },
                    { new DateTime(2023, 3, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), 239.50999999999999 },
                    { new DateTime(2023, 3, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), 257.38 },
                    { new DateTime(2023, 3, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), 254.66 },
                    { new DateTime(2023, 3, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), 212.47 },
                    { new DateTime(2023, 4, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 164.12 },
                    { new DateTime(2023, 4, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 149.69999999999999 },
                    { new DateTime(2023, 4, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 174.28999999999999 },
                    { new DateTime(2023, 4, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), 224.19 },
                    { new DateTime(2023, 4, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 223.56 },
                    { new DateTime(2023, 4, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), 187.69 },
                    { new DateTime(2023, 4, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), 162.56 },
                    { new DateTime(2023, 4, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), 181.28999999999999 },
                    { new DateTime(2023, 4, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), 128.62 },
                    { new DateTime(2023, 4, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 133.55000000000001 },
                    { new DateTime(2023, 4, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), 237.46000000000001 },
                    { new DateTime(2023, 4, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 220.30000000000001 },
                    { new DateTime(2023, 4, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), 221.00999999999999 },
                    { new DateTime(2023, 4, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 226.44 },
                    { new DateTime(2023, 4, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 184.78999999999999 },
                    { new DateTime(2023, 4, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), 162.03999999999999 },
                    { new DateTime(2023, 4, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), 126.73999999999999 },
                    { new DateTime(2023, 4, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 146.94 },
                    { new DateTime(2023, 4, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), 231.63999999999999 },
                    { new DateTime(2023, 4, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 235.87 },
                    { new DateTime(2023, 4, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), 209.28999999999999 },
                    { new DateTime(2023, 4, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), 184.78999999999999 },
                    { new DateTime(2023, 4, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), 166.83000000000001 },
                    { new DateTime(2023, 4, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), 125.55 },
                    { new DateTime(2023, 4, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), 196.25 },
                    { new DateTime(2023, 4, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), 242.88999999999999 },
                    { new DateTime(2023, 4, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), 239.19999999999999 },
                    { new DateTime(2023, 4, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), 241.53 },
                    { new DateTime(2023, 4, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), 223.12 },
                    { new DateTime(2023, 4, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), 199.91 },
                    { new DateTime(2023, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 190.12 },
                    { new DateTime(2023, 5, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 234.33000000000001 },
                    { new DateTime(2023, 5, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 224.06999999999999 },
                    { new DateTime(2023, 5, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), 232.02000000000001 },
                    { new DateTime(2023, 5, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 243.38999999999999 },
                    { new DateTime(2023, 5, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), 230.66999999999999 },
                    { new DateTime(2023, 5, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), 196.25 },
                    { new DateTime(2023, 5, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), 183.12 },
                    { new DateTime(2023, 5, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), 226.41999999999999 },
                    { new DateTime(2023, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 241.59999999999999 },
                    { new DateTime(2023, 5, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), 223.96000000000001 },
                    { new DateTime(2023, 5, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 218.81999999999999 },
                    { new DateTime(2023, 5, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), 214.55000000000001 },
                    { new DateTime(2023, 5, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 174.02000000000001 },
                    { new DateTime(2023, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 158.11000000000001 },
                    { new DateTime(2023, 5, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), 214.53 },
                    { new DateTime(2023, 5, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), 232.44 },
                    { new DateTime(2023, 5, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 204.63999999999999 },
                    { new DateTime(2023, 5, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), 208.94999999999999 },
                    { new DateTime(2023, 5, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 205.93000000000001 },
                    { new DateTime(2023, 5, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), 147.69999999999999 },
                    { new DateTime(2023, 5, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), 175.16999999999999 },
                    { new DateTime(2023, 5, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), 212.84 },
                    { new DateTime(2023, 5, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), 209.47 },
                    { new DateTime(2023, 5, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), 194.03999999999999 },
                    { new DateTime(2023, 5, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), 196.56 },
                    { new DateTime(2023, 5, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), 194.40000000000001 },
                    { new DateTime(2023, 5, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), 178.97 },
                    { new DateTime(2023, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), 157.59 },
                    { new DateTime(2023, 5, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), 227.16 },
                    { new DateTime(2023, 5, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), 227.97 },
                    { new DateTime(2023, 6, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 223.19999999999999 },
                    { new DateTime(2023, 6, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 208.06999999999999 },
                    { new DateTime(2023, 6, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 200.47 },
                    { new DateTime(2023, 6, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), 187.75999999999999 },
                    { new DateTime(2023, 6, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 157.13 },
                    { new DateTime(2023, 6, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), 181.80000000000001 },
                    { new DateTime(2023, 6, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), 222.78 },
                    { new DateTime(2023, 6, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), 220.05000000000001 },
                    { new DateTime(2023, 6, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), 216.62 },
                    { new DateTime(2023, 6, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 196.13999999999999 },
                    { new DateTime(2023, 6, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), 166.97 },
                    { new DateTime(2023, 6, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 115.89 },
                    { new DateTime(2023, 6, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), 195.71000000000001 },
                    { new DateTime(2023, 6, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 212.80000000000001 },
                    { new DateTime(2023, 6, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 219.37 },
                    { new DateTime(2023, 6, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), 248.16999999999999 },
                    { new DateTime(2023, 6, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), 260.01999999999998 },
                    { new DateTime(2023, 6, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 202.44 },
                    { new DateTime(2023, 6, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), 180.36000000000001 },
                    { new DateTime(2023, 6, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 268.77999999999997 },
                    { new DateTime(2023, 6, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), 309.67000000000002 },
                    { new DateTime(2023, 6, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), 314.88999999999999 },
                    { new DateTime(2023, 6, 23, 0, 0, 0, 0, DateTimeKind.Unspecified), 306.54000000000002 },
                    { new DateTime(2023, 6, 24, 0, 0, 0, 0, DateTimeKind.Unspecified), 295.60000000000002 },
                    { new DateTime(2023, 6, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), 277.43000000000001 },
                    { new DateTime(2023, 6, 26, 0, 0, 0, 0, DateTimeKind.Unspecified), 269.22000000000003 },
                    { new DateTime(2023, 6, 27, 0, 0, 0, 0, DateTimeKind.Unspecified), 343.0 },
                    { new DateTime(2023, 6, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), 365.72000000000003 },
                    { new DateTime(2023, 6, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), 361.94999999999999 },
                    { new DateTime(2023, 6, 30, 0, 0, 0, 0, DateTimeKind.Unspecified), 351.55000000000001 },
                    { new DateTime(2023, 7, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 358.08999999999997 },
                    { new DateTime(2023, 7, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 286.13999999999999 },
                    { new DateTime(2023, 7, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 256.43000000000001 },
                    { new DateTime(2023, 7, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), 336.13 },
                    { new DateTime(2023, 7, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 381.23000000000002 },
                    { new DateTime(2023, 7, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), 362.14999999999998 },
                    { new DateTime(2023, 7, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), 362.72000000000003 },
                    { new DateTime(2023, 7, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), 343.14999999999998 },
                    { new DateTime(2023, 7, 9, 0, 0, 0, 0, DateTimeKind.Unspecified), 233.03 },
                    { new DateTime(2023, 7, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 231.83000000000001 },
                    { new DateTime(2023, 7, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), 367.63 },
                    { new DateTime(2023, 7, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 387.30000000000001 },
                    { new DateTime(2023, 7, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), 376.41000000000003 },
                    { new DateTime(2023, 7, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 414.44 },
                    { new DateTime(2023, 7, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 412.70999999999998 },
                    { new DateTime(2023, 7, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), 320.35000000000002 }
                });

            migrationBuilder.InsertData(
                table: "Region",
                columns: new[] { "Id", "RegionName" },
                values: new object[] { "8963cd78-afa4-4723-9b67-331a3fc180f8", "Šumadija" });

            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "RoleName" },
                values: new object[,]
                {
                    { 1L, "Dso" },
                    { 2L, "WorkerDso" },
                    { 3L, "Prosumer" }
                });

            migrationBuilder.InsertData(
                table: "DSO",
                columns: new[] { "Id", "DateCreate", "Email", "FirstName", "HashPassword", "Image", "LastName", "RegionId", "RoleId", "Salary", "SaltPassword", "Token", "TokenExpiry", "Username" },
                values: new object[] { "7e38047f-8891-449b-8cd3-942c7fe2aa15", "4/15/2023 12:00:00 AM", "laza@gmail.com", "Laza", new byte[] { 231, 102, 56, 203, 241, 4, 57, 120, 188, 246, 235, 168, 1, 94, 255, 10, 119, 14, 209, 226, 188, 110, 84, 248, 160, 219, 160, 2, 244, 150, 17, 53, 87, 58, 117, 141, 76, 188, 16, 115, 248, 47, 109, 84, 154, 99, 224, 158, 215, 234, 140, 123, 11, 17, 212, 176, 187, 139, 180, 1, 77, 187, 114, 194 }, null, "Lazic", "8963cd78-afa4-4723-9b67-331a3fc180f8", 1L, 0L, new byte[] { 157, 105, 128, 131, 241, 147, 92, 49, 142, 246, 252, 254, 211, 231, 10, 161, 150, 130, 18, 63, 135, 52, 251, 19, 173, 115, 104, 104, 29, 19, 239, 28, 99, 131, 145, 148, 118, 230, 151, 137, 219, 22, 230, 240, 22, 234, 244, 15, 154, 83, 183, 222, 13, 152, 141, 157, 217, 220, 228, 11, 138, 129, 185, 92, 250, 149, 10, 178, 77, 156, 26, 95, 152, 26, 42, 116, 141, 103, 87, 121, 2, 39, 105, 226, 105, 51, 121, 55, 241, 10, 35, 83, 99, 123, 42, 180, 60, 213, 192, 138, 14, 244, 112, 203, 72, 34, 119, 133, 120, 47, 25, 212, 26, 145, 55, 62, 138, 8, 206, 102, 9, 116, 4, 68, 105, 141, 42, 6 }, null, null, "lazalazic9" });

            migrationBuilder.InsertData(
                table: "DeviceType",
                columns: new[] { "Id", "CategoryId", "Name" },
                values: new object[,]
                {
                    { 1L, 1L, "Fridge" },
                    { 2L, 1L, "Tv" },
                    { 3L, 1L, "Oven" },
                    { 4L, 1L, "AC" },
                    { 5L, 1L, "Micowave" },
                    { 6L, 1L, "Dishwasher" },
                    { 8L, 1L, "PC" },
                    { 9L, 1L, "Washing Machine" },
                    { 10L, 1L, "Dryer" },
                    { 14L, 1L, "Boiler" },
                    { 18L, 1L, "Heater" },
                    { 19L, 2L, "Solar Panel" },
                    { 20L, 2L, "Wind Turbine" }
                });

            migrationBuilder.InsertData(
                table: "Neigborhood",
                columns: new[] { "Id", "CityId", "NeigbName" },
                values: new object[,]
                {
                    { "03c9e550-8811-4ece-b145-594f56d43a60", 1L, "Aerodrom" },
                    { "33c9626a-6edc-44cf-8b9e-aed8e578e0ab", 1L, "Beloševac" },
                    { "4b71b345-2d49-4995-b7bf-a9c6fa148587", 1L, "Ilićevo" },
                    { "5f880a5e-331d-4318-8a70-451b4110fbba", 1L, "Bresnica" },
                    { "68885c71-416b-448e-9791-e02b00f684d2", 1L, "Petrovac" },
                    { "76a3fa16-b9b2-4e6f-8e63-722ea72e3fb1", 1L, "Stanovo" },
                    { "83da25bd-f0d2-4aae-b356-fcad17495df8", 1L, "Šumarice" },
                    { "c434223c-36e9-4d96-9114-d2dfe2cd76fa", 1L, "Centar" },
                    { "d4423129-03df-4475-a7d8-b6c9451cceb8", 1L, "Pivara" },
                    { "d9549b0d-e614-46f2-88ed-ad9608ad9ef2", 1L, "Sušica" },
                    { "e06b5e5f-f31f-45af-9d14-479c159f1987", 1L, "Ilina Voda" },
                    { "e491da79-424d-48ce-841a-e82696ea9fb3", 1L, "Erdoglija" },
                    { "f1237e1a-8021-4419-97a7-a13c39b8ee44", 1L, "Vinogradi" }
                });

            migrationBuilder.InsertData(
                table: "DeviceInfo",
                columns: new[] { "Id", "CategoryId", "Manufacturer", "Name", "TypeId", "Wattage" },
                values: new object[,]
                {
                    { "6420b43190d65ae1554350a9", 1L, "VOX", "Frižider KG2500F", 1L, 0.040000000000000001 },
                    { "6420b43190d65ae1554350aa", 1L, "LG", "Kombinovani frižider GBF71PZDMN", 1L, 0.069000000000000006 },
                    { "6420b43190d65ae1554350ab", 1L, "Gorenje", "Kombinovani frižider NRK6191EW4", 1L, 0.083000000000000004 },
                    { "6420b43190d65ae1554350ac", 1L, "Philips", "SMART Televizor 32PHS6605/12", 2L, 0.12 },
                    { "6420b43190d65ae1554350ad", 1L, "SAMSUNG", "TV UE55AU7172UXXH SMART", 2L, 0.070999999999999994 },
                    { "6420b43190d65ae1554350ae", 1L, "LG", "TV 50UQ80003LB.AEU", 2L, 0.17999999999999999 },
                    { "6420b43190d65ae1554350af", 1L, "BEKO", "FSE64320DS Kombinovani šporet", 3L, 2.2999999999999998 },
                    { "6420b43190d65ae1554350b0", 1L, "Tesla", "Električni šporet CS6400SX", 3L, 1.5 },
                    { "6420b43190d65ae1554350b1", 1L, "Gorenje", "GE6A40WB Električni šporet", 3L, 2.1000000000000001 },
                    { "6420b43190d65ae1554350b2", 1L, "Tesla", "TT27X81-09410A Klima uređaj", 4L, 0.72999999999999998 },
                    { "6420b43190d65ae1554350b3", 1L, "BEKO", "Klima uređaj 180/BBFDB 181", 4L, 1.8 },
                    { "6420b43190d65ae1554350b4", 1L, "VIVAX", "Ventilator FS-451TB", 4L, 0.029999999999999999 },
                    { "6420b43190d65ae1554350b5", 1L, "LG", "Mikrotalasna rerna MH6336GIB", 5L, 0.59999999999999998 },
                    { "6420b43190d65ae1554350b6", 1L, "Panasonic", "Mikrotalasna rerna NN-DF383BEPG", 5L, 0.40000000000000002 },
                    { "6420b43190d65ae1554350b7", 1L, "Gorenje", "Mašina za pranje sudova GS520E15W", 6L, 1.2 },
                    { "6420b43190d65ae1554350b8", 1L, "Bosch", "Mašina za pranje sudova SMS4HVW33E", 6L, 1.5 },
                    { "6420b43190d65ae1554350b9", 2L, null, "Solarni Panel 175M monokristalni", 19L, 0.40000000000000002 },
                    { "6420b43190d65ae1554350ba", 1L, "Intel", "NUC BNUC11TNHI50002 Računar", 8L, 0.059999999999999998 },
                    { "6420b43190d65ae1554350bb", 1L, "HP", "290 G3 - 123P9EA", 8L, 0.14999999999999999 },
                    { "6420b43190d65ae1554350bc", 1L, "DELL", "Inspiron 5402 - NOT19604", 8L, 0.040000000000000001 },
                    { "6420b43190d65ae1554350bf", 1L, "Gorenje", "Mašina za pranje veša WNEI94ADS", 9L, 0.5 },
                    { "6420b43190d65ae1554350c0", 1L, "Miele", "Mašina za pranje veša WED135 WPS", 9L, 0.69999999999999996 },
                    { "6420b43190d65ae1554350c1", 1L, "Bosch", "Mašina za sušenje veša WTX87KH1BY", 10L, 2.0 },
                    { "6420b43190d65ae1554350c2", 1L, "Gorenje", "DNE8B Mašina za sušenje veša", 10L, 2.7000000000000002 },
                    { "6420b43190d65ae1554350c3", 2L, "SD", "SD1 vetrenjača", 20L, 0.75 },
                    { "6420b43190d65ae1554350c4", 2L, null, "Solarni panel 60M monokristalni", 19L, 0.23000000000000001 },
                    { "6420b43190d65ae1554350c5", 2L, "SD", "SD4 vetrenjača", 20L, 1.0800000000000001 },
                    { "6420b43190d65ae1554350c6", 2L, "SD", "SD3 vetrenjača", 20L, 1.0 },
                    { "6420b43190d65ae1554350c7", 2L, null, "Solarni panel 250M monokristalni", 19L, 1.8 },
                    { "6420b43190d65ae1554350c8", 2L, "SD", "SD5 vetrenjača", 20L, 2.1000000000000001 },
                    { "6420b43190d65ae1554350c9", 2L, null, "Solarni panel 275M monokristalni", 19L, 2.5 },
                    { "6420b43190d65ae1554350ca", 1L, "Gorenje", "Bojler TGR50SMT", 14L, 8.0 },
                    { "6420b43190d65ae1554350cb", 1L, "Metalac", "Bojler Hydra EZV P50 R", 14L, 10.199999999999999 },
                    { "6420b43190d65ae1554350cc", 2L, null, "Solarni panel 215M monokristalni", 19L, 1.3999999999999999 },
                    { "6420b43190d65ae1554350cd", 2L, "SD", "SD6 vetrenjača", 20L, 1.8999999999999999 },
                    { "6420b43190d65ae1554350d0", 1L, "Radialight", "Grejalica SIRIO 20", 18L, 1.5 },
                    { "642339d634ce75fedb564cc8", 2L, "Felicity", "Solarni panel 165M monokristalni", 19L, 0.34999999999999998 },
                    { "642339d634ce75fedb564cc9", 2L, "SD", "SD2 vetrenjača", 20L, 1.5 }
                });

            migrationBuilder.InsertData(
                table: "Prosumer",
                columns: new[] { "Id", "Address", "CityID", "DateCreate", "Email", "FirstName", "HashPassword", "Image", "LastName", "Latitude", "Longitude", "NeigborhoodID", "RegionID", "RoleID", "SaltPassword", "Token", "TokenExpiry", "Username" },
                values: new object[,]
                {
                    { "2562a789-6d38-44bf-baf8-7b3a4f6c8ca5", "Daniciceva 12", 1L, "4/15/2023 1:14:22 AM", "nikola@gmail.com", "Nikola", new byte[] { 231, 102, 56, 203, 241, 4, 57, 120, 188, 246, 235, 168, 1, 94, 255, 10, 119, 14, 209, 226, 188, 110, 84, 248, 160, 219, 160, 2, 244, 150, 17, 53, 87, 58, 117, 141, 76, 188, 16, 115, 248, 47, 109, 84, 154, 99, 224, 158, 215, 234, 140, 123, 11, 17, 212, 176, 187, 139, 180, 1, 77, 187, 114, 194 }, null, "Nikolic", "44.0111676", "20.9098523", "c434223c-36e9-4d96-9114-d2dfe2cd76fa", "8963cd78-afa4-4723-9b67-331a3fc180f8", 3L, new byte[] { 157, 105, 128, 131, 241, 147, 92, 49, 142, 246, 252, 254, 211, 231, 10, 161, 150, 130, 18, 63, 135, 52, 251, 19, 173, 115, 104, 104, 29, 19, 239, 28, 99, 131, 145, 148, 118, 230, 151, 137, 219, 22, 230, 240, 22, 234, 244, 15, 154, 83, 183, 222, 13, 152, 141, 157, 217, 220, 228, 11, 138, 129, 185, 92, 250, 149, 10, 178, 77, 156, 26, 95, 152, 26, 42, 116, 141, 103, 87, 121, 2, 39, 105, 226, 105, 51, 121, 55, 241, 10, 35, 83, 99, 123, 42, 180, 60, 213, 192, 138, 14, 244, 112, 203, 72, 34, 119, 133, 120, 47, 25, 212, 26, 145, 55, 62, 138, 8, 206, 102, 9, 116, 4, 68, 105, 141, 42, 6 }, null, null, "nikolanikolic6" },
                    { "44fbdf08-7ae3-4811-908f-6910c7e2c11c", "Svetogorska 10", 1L, "4/15/2023 1:14:22 AM", "pera@gmail.com", "Pera", new byte[] { 231, 102, 56, 203, 241, 4, 57, 120, 188, 246, 235, 168, 1, 94, 255, 10, 119, 14, 209, 226, 188, 110, 84, 248, 160, 219, 160, 2, 244, 150, 17, 53, 87, 58, 117, 141, 76, 188, 16, 115, 248, 47, 109, 84, 154, 99, 224, 158, 215, 234, 140, 123, 11, 17, 212, 176, 187, 139, 180, 1, 77, 187, 114, 194 }, null, "Peric", "44.02943", "20.91146", "03c9e550-8811-4ece-b145-594f56d43a60", "8963cd78-afa4-4723-9b67-331a3fc180f8", 3L, new byte[] { 157, 105, 128, 131, 241, 147, 92, 49, 142, 246, 252, 254, 211, 231, 10, 161, 150, 130, 18, 63, 135, 52, 251, 19, 173, 115, 104, 104, 29, 19, 239, 28, 99, 131, 145, 148, 118, 230, 151, 137, 219, 22, 230, 240, 22, 234, 244, 15, 154, 83, 183, 222, 13, 152, 141, 157, 217, 220, 228, 11, 138, 129, 185, 92, 250, 149, 10, 178, 77, 156, 26, 95, 152, 26, 42, 116, 141, 103, 87, 121, 2, 39, 105, 226, 105, 51, 121, 55, 241, 10, 35, 83, 99, 123, 42, 180, 60, 213, 192, 138, 14, 244, 112, 203, 72, 34, 119, 133, 120, 47, 25, 212, 26, 145, 55, 62, 138, 8, 206, 102, 9, 116, 4, 68, 105, 141, 42, 6 }, null, null, "peraperic6" },
                    { "d2250fa2-2de2-4650-8945-c0578288afb9", "Bulevar Kraljice Marije 8", 1L, "4/15/2023 1:14:22 AM", "mika@gmail.com", "Mika", new byte[] { 231, 102, 56, 203, 241, 4, 57, 120, 188, 246, 235, 168, 1, 94, 255, 10, 119, 14, 209, 226, 188, 110, 84, 248, 160, 219, 160, 2, 244, 150, 17, 53, 87, 58, 117, 141, 76, 188, 16, 115, 248, 47, 109, 84, 154, 99, 224, 158, 215, 234, 140, 123, 11, 17, 212, 176, 187, 139, 180, 1, 77, 187, 114, 194 }, null, "Mikic", "44.0141", "20.90061", "e491da79-424d-48ce-841a-e82696ea9fb3", "8963cd78-afa4-4723-9b67-331a3fc180f8", 3L, new byte[] { 157, 105, 128, 131, 241, 147, 92, 49, 142, 246, 252, 254, 211, 231, 10, 161, 150, 130, 18, 63, 135, 52, 251, 19, 173, 115, 104, 104, 29, 19, 239, 28, 99, 131, 145, 148, 118, 230, 151, 137, 219, 22, 230, 240, 22, 234, 244, 15, 154, 83, 183, 222, 13, 152, 141, 157, 217, 220, 228, 11, 138, 129, 185, 92, 250, 149, 10, 178, 77, 156, 26, 95, 152, 26, 42, 116, 141, 103, 87, 121, 2, 39, 105, 226, 105, 51, 121, 55, 241, 10, 35, 83, 99, 123, 42, 180, 60, 213, 192, 138, 14, 244, 112, 203, 72, 34, 119, 133, 120, 47, 25, 212, 26, 145, 55, 62, 138, 8, 206, 102, 9, 116, 4, 68, 105, 141, 42, 6 }, null, null, "mikamikic6" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_DeviceInfo_CategoryId",
                table: "DeviceInfo",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_DeviceInfo_TypeId",
                table: "DeviceInfo",
                column: "TypeId");

            migrationBuilder.CreateIndex(
                name: "IX_DeviceType_CategoryId",
                table: "DeviceType",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_DSO_RegionId",
                table: "DSO",
                column: "RegionId");

            migrationBuilder.CreateIndex(
                name: "IX_DSO_RoleId",
                table: "DSO",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_DSO_Username",
                table: "DSO",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Neigborhood_CityId",
                table: "Neigborhood",
                column: "CityId");

            migrationBuilder.CreateIndex(
                name: "IX_Prosumer_CityID",
                table: "Prosumer",
                column: "CityID");

            migrationBuilder.CreateIndex(
                name: "IX_Prosumer_NeigborhoodID",
                table: "Prosumer",
                column: "NeigborhoodID");

            migrationBuilder.CreateIndex(
                name: "IX_Prosumer_RegionID",
                table: "Prosumer",
                column: "RegionID");

            migrationBuilder.CreateIndex(
                name: "IX_Prosumer_RoleID",
                table: "Prosumer",
                column: "RoleID");

            migrationBuilder.CreateIndex(
                name: "IX_Prosumer_Username",
                table: "Prosumer",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProsumerLinks_ModelId",
                table: "ProsumerLinks",
                column: "ModelId");

            migrationBuilder.CreateIndex(
                name: "IX_ProsumerLinks_ProsumerId",
                table: "ProsumerLinks",
                column: "ProsumerId");

            migrationBuilder.CreateIndex(
                name: "IX_Region_RegionName",
                table: "Region",
                column: "RegionName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Role_Id",
                table: "Role",
                column: "Id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DSO");

            migrationBuilder.DropTable(
                name: "ElectricityPrices");

            migrationBuilder.DropTable(
                name: "ProsumerLinks");

            migrationBuilder.DropTable(
                name: "DeviceInfo");

            migrationBuilder.DropTable(
                name: "Prosumer");

            migrationBuilder.DropTable(
                name: "DeviceType");

            migrationBuilder.DropTable(
                name: "Neigborhood");

            migrationBuilder.DropTable(
                name: "Region");

            migrationBuilder.DropTable(
                name: "Role");

            migrationBuilder.DropTable(
                name: "DeviceCategory");

            migrationBuilder.DropTable(
                name: "City");
        }
    }
}
