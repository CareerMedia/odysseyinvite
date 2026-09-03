# Odyssey audio assets

Phase 2 includes a complete layered sound manager. Production files are optional.

List every file you add in `manifest.json` under `available` using the id (not the filename):

```json
{
  "available": [
    "ocean-night",
    "wind-soft",
    "ship-creaks",
    "cinematic-bed",
    "voyage-start",
    "map-unfurl",
    "discovery",
    "kraken"
  ]
}
```

If an id is not in `available`, the engine never requests the mp3. That keeps GitHub Pages free of 404 noise.

## Expected files

| id | file | loop | category |
| --- | --- | --- | --- |
| ocean-night | ocean-night.mp3 | yes | ambience |
| wind-soft | wind-soft.mp3 | yes | ambience |
| ship-creaks | ship-creaks.mp3 | yes | effects |
| cinematic-bed | cinematic-bed.mp3 | yes | music |
| voyage-start | voyage-start.mp3 | no | effects |
| map-unfurl | map-unfurl.mp3 | no | effects |
| discovery | discovery.mp3 | no | effects |
| kraken | kraken.mp3 | no | effects |
| ui-hover | ui-hover.mp3 | no | ui |
| ui-select | ui-select.mp3 | no | ui |

Use 96–128 kbps stereo or mono mp3, 20–90 seconds for loops so the bed does not feel like a 5-second repeat.

Until files exist, the invitation uses a quiet procedural soundscape after the visitor chooses **Enter with sound**.
