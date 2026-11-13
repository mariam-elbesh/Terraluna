using TerraLuna.Business.DTOs;
using TerraLuna.Data.Models;

namespace TerraLuna.Business.Interfaces;

public interface IAnalogMatchingService
{
    IReadOnlyList<Planet> GetPlanets();
    IReadOnlyList<MissionProfile> GetMissions();
    IReadOnlyList<TargetRegion> GetTargetRegions(string? planet);
    IReadOnlyList<EarthSite> GetEarthSites();
    EarthSite? GetEarthSiteById(string id);
    AnalyzeResponseDto AnalyzeAndMatch(AnalyzeRequestDto request);
    MethodologyDto GetMethodology();
    IReadOnlyList<TeamMember> GetTeamMembers();
}
