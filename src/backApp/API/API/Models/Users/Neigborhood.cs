using System;
using System.Collections.Generic;

namespace API.Models.Users;

public partial class Neigborhood
{
    public string Id { get; set; } = null!;
    public long CityId { get; set; }

    public string NeigbName { get; set; } = null!;
    public virtual City City { get; set; }
    public virtual ICollection<Prosumer> Prosumers { get; } = new List<Prosumer>();
}
