import React, { useEffect, useState } from "@rbxts/react";

import { remotes } from "shared/remotes";
import { ApplicationCallback, ApplicationDetails } from "shared/types";

import ApplicationItem from "./ApplicationItem";
import LoadingIcon from "./LoadingIcon";

export default function ApplicationList({ children, startApplication }: React.PropsWithChildren & ApplicationCallback) {
    const [applicationList, setApplicationList] = useState<ApplicationDetails[]>();

    useEffect(() => {
        remotes.getCentreData.request().then((applications: ApplicationDetails[]) => {
            setApplicationList(applications);
        });
    }, []);

    return (
        <scrollingframe
            Size={new UDim2(1, 0, 0.704, 0)}
            CanvasSize={new UDim2(0, 0, 0.5, 0)}
            AutomaticCanvasSize={Enum.AutomaticSize.Y}
            BackgroundTransparency={1}
        >
            <uigridlayout CellSize={new UDim2(1, 0, 0.2, 0)} CellPadding={new UDim2(0, 0, 0.02, 0)} />

            {applicationList ? 
                applicationList.map((application) => (
                    <ApplicationItem {...application} startApplication={startApplication} />
                )) : 
                <LoadingIcon /> 
            }
        </scrollingframe>
    )
}