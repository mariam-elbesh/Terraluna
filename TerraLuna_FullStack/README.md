# TerraLuna — Orbital Minds (2026 NASA Space Apps Challenge)

Full-stack ASP.NET Core (.NET 10.0) + Interactive 3D Web Platform for identifying Earth terrestrial analog sites for Moon and Mars exploration.

## Project Structure
- `TerraLuna.slnx` — Visual Studio 2026 Solution
- `TerraLuna.Data/` — Domain models, repository interface, and `JsonTerraLunaRepository`
- `TerraLuna.Business/` — DTOs and `AnalogMatchingService` (weighted similarity scoring engine)
- `TerraLuna.Presentation/` — ASP.NET Core Web API (`Controllers/TerraLunaApiController.cs`), NASA dataset (`Data/terraluna_nasa_data.json`), and integrated Frontend (`wwwroot/`)

## How to Run in Visual Studio 2026
1. Extract the folder and double-click `TerraLuna.slnx`.
2. In Solution Explorer, right-click `TerraLuna.Presentation` -> **Set as Startup Project**.
3. Press **F5** (or click the green **http / https** Run button).
4. Visual Studio will launch the ASP.NET Core backend and open the TerraLuna website automatically in your browser (e.g. `https://localhost:7153` or `http://localhost:5166`).

## API Endpoints
- `GET /api/health` — Health check
- `GET /api/planets` — Moon & Mars NASA Fact Sheet parameters
- `GET /api/missions` — 4 Mission Profiles with factor weights
- `GET /api/targets?planet=Moon` — NASA candidate target regions (Moon & Mars)
- `GET /api/earth-sites` — All 12 NASA & peer-reviewed Earth analog sites
- `GET /api/sites/{id}` — Single Earth analog site details
- `POST /api/match` (alias `POST /api/analogs`) — Computes weighted Analog Score and returns ranked Earth analog matches
- `GET /api/methodology` — Formula, weights, and NASA data sources
- `GET /api/team` — Orbital Minds team roster
