import React from "@rbxts/react";

export default function ProgressBar({ progress }: { progress: number }) {
    return (
        <frame 
            Size={new UDim2(1, 0, 0.02, 0)} 
            BackgroundColor3={new Color3(1, 1, 1)} 
            BackgroundTransparency={1}
            ClipsDescendants={true}
        >
            <uicorner CornerRadius={new UDim(1, 0)} />
            <frame BackgroundColor3={new Color3(1, 1, 1)} BackgroundTransparency={0.9} Size={new UDim2(progress, 0, 1, 0)}>
                <uicorner CornerRadius={new UDim(1, 0)} />
            </frame>
        </frame>
    )
}