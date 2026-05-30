# RankGun Application Centre

This is the RankGun application centre which is designed to interact with the RankGun API, made using roblox-ts and react-lua.

The RankGun application centre allows people to complete questions in exchange for a role in your group.

Please keep in mind this software is available for everyone under the [RankGun PolyForm Shield License](/license.md).

## How to use

The centre itself is a self-contained ModuleScript, compiled with roblox-ts and loaded with a Script like as below:

```
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local AssetService = game:GetService("AssetService")
local moduleModel = AssetService:LoadAssetAsync(117860497552510)
moduleModel.Sandboxed = false

local moduleInstance = moduleModel:FindFirstChild("MainModule")
moduleInstance.Name = "rankgun-ranking-centre"
moduleInstance.Parent = ReplicatedStorage

local RankgunModule = require(moduleInstance)
RankgunModule.Init({
    workspaceId = "<workspace-id>",
    apiToken = "<api-token>",
    -- verbose = true, -- optional; logs API requests/responses to the server console for debugging
})
```

> [!TIP]
> As a RankGun customer, use the loader scripts available for download in your [Workspace](https://www.rankgun.works/workspace/), which will pre-fill the necessary details and automatically update.

Before using, you must enable a few Experience Settings - namely, Security -> Allow HTTP Requests and Allow Loading Third Party Assets. Be sure to enable "enable studio access to api services" for cooldown logic if you wish to develop on studio. 

## Development

The client's GUI is rendered with react-lua components; it replicates using a LocalScript parented to the PlayerGui. We use Remo for remote declaration and to allow for full types.

To build the module, run `npm run build` after ensuring all dependencies are installed.

## Tests 

TBC

## Contributions 

All contributions are highly appreciated and mean a lot to us! Feel free to open them and we'll try to get back to you as fast as we can. 

## Issues 

Issues may be opened to report issues with the application centre, NOT for customer support.

## Publishing

Github workflow automatically builds and pushes to roblox & uploads to releases. [Relevant model](https://create.roblox.com/store/asset/117860497552510/rankgunapplicationcentre).
