using TerraLuna.Business.DTOs;
using TerraLuna.Business.Interfaces;
using TerraLuna.Data.Interfaces;
using TerraLuna.Data.Models;

namespace TerraLuna.Business.Services;

public class AnalogMatchingService : IAnalogMatchingService
{
    private readonly ITerraLunaRepository _repository;
    private static readonly string[] FactorNames = ["Terrain", "Geology", "Thermal", "Aridity", "Slope", "Isolation"];

    public AnalogMatchingService(ITerraLunaRepository repository)
    {
        _repository = repository;
    }

    public IReadOnlyList<Planet> GetPlanets() => _repository.GetPlanets();

    public IReadOnlyList<MissionProfile> GetMissions() => _repository.GetMissions();

    public IReadOnlyList<TargetRegion> GetTargetRegions(string? planet) => _repository.GetTargetRegions(planet);

    public IReadOnlyList<EarthSite> GetEarthSites() => _repository.GetEarthSites();

    public EarthSite? GetEarthSiteById(string id) => _repository.GetEarthSiteById(id);

    public IReadOnlyList<TeamMember> GetTeamMembers() => _repository.GetTeamMembers();

    public MethodologyDto GetMethodology() => new()
    {
        MissionWeights = _repository.GetMissions(),
        DataSources = _repository.GetDataSources()
    };

    public AnalyzeResponseDto AnalyzeAndMatch(AnalyzeRequestDto request)
    {
        var planetName = string.Equals(request.Planet, "Mars", StringComparison.OrdinalIgnoreCase) ? "Mars" : "Moon";
        var mission = _repository.GetMissionByNameOrId(request.MissionProfile)
                      ?? _repository.GetMissions().First();

        var weights = NormalizeWeights(request.CustomWeights ?? mission.Weights);
        var target = ResolveTargetRegion(request, planetName);

        var earthSites = _repository.GetEarthSites()
            .Where(site => site.ApplicablePlanets.Count == 0 ||
                           site.ApplicablePlanets.Any(planet =>
                               string.Equals(planet, planetName, StringComparison.OrdinalIgnoreCase)))
            .ToList();
        var results = new List<AnalogMatchResultDto>(earthSites.Count);

        var targetArr = target.Features.ToArray();
        var weightArr = weights.ToArray();

        foreach (var site in earthSites)
        {
            var earthArr = site.Features.ToArray();
            var breakdown = new List<FactorComparisonDto>(6);
            double weightedSum = 0;

            for (int i = 0; i < 6; i++)
            {
                // Normalized similarity: 100% when Earth == Target, decreasing linearly with difference
                double diff = Math.Abs(earthArr[i] - targetArr[i]);
                double similarity = Math.Max(0.0, Math.Round(100.0 - diff, 1));
                weightedSum += similarity * weightArr[i];

                breakdown.Add(new FactorComparisonDto
                {
                    Factor = FactorNames[i],
                    EarthValue = Math.Round(earthArr[i], 1),
                    TargetValue = Math.Round(targetArr[i], 1),
                    SimilarityPct = similarity,
                    Weight = Math.Round(weightArr[i], 3)
                });
            }

            double finalScore = Math.Round(Math.Clamp(weightedSum, 0.0, 100.0), 1);
            var topFactors = breakdown.OrderByDescending(b => b.SimilarityPct).Take(3).ToList();

            string whyText =
                $"{site.Name} ({site.Country}) achieves a {finalScore:0.0}% analog match for {target.Name} on {planetName} " +
                $"under the {mission.Name} profile. {site.WhyAnalogTemplate} " +
                $"Strongest alignment: {topFactors[0].Factor} ({topFactors[0].SimilarityPct:0}%), " +
                $"{topFactors[1].Factor} ({topFactors[1].SimilarityPct:0}%), and {topFactors[2].Factor} ({topFactors[2].SimilarityPct:0}%).";

            var similarities = new List<SimilarityHighlightDto>
            {
                new() { Factor = topFactors[0].Factor, Summary = $"{site.Name} matches {target.Name} at {topFactors[0].SimilarityPct:0}% similarity ({site.EnvironmentType})." },
                new() { Factor = "Geology", Summary = $"{site.GeologyType} parallels {target.GeologyType}." },
                new() { Factor = "Thermal & Aridity", Summary = $"Mean temp {site.MeanTempC:0.#}°C / {site.AridityIndex} supports testing for {target.TempRangeC}." }
            };

            results.Add(new AnalogMatchResultDto
            {
                Id = site.Id,
                Name = site.Name,
                Country = site.Country,
                Coordinates = site.Coordinates,
                EnvironmentType = site.EnvironmentType,
                Tags = site.Tags,
                ElevationM = site.ElevationM,
                SlopeDeg = site.SlopeDeg,
                MeanTempC = site.MeanTempC,
                AridityIndex = site.AridityIndex,
                GeologyType = site.GeologyType,
                Description = site.Description,
                WhyThisSite = whyText,
                NasaReference = site.NasaReference,
                SourceUrl = site.SourceUrl,
                ColorA = site.ColorA,
                ColorB = site.ColorB,
                AnalogScore = finalScore,
                EarthFeatures = site.Features,
                FactorBreakdown = breakdown,
                KeySimilarities = similarities
            });
        }

        results = results.OrderByDescending(r => r.AnalogScore).ToList();

        return new AnalyzeResponseDto
        {
            Planet = planetName,
            MissionProfile = mission.Name,
            TargetRegion = target,
            WeightsUsed = weights,
            TotalSitesAnalyzed = earthSites.Count,
            Results = results
        };
    }

