import React, { useEffect, useRef } from "@rbxts/react";
import { TweenService } from "@rbxts/services";

export default function LoadingIcon(props: React.InstanceAttributes<Frame>) {
    const loaderRef = useRef<ImageLabel>();

    // loading icon animation
    useEffect(() => {
        if (loaderRef.current) {
            const tween = TweenService.Create(
                loaderRef.current, 
                new TweenInfo(1.5, Enum.EasingStyle.Linear, Enum.EasingDirection.InOut, -1),
                { Rotation: 360 }
            )
            tween.Play()
            return () => tween.Pause();
        }
    }, []);

    return (
        <frame {...props} BackgroundTransparency={1}>
            <imagelabel ref={loaderRef} 
                Image="rbxassetid://17119858971" 
                BackgroundTransparency={1}
                Position={new UDim2(0.5, 0, 0, 0)}
                Size={new UDim2(0.2, 0, 1, 0)}
                AnchorPoint={new Vector2(0.5, 0)}
            >
                <uiaspectratioconstraint AspectRatio={1} />
            </imagelabel>
        </frame>
    )
}