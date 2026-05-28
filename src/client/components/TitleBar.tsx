import React from "@rbxts/react"
import Text from "./Text"

export default function TitleBar({ title, subtitle }: { title: string, subtitle: string }) {
    return (
        <frame Size={new UDim2(1, 0, 0.12, 0)} BackgroundTransparency={1}>
            <Text 
                Text={subtitle}
                TextTransparency={0.5}
                Position={new UDim2(0, 0, 0.04, 0)}
                Size={new UDim2(1, 0, 0.31, 0)}
            />
            <Text 
                Text={title}
                Position={new UDim2(0, 0, 0.368, 0)}
                Size={new UDim2(1, 0, 0.613, 0)}
            />
        </frame>
    )
}