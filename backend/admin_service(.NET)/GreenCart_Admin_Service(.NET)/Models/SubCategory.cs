using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace GreenCart_Admin_Service_.NET_.Models;

public partial class SubCategory
{
    public int SubCategoryId { get; set; }

    public int CategoryId { get; set; }

    public string? SubCategoryName { get; set; }

    public string? Status { get; set; }

    public virtual Category? Category { get; set; }

    [JsonIgnore]
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
