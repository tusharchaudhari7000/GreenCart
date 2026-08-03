using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace GreenCart_Admin_Service_.NET_.Models;

public partial class Payment
{
    public int PaymentId { get; set; }

    public int OrderId { get; set; }

    public string PaymentMethod { get; set; } = null!;

    public string PaymentStatus { get; set; } = null!;

    public string? BillNumber { get; set; }

    public decimal? PayableAmount { get; set; }

    public DateTime? PaymentDate { get; set; }

    [JsonIgnore]
    public virtual Order Order { get; set; } = null!;
}