    private TargetRegion ResolveTargetRegion(AnalyzeRequestDto request, string planetName)
    {
        if (!string.IsNullOrWhiteSpace(request.TargetRegionId))
        {
            var found = _repository.GetTargetRegionById(request.TargetRegionId);
            if (found != null && string.Equals(found.Planet, planetName, StringComparison.OrdinalIgnoreCase)) return found;
        }

        if (request.TargetFeatures != null)
        {
            double lat = request.Latitude ?? (planetName == "Moon" ? -89.9 : 18.38);
            double lon = request.Longitude ?? (planetName == "Moon" ? 0.0 : 77.58);
            string latStr = $"{Math.Abs(lat):0.0}°{(lat < 0 ? "S" : "N")}";
            string lonStr = $"{Math.Abs(lon):0.0}°{(lon < 0 ? "W" : "E")}";

            return new TargetRegion
            {
                Id = "custom-region",
                Planet = planetName,
                Name = string.IsNullOrWhiteSpace(request.TargetRegionName) ? $"Custom {planetName} Region" : request.TargetRegionName,
                Latitude = lat,
                Longitude = lon,
                Coordinates = $"{latStr}, {lonStr}",
                TerrainType = request.TargetFeatures.Terrain > 80 ? "Highlands / Cratered Rim" : "Basaltic Plains",
                ElevationM = Math.Round((request.TargetFeatures.Terrain - 50) * 100),
                SlopeDeg = Math.Round((100 - request.TargetFeatures.Slope) * 0.35 + 2.0, 1),
                TempRangeC = planetName == "Moon" ? "-178°C to +117°C" : "-140°C to +20°C",
                GeologyType = planetName == "Moon" ? "Anorthositic / Basaltic Regolith" : "Basaltic & Clay-Bearing Crust",
                AridityLabel = planetName == "Moon" ? "Ultra-High Vacuum" : "Hyperarid (6.36 mbar CO₂)",
                IlluminationPct = planetName == "Moon" && Math.Abs(lat) > 80 ? 82 : 50,
                Description = $"User-selected target coordinates ({latStr}, {lonStr}) on {planetName}.",
                SourceName = planetName == "Moon" ? "NASA Moon Fact Sheet" : "NASA Mars Fact Sheet",
                SourceUrl = planetName == "Moon"
                    ? "https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html"
                    : "https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html",
                Features = ClampFeatures(request.TargetFeatures)
            };
        }

        return _repository.GetTargetRegions(planetName).First();
    }

    private static FeatureVector ClampFeatures(FeatureVector f) => new()
    {
        Terrain = Math.Clamp(f.Terrain, 0, 100),
        Geology = Math.Clamp(f.Geology, 0, 100),
        Thermal = Math.Clamp(f.Thermal, 0, 100),
        Aridity = Math.Clamp(f.Aridity, 0, 100),
        Slope = Math.Clamp(f.Slope, 0, 100),
        Isolation = Math.Clamp(f.Isolation, 0, 100)
    };

    private static FeatureVector NormalizeWeights(FeatureVector raw)
    {
        double sum = raw.Terrain + raw.Geology + raw.Thermal + raw.Aridity + raw.Slope + raw.Isolation;
        if (sum <= 0.0001)
            return new FeatureVector { Terrain = 0.25, Geology = 0.20, Thermal = 0.20, Aridity = 0.15, Slope = 0.10, Isolation = 0.10 };

        return new FeatureVector
        {
            Terrain = raw.Terrain / sum,
            Geology = raw.Geology / sum,
            Thermal = raw.Thermal / sum,
            Aridity = raw.Aridity / sum,
            Slope = raw.Slope / sum,
            Isolation = raw.Isolation / sum
        };
    }
}
