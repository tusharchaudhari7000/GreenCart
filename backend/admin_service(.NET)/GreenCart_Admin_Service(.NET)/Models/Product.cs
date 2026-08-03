using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace GreenCart_Admin_Service_.NET_.Models;

public partial class Product
{
    public int Pid { get; set; }

    public string? Pname { get; set; }

    public int SubCategoryId { get; set; }

    public string? Description { get; set; }

    [JsonIgnore]
    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    [JsonIgnore]
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    [JsonIgnore]
    public virtual ICollection<ProductsStock> ProductsStocks { get; set; } = new List<ProductsStock>();

    public virtual SubCategory? SubCategory { get; set; }
}
