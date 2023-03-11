using System;
using System.Collections.Generic;

namespace API.Models;

public partial class Prosumer : User
{
   

    public string? Address { get; set; }

    public string? NeigborhoodId { get; set; }

    public virtual Neigborhood? Neigborhood { get; set; }

}
