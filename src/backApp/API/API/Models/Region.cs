using System;
using System.Collections.Generic;
using API.Models.Users;
namespace API.Models;

public partial class Region
{
    public string Id { get; set; } = null!;

    public string RegionName { get; set; } = null!;

    public virtual ICollection<Dso> Dsos { get; } = new List<Dso>();

    public virtual ICollection<Prosumer> Prosumers { get; } = new List<Prosumer>();
}
