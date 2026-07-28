using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace GreenCart_Admin_Service_.NET_.Models;

public partial class Order
{
    public int OrderId { get; set; }

    public int BuyerId { get; set; }

    public DateTime? OrderDate { get; set; }
    
    public decimal TotalAmount { get; set; }

    public virtual User? Buyer { get; set; }
    
    [JsonPropertyName("items")]
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    [JsonIgnore]
    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    [NotMapped]
    [JsonPropertyName("payment")]
    public Payment? PaymentDetails => Payments?.FirstOrDefault();
}
