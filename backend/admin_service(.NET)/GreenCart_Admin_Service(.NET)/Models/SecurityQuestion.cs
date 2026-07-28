using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace GreenCart_Admin_Service_.NET_.Models;

public partial class SecurityQuestion
{
    public int QuestionId { get; set; }

    public string Question { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
