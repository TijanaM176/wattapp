using System;
using System.Collections.Generic;
using API.Models.Users;
namespace API.Models;

public partial class City
{
    public long Id { get; set; }

    public string? Name { get; set; }

    public virtual ICollection<Prosumer> Prosumers { get; } = new List<Prosumer>();
}
