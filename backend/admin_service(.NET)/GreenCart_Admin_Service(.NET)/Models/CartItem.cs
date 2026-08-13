using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace GreenCart_Admin_Service_.NET_.Models;

public partial class CartItem
{
    public int CartItemId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public double Quantity { get; set; }

    public double UnitPrice { get; set; }

    public int CartId { get; set; }

    public int ProductId { get; set; }

    public int StockId { get; set; }

    [JsonIgnore]
    public virtual Cart Cart { get; set; } = null!;

    [JsonIgnore]
    public virtual Product Product { get; set; } = null!;

    [JsonIgnore]
    public virtual ProductsStock Stock { get; set; } = null!;
}
