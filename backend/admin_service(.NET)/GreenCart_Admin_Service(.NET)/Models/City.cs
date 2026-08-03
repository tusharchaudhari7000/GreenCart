using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace GreenCart_Admin_Service_.NET_.Models;

public partial class City
{
    public int CityId { get; set; }

    public string CityName { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Area> Areas { get; set; } = new List<Area>();
}
