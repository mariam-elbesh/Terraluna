using TerraLuna.Data.Models;

namespace TerraLuna.Data.Interfaces;

public interface ITerraLunaRepository
{
    IReadOnlyList<Planet> GetPlanets();
    IReadOnlyList<MissionProfile> GetMissions();
    MissionProfile? GetMissionByNameOrId(string nameOrId);
    IReadOnlyList<TargetRegion> GetTargetRegions(string? planet = null);
    TargetRegion? GetTargetRegionById(string id);
    IReadOnlyList<EarthSite> GetEarthSites();
    EarthSite? GetEarthSiteById(string id);
    IReadOnlyList<TeamMember> GetTeamMembers();
    IReadOnlyList<DataSourceInfo> GetDataSources();
}
