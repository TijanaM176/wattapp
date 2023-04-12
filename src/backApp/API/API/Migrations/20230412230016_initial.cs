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
                    { "6420b43190d65ae1554350ba", 1L, "Intel", "NUC BNUC11TNHI50002 Računar", 8L, 0.059999999999999998 },
                    { "6420b43190d65ae1554350bb", 1L, "HP", "290 G3 - 123P9EA", 8L, 0.14999999999999999 },
                    { "6420b43190d65ae1554350bc", 1L, "DELL", "Inspiron 5402 - NOT19604", 8L, 0.040000000000000001 },
                    { "6420b43190d65ae1554350bf", 1L, "Gorenje", "Mašina za pranje veša WNEI94ADS", 9L, 0.5 },
                    { "6420b43190d65ae1554350c0", 1L, "Miele", "Mašina za pranje veša WED135 WPS", 9L, 0.69999999999999996 },
                    { "6420b43190d65ae1554350c1", 1L, "Bosch", "Mašina za sušenje veša WTX87KH1BY", 10L, 2.0 },
                    { "6420b43190d65ae1554350c2", 1L, "Gorenje", "DNE8B Mašina za sušenje veša", 10L, 2.7000000000000002 },
                    { "6420b43190d65ae1554350ca", 1L, "Gorenje", "Bojler TGR50SMT", 14L, 8.0 },
                    { "6420b43190d65ae1554350cb", 1L, "Metalac", "Bojler Hydra EZV P50 R", 14L, 10.199999999999999 },
                    { "6420b43190d65ae1554350d0", 1L, "Radialight", "Grejalica SIRIO 20", 18L, 1.5 },
                    { "642339d634ce75fedb564cc8", 2L, "Felicity", "Solarni panel 165M monokristalni", 19L, 0.34999999999999998 },
                    { "642339d634ce75fedb564cc9", 2L, "SD", "SD2 Wind Turbine", 20L, 1.5 }
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
