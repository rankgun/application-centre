import React from "@rbxts/react";
import { MarkingResult } from "shared/types";
import Text from "./Text";

export default function ApplicationResult(
    { passed, score, rankName, errorMessage, listCallback }: MarkingResult & { listCallback: () => void }
) {
    return (
        <frame BackgroundColor3={new Color3(1, 1, 1)} BackgroundTransparency={0.95} Size={new UDim2(1, 0, 0.34, 0)}>
            <uicorner CornerRadius={new UDim(0.05, 0)} />
            <uilistlayout Padding={new UDim(0.05, 0)} VerticalFlex={Enum.UIFlexAlignment.SpaceBetween} />
            <uipadding 
                PaddingTop={new UDim(0.15, 0)} 
                PaddingBottom={new UDim(0.15, 0)} 
                PaddingLeft={new UDim(0.05, 0)}
                PaddingRight={new UDim(0.05, 0)} 
            />

            <frame BackgroundTransparency={1} Size={new UDim2(1, 0, 0.62, 0)}>
                <uilistlayout Padding={new UDim(0.1, 0)} />

                <frame BackgroundTransparency={1} Size={new UDim2(1, 0, 0.545, 0)}>
                    <uilistlayout 
                        Padding={new UDim(0.03, 0)}
                        FillDirection={Enum.FillDirection.Horizontal} 
                        VerticalAlignment={Enum.VerticalAlignment.Center}
                    />

                    <imagelabel 
                        Image={passed ? "rbxassetid://74298021176766" : "rbxassetid://104008649959269"} 
                        BackgroundTransparency={1}
                        Size={new UDim2(0.054, 0, 1, 0)}
                    >
                        <uiaspectratioconstraint AspectType={Enum.AspectType.ScaleWithParentSize} DominantAxis={Enum.DominantAxis.Height} />
                    </imagelabel>

                    <Text Text={passed ? "<b>Passed application</b>" : "<b>Failed application</b>"} RichText={true} Size={new UDim2(0.792, 0, 0.98, 0)} />
                </frame>

                <Text
                    Text={passed ? 
                        `You have been granted the <b>${rankName}</b> role.` : 
                        errorMessage || "You have not been granted any role."
                    }
                    RichText={true}
                    Size={new UDim2(0.6, 0, 0.337, 0)}
                />
            </frame>

            <frame Size={new UDim2(1, 0, 0.188, 0)} BackgroundTransparency={1}>
                <uilistlayout FillDirection={Enum.FillDirection.Horizontal} HorizontalFlex={Enum.UIFlexAlignment.SpaceBetween} />

                <textbutton 
                    Text=""
                    Size={new UDim2(0.3, 0, 1, 0)}
                    Event={{ MouseButton1Down: listCallback }} 
                    BackgroundTransparency={1}
                >
                    <Text 
                        Text="<- Back to applications"
                        TextTransparency={0.5}
                        TextXAlignment={Enum.TextXAlignment.Left}
                        Size={new UDim2(1, 0, 1, 0)}
                    />
                </textbutton>

                <Text 
                    Text={`You scored ${math.round(score * 100)}%`} 
                    TextTransparency={0.5}
                    TextXAlignment={Enum.TextXAlignment.Right}
                    Size={new UDim2(0.5, 0, 1, 0)} 
                >
                    <uitextsizeconstraint MinTextSize={15} />
                </Text>
            </frame>
        </frame>
    )
}