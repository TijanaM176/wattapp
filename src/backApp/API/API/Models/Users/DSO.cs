using System;
using System.Collections.Generic;

namespace API.Models.Users;

public partial class Dso : User
{
    public long? Salary { get; set; }
}
