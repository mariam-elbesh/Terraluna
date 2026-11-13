using TerraLuna.Data.Models;

namespace TerraLuna.Business.DTOs;

public class AnalyzeRequestDto
{
    public string Planet { get; set; } = "Moon";
    public string MissionProfile { get; set; } = "Permanent Habitat";
    public string? TargetRegionId { get; set; }
    public string? TargetRegionName { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public FeatureVector? TargetFeatures { get; set; }
    public FeatureVector? CustomWeights { get; set; }
}

public class FactorComparisonDto
{
    public string Factor { get; set; } = string.Empty;
    public double EarthValue { get; set; }
    public double TargetValue { get; set; }
    public double SimilarityPct { get; set; }
    public double Weight { get; set; }
}

public class SimilarityHighlightDto
{
    public string Factor { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
}

public class AnalogMatchResultDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Coordinates { get; set; } = string.Empty;
    public string EnvironmentType { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = [];
    public double ElevationM { get; set; }
    public double SlopeDeg { get; set; }
    public double MeanTempC { get; set; }
    public string AridityIndex { get; set; } = string.Empty;
    public string GeologyType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string WhyThisSite { get; set; } = string.Empty;
    public string NasaReference { get; set; } = string.Empty;
    public string SourceUrl { get; set; } = string.Empty;
    public string ColorA { get; set; } = string.Empty;
    public string ColorB { get; set; } = string.Empty;
    public double AnalogScore { get; set; }
    public FeatureVector EarthFeatures { get; set; } = new();
    public List<FactorComparisonDto> FactorBreakdown { get; set; } = [];
    public List<SimilarityHighlightDto> KeySimilarities { get; set; } = [];
}

public class AnalyzeResponseDto
{
    public string Planet { get; set; } = string.Empty;
    public string MissionProfile { get; set; } = string.Empty;
    public TargetRegion TargetRegion { get; set; } = new();
    public FeatureVector WeightsUsed { get; set; } = new();
    public int TotalSitesAnalyzed { get; set; }
    public List<AnalogMatchResultDto> Results { get; set; } = [];
}

public class MethodologyDto
{
    public string Formula { get; set; } = "Analog Score = Σ (Factor Similarity × Mission Weight)";
    public string Disclaimer { get; set; } = "The weighting is a prototype methodology developed by the Orbital Minds team and is not an official NASA scoring system.";
    public List<string> Factors { get; set; } = ["Terrain", "Geology", "Thermal", "Aridity", "Slope", "Isolation"];
    public IReadOnlyList<MissionProfile> MissionWeights { get; set; } = [];
    public IReadOnlyList<DataSourceInfo> DataSources { get; set; } = [];
}
