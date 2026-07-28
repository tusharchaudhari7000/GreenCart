using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace GreenCart_Admin_Service_.NET_.Models;

public partial class User
{
    public int UserId { get; set; }

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public int RoleId { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public int Status { get; set; }

    public int? QuestionId { get; set; }

    public string Answer { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public string? AadhaarNo { get; set; }

    public int? AreaId { get; set; }

    public virtual Area? Area { get; set; }

    [JsonIgnore]
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    [JsonIgnore]
    public virtual ICollection<ProductsStock> ProductsStocks { get; set; } = new List<ProductsStock>();

    public virtual SecurityQuestion? Question { get; set; }

    public virtual Role Role { get; set; } = null!;
}
