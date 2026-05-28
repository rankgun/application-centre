-- Copyright Coloop LTD (http://rankgun.works/)
-- Licensed under the PolyForm Shield License 1.0.0
-- Full license details: https://github.com/rankgun/ranking-centre/blob/main/license.md

if game:GetService("RunService"):IsServer() then
	-- fetch application data, mark results 
	return require(script:FindFirstChild("server"))
else
	-- load client UI, logic
	return require(script:FindFirstChild("client"))
end
