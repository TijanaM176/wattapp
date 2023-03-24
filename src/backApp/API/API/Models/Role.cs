using System;
using System.Collections.Generic;
using API.Models.Users;
namespace API.Models;

public partial class Role
{
    public long Id { get; set; }

    public string RoleName { get; set; } = null!;

    public virtual ICollection<Dso> Dsos { get; } = new List<Dso>();

    public virtual ICollection<Prosumer> Prosumers { get; } = new List<Prosumer>();
}
