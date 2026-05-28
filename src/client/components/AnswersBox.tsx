import React from "@rbxts/react";
import Text from "./Text";

export default function AnswersBox(
    { questionId, answers, onAnswer }: 
        { questionId: string, answers: string[], onAnswer: (questionId: string, selectedAnswer: string) => void }) 
{
    return (
        <frame Size={new UDim2(1, 0, 0.337, 0)} BackgroundTransparency={1}>
            <uigridlayout
                CellSize={new UDim2(0.49, 0, 0.49, 0)}
                CellPadding={new UDim2(0.01, 0, 0.04, 0)}
            />

            {answers.map((answer) => (
                <textbutton
                    BackgroundColor3={new Color3(1, 1, 1)} 
                    BackgroundTransparency={0.95} 
                    Text=""
                    Event={{
                        MouseButton1Down: () => onAnswer(questionId, answer)
                    }}
                >
                    <uicorner CornerRadius={new UDim(0.1, 0)} />
                    <uipadding PaddingLeft={new UDim(0.02, 0)} PaddingRight={new UDim(0.02, 0)} />
                    
                    <Text
                        Text={answer}
                        Size={new UDim2(1, 0, 1, 0)}
                        TextXAlignment={Enum.TextXAlignment.Center}
                    >
                        <uitextsizeconstraint MaxTextSize={45} MinTextSize={1} />
                    </Text>
                </textbutton>
            ))}
        </frame>
    )
}