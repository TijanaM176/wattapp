using System;
using System.Collections.Generic;

namespace API.Models;

public partial class Neigborhood
{
    public string Id { get; set; } = null!;

    public string NeigbName { get; set; } = null!;

    public virtual ICollection<Prosumer> Prosumers { get; } = new List<Prosumer>();
}
