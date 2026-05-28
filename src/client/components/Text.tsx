import React from "@rbxts/react";

export default function Text(props: React.InstanceAttributes<TextLabel> & React.PropsWithChildren) {
    return (
        <textlabel 
            TextScaled={true}
            TextColor3={new Color3(1, 1, 1)}
            TextXAlignment={Enum.TextXAlignment.Left}
            BackgroundTransparency={1}
            FontFace={Font.fromId(12187365364)}
            {...props}
        >
            {props.children || <></>}
        </textlabel>
    )
}