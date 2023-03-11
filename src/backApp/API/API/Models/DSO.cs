using System;
using System.Collections.Generic;

namespace API.Models;

public partial class Dso : User
{


    public long? Salary { get; set; }

    public string? DateCreate { get; set; }
}
