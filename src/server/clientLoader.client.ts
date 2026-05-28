const ReplicatedStorage = game.GetService("ReplicatedStorage");
const RankgunInstance = ReplicatedStorage.WaitForChild("rankgun-ranking-centre", 5) as ModuleScript;

if (!RankgunInstance) {
    warn("[Rankgun] Could not load client scripts");
} else {
    const Rankgun = require(RankgunInstance) as { Init: () => void };
    Rankgun.Init();
}