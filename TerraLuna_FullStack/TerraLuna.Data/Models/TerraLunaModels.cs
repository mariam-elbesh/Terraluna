namespace TerraLuna.Data.Models;

public class FeatureVector
{
    public double Terrain { get; set; }
    public double Geology { get; set; }
    public double Thermal { get; set; }
    public double Aridity { get; set; }
    public double Slope { get; set; }
    public double Isolation { get; set; }

    public double[] ToArray() => [Terrain, Geology, Thermal, Aridity, Slope, Isolation];
}

public class Planet
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Tagline { get; set; } = string.Empty;
    public double GravityMs2 { get; set; }
    public double SolarIrradianceWm2 { get; set; }
    public double MeanTempC { get; set; }
    public string TempRangeC { get; set; } = string.Empty;
    public string AtmosphericPressure { get; set; } = string.Empty;
    public double TopographicRangeKm { get; set; }
    public double Albedo { get; set; }
    public string SourceName { get; set; } = string.Empty;
    public string SourceUrl { get; set; } = string.Empty;
}

public class MissionProfile
{
    public string Id { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> KeyFactors { get; set; } = [];
    public FeatureVector Weights { get; set; } = new();
}

public class TargetRegion
{
    public string Id { get; set; } = string.Empty;
    public string Planet { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string Coordinates { get; set; } = string.Empty;
    public string TerrainType { get; set; } = string.Empty;
    public double ElevationM { get; set; }
    public double SlopeDeg { get; set; }
    public string TempRangeC { get; set; } = string.Empty;
    public string GeologyType { get; set; } = string.Empty;
    public string AridityLabel { get; set; } = string.Empty;
    public double IlluminationPct { get; set; }
    public string Description { get; set; } = string.Empty;
    public string SourceName { get; set; } = string.Empty;
    public string SourceUrl { get; set; } = string.Empty;
    public FeatureVector Features { get; set; } = new();
}

public class EarthSite
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public List<string> ApplicablePlanets { get; set; } = [];
    public string Coordinates { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string EnvironmentType { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = [];
    public double ElevationM { get; set; }
    public double SlopeDeg { get; set; }
    public double MeanTempC { get; set; }
    public string AridityIndex { get; set; } = string.Empty;
    public string GeologyType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string WhyAnalogTemplate { get; set; } = string.Empty;
    public string NasaReference { get; set; } = string.Empty;
    public string SourceUrl { get; set; } = string.Empty;
    public string ColorA { get; set; } = "#e8b88a";
    public string ColorB { get; set; } = "#a4512f";
    public FeatureVector Features { get; set; } = new();
}

public class TeamMember
{
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Responsibility { get; set; } = string.Empty;
}

public class DataSourceInfo
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}
