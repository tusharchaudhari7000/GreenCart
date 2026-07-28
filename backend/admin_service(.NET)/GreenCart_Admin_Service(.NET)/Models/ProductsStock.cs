using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace GreenCart_Admin_Service_.NET_.Models;

public partial class ProductsStock
{
    public int StockId { get; set; }

    public int ProductId { get; set; }

    public int SellerId { get; set; }

    public decimal Price { get; set; }

    public int Quantity { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? ImagePath { get; set; }

    public string? Status { get; set; }

    [JsonIgnore]
    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    public virtual Product? Product { get; set; }

    public virtual User? Seller { get; set; }
}
