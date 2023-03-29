using System;
using System.Collections.Generic;

namespace API.Models.Users;

public partial class City
{
    public long Id { get; set; }

    public string? Name { get; set; }

    public virtual ICollection<Neigborhood> Neighborhoods { get; } = new List<Neigborhood>();
    public virtual ICollection<Prosumer> Prosumers { get; } = new List<Prosumer>();
}
