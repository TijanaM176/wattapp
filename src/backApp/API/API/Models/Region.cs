using System;
using System.Collections.Generic;

namespace API.Models;

public partial class Region
{
    public string Id { get; set; } = null!;

    public string RegionName { get; set; } = null!;

    public virtual ICollection<Prosumer> Prosumers { get; } = new List<Prosumer>();
}
