using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace GreenCart_Admin_Service_.NET_.Models;

public partial class Category
{
    public int CategoryId { get; set; }

    public string? CategoryName { get; set; }

    public string? Status { get; set; }

    [JsonIgnore]
    public virtual ICollection<SubCategory> SubCategories { get; set; } = new List<SubCategory>();
}
