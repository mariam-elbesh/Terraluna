using System.Text.Json;
using TerraLuna.Data.Interfaces;
using TerraLuna.Data.Models;

namespace TerraLuna.Data.Repositories;

internal sealed class TerraLunaDataSeed
{
    public List<Planet> Planets { get; set; } = [];
    public List<MissionProfile> Missions { get; set; } = [];
    public List<TargetRegion> TargetRegions { get; set; } = [];
    public List<EarthSite> EarthSites { get; set; } = [];
    public List<TeamMember> Team { get; set; } = [];
    public List<DataSourceInfo> DataSources { get; set; } = [];
}

public class JsonTerraLunaRepository : ITerraLunaRepository
{
    private readonly TerraLunaDataSeed _seed;

    public JsonTerraLunaRepository(string jsonFilePath)
    {
        if (!File.Exists(jsonFilePath))
            throw new FileNotFoundException($"TerraLuna NASA dataset not found at: {jsonFilePath}");

        var json = File.ReadAllText(jsonFilePath);
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        _seed = JsonSerializer.Deserialize<TerraLunaDataSeed>(json, options)
                ?? throw new InvalidOperationException("Failed to deserialize TerraLuna NASA dataset.");
    }

    public IReadOnlyList<Planet> GetPlanets() => _seed.Planets;

    public IReadOnlyList<MissionProfile> GetMissions() => _seed.Missions;

    public MissionProfile? GetMissionByNameOrId(string nameOrId) =>
        _seed.Missions.FirstOrDefault(m =>
            string.Equals(m.Id, nameOrId, StringComparison.OrdinalIgnoreCase) ||
            string.Equals(m.Name, nameOrId, StringComparison.OrdinalIgnoreCase));

    public IReadOnlyList<TargetRegion> GetTargetRegions(string? planet = null) =>
        string.IsNullOrWhiteSpace(planet)
            ? _seed.TargetRegions
            : _seed.TargetRegions.Where(t => string.Equals(t.Planet, planet, StringComparison.OrdinalIgnoreCase)).ToList();

    public TargetRegion? GetTargetRegionById(string id) =>
        _seed.TargetRegions.FirstOrDefault(t => string.Equals(t.Id, id, StringComparison.OrdinalIgnoreCase));

    public IReadOnlyList<EarthSite> GetEarthSites() => _seed.EarthSites;

    public EarthSite? GetEarthSiteById(string id) =>
        _seed.EarthSites.FirstOrDefault(s => string.Equals(s.Id, id, StringComparison.OrdinalIgnoreCase));

    public IReadOnlyList<TeamMember> GetTeamMembers() => _seed.Team;

    public IReadOnlyList<DataSourceInfo> GetDataSources() => _seed.DataSources;
}
