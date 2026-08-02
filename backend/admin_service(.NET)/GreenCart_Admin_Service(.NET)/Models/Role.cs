using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace GreenCart_Admin_Service_.NET_.Models;

public partial class Role
{
    public int RoleId { get; set; }

    public string RoleName { get; set; } = null!;

    public string? RoleDescription { get; set; }

    [JsonIgnore]
    [NotMapped]
    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
