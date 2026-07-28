using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace GreenCart_Admin_Service_.NET_.Models;

public partial class Role
{
    public int RoleId { get; set; }

    public string RoleName { get; set; } = null!;

    public string? RoleDescription { get; set; }

    [JsonIgnore]
    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
