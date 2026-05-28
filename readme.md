# RankGun Application Centre

This is the RankGun application centre which is designed to interact with the RankGun API, made using roblox-ts and react-lua.

The RankGun application centre allows people to complete questions in exchange for a role in your group.

Please keep in mind this software is available for everyone under the [RankGun PolyForm Shield License](/license.md).

## How to use

The centre itself is a self-contained ModuleScript, compiled with roblox-ts and loaded with a Script like as below:

```
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local RankgunModule = require(ReplicatedStorage:FindFirstChild("rankgun-application-centre"))

RankgunModule.Init({
    workspaceId = "<workspace-id>",
    apiToken = "<api-token>"
})
```

> [!TIP]
> As a RankGun customer, use the loader scripts available for download in your [Workspace](https://www.rankgun.works/workspace/), which will pre-fill the necessary details and automatically update.

Before using, you must enable a few Experience Settings - namely, Security -> Allow HTTP Requests and Allow Loading Third Party Assets. You may also wish to enable DataStores in Studio to allow for playtesting.

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

Can possibly use [Open Cloud API](https://create.roblox.com/docs/cloud/reference/features/assets#Assets_UpdateAsset) with a GitHub action to automate updating the module.