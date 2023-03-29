using System;
using System.Collections.Generic;
namespace API.Models.Users;

public partial class Role
{
    public long Id { get; set; }

    public string RoleName { get; set; } = null!;

    public virtual ICollection<Dso> Dsos { get; } = new List<Dso>();

    public virtual ICollection<Prosumer> Prosumers { get; } = new List<Prosumer>();
}
