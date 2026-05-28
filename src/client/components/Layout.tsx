import React from "@rbxts/react"

export default function Layout({ children }: React.PropsWithChildren) {
    return (
        <frame Size={new UDim2(1, 0, 1, 0)} BackgroundColor3={new Color3(0.04, 0.04, 0.04)}>
            <frame 
                Position={new UDim2(0.5, 0, 0, 0)} 
                Size={new UDim2(1, 0, 1, 0)} 
                AnchorPoint={new Vector2(0.5, 0)} 
                BackgroundTransparency={1}
            >
                <uisizeconstraint MaxSize={new Vector2(1080, 18000)} />
                <uilistlayout Padding={new UDim(0.04)} />
                <uipadding
                    PaddingLeft={new UDim(0.01)} 
                    PaddingRight={new UDim(0.01)} 
                    PaddingTop={new UDim(0.1)} 
                />

                {children}
            </frame>
        </frame>
    )
}