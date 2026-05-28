import React from "@rbxts/react";
import Text from "./Text";
import { ApplicationCallback, ApplicationDetails } from "shared/types";

export default function ApplicationItem(
    { id, name, description, startApplication }: ApplicationDetails & ApplicationCallback
) {
    return (
        <frame BackgroundColor3={new Color3(1, 1, 1)} BackgroundTransparency={0.95}>
            <uicorner CornerRadius={new UDim(0.1, 0)} />
            <uipadding 
                PaddingTop={new UDim(0.03, 0)}
                PaddingBottom={new UDim(0.03, 0)}
                PaddingLeft={new UDim(0.03, 0)}
                PaddingRight={new UDim(0.03, 0)}
            />
            <uilistlayout 
                Padding={new UDim(0.02, 0)} 
                FillDirection={Enum.FillDirection.Horizontal}
                HorizontalFlex={Enum.UIFlexAlignment.SpaceBetween}
                VerticalAlignment={Enum.VerticalAlignment.Center}
            />

            <frame Size={new UDim2(0.8, 0, 1, 0)} BackgroundTransparency={1} LayoutOrder={1}>
                <uipadding PaddingTop={new UDim(0.1, 0)} PaddingBottom={new UDim(0.1, 0)} />
                <uiflexitem FlexMode={Enum.UIFlexMode.Shrink} />

                <Text 
                    Text={name}
                    Position={new UDim2(0, 0, 0.025, 0)}
                    Size={new UDim2(1, 0, 0.536, 0)}
                />
                <Text 
                    Text={description}
                    TextTransparency={0.5}
                    Position={new UDim2(0, 0, 0.61, 0)}
                    Size={new UDim2(1, 0, 0.318, 0)}
                />
            </frame>

            <textbutton
                Event={{
					MouseButton1Click: () => startApplication(id)
				}}
                BackgroundColor3={Color3.fromHex("#3D5EFF")} 
                Size={new UDim2(0.114, 0, 0.55, 0)} 
                Text=""
            >
                <uicorner CornerRadius={new UDim(0.25, 0)} />
                <uipadding PaddingTop={new UDim(0.2, 0)} PaddingBottom={new UDim(0.2, 0)} />

                <Text
                    Text={`Apply`}
                    TextXAlignment={Enum.TextXAlignment.Center}
                    Size={new UDim2(1, 0, 1, 0)}
                />
            </textbutton>
        </frame>
    )
}