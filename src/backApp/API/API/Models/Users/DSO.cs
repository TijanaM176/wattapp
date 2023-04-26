using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using API.Models;

namespace API.Models.Users;

    public partial class Dso : User
    {
        public long? Salary { get; set; }



    }
