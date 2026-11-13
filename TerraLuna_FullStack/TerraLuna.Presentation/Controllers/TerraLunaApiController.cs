using Microsoft.AspNetCore.Mvc;
using TerraLuna.Business.DTOs;
using TerraLuna.Business.Interfaces;

namespace TerraLuna.Presentation.Controllers;

[ApiController]
[Route("api")]
public class TerraLunaApiController : ControllerBase
{
    private readonly IAnalogMatchingService _service;

    public TerraLunaApiController(IAnalogMatchingService service)
    {
        _service = service;
    }

    [HttpGet("health")]
    public IActionResult Health() => Ok(new
    {
        status = "healthy",
        service = "TerraLuna API — Orbital Minds",
        timestampUtc = DateTime.UtcNow
    });

    [HttpGet("planets")]
    public IActionResult GetPlanets() => Ok(_service.GetPlanets());

    [HttpGet("missions")]
    public IActionResult GetMissions() => Ok(_service.GetMissions());

    [HttpGet("targets")]
    public IActionResult GetTargetRegions([FromQuery] string? planet = null)
    {
        if (!string.IsNullOrWhiteSpace(planet) && !IsSupportedPlanet(planet))
            return BadRequest(new { message = "planet must be Moon or Mars." });

        return Ok(_service.GetTargetRegions(planet));
    }

    [HttpGet("earth-sites")]
    public IActionResult GetEarthSites() => Ok(_service.GetEarthSites());

    [HttpGet("sites/{id}")]
    public IActionResult GetEarthSiteById(string id)
    {
        var site = _service.GetEarthSiteById(id);
        return site is null ? NotFound(new { message = $"Earth analog site '{id}' not found." }) : Ok(site);
    }

    [HttpPost("analogs")]
    [HttpPost("match")]
    public IActionResult AnalyzeAndMatch([FromBody] AnalyzeRequestDto request)
    {
        if (request is null)
            return BadRequest(new { message = "Request body is required." });

        if (!IsSupportedPlanet(request.Planet))
            return BadRequest(new { message = "planet must be Moon or Mars." });

        if (_service.GetMissions().All(m =>
                !string.Equals(m.Id, request.MissionProfile, StringComparison.OrdinalIgnoreCase) &&
                !string.Equals(m.Name, request.MissionProfile, StringComparison.OrdinalIgnoreCase)))
            return BadRequest(new { message = "missionProfile is not a supported mission." });

        if (!string.IsNullOrWhiteSpace(request.TargetRegionId))
        {
            var target = _service.GetTargetRegions(request.Planet)
                .FirstOrDefault(t => string.Equals(t.Id, request.TargetRegionId, StringComparison.OrdinalIgnoreCase));
            if (target is null)
                return BadRequest(new { message = "targetRegionId must identify a target on the selected planet." });
        }

        if (request.Latitude is < -90 or > 90 || request.Longitude is < -180 or > 180)
            return BadRequest(new { message = "latitude must be between -90 and 90 and longitude between -180 and 180." });

        if (request.TargetFeatures is not null && !IsUnitScale(request.TargetFeatures))
            return BadRequest(new { message = "targetFeatures values must be between 0 and 100." });

        if (request.CustomWeights is not null && !IsNonNegative(request.CustomWeights))
            return BadRequest(new { message = "customWeights values must be non-negative." });

        var result = _service.AnalyzeAndMatch(request);
        return Ok(result);
    }

    [HttpGet("methodology")]
    public IActionResult GetMethodology() => Ok(_service.GetMethodology());

    [HttpGet("team")]
    public IActionResult GetTeam() => Ok(_service.GetTeamMembers());

    private static bool IsSupportedPlanet(string? planet) =>
        string.Equals(planet, "Moon", StringComparison.OrdinalIgnoreCase) ||
        string.Equals(planet, "Mars", StringComparison.OrdinalIgnoreCase);

    private static bool IsUnitScale(TerraLuna.Data.Models.FeatureVector values) =>
        new[] { values.Terrain, values.Geology, values.Thermal, values.Aridity, values.Slope, values.Isolation }
            .All(value => value is >= 0 and <= 100);

    private static bool IsNonNegative(TerraLuna.Data.Models.FeatureVector values) =>
        new[] { values.Terrain, values.Geology, values.Thermal, values.Aridity, values.Slope, values.Isolation }
            .All(value => value >= 0);
}
