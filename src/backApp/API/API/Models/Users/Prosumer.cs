using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using API.Models.Devices;

namespace API.Models.Users;

public partial class Prosumer : User
{
 

    public string? Address { get; set; }

    public long? CityId { get; set; }

    public string? NeigborhoodId { get; set; }

    public string? Latitude { get; set; }

    public string? Longitude { get; set; }

    public virtual City? City { get; set; }

    public virtual Neigborhood? Neigborhood { get; set; }

    public ICollection<ProsumerLink> Links{ get; set; }
}