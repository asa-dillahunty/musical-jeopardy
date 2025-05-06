import { useEffect, useState } from "react";
import NumberInput from "../NumberInput";
import PlayerIcon from "./PlayerIcon";
import { PlayerType } from "../../util/models";
import { useAtomValue } from "jotai";
import { PlayersAtom, useUpdatePlayerScore } from "../../util/atoms";
import { PlayerContainerProps } from "./PlayersContainer";

const rewardState = {
  success: "success",
  fail: "fail",
  neutral: "neutral",
};

interface PlayerDisplayProps extends PlayerContainerProps {
  data: PlayerType;
  display: boolean;
}

export function PlayerDisplay({
  data,
  display,
  onClickPlayer,
  isPlaying,
  selectedPlayer,
  isFinalJeopardy,
}: PlayerDisplayProps) {
  const [rewardStatus, setRewardStatus] = useState(rewardState.neutral);
  const [wager, setWager] = useState(500);
  const players = useAtomValue(PlayersAtom);
  const updatePlayerScore = useUpdatePlayerScore();

  let className = "player-icon-wrapper";
  if (onClickPlayer) className += " selectable";
  if (rewardStatus === rewardState.fail) className += " fail";
  if (rewardStatus === rewardState.success) className += " success";
  if (selectedPlayer?.index === data.index) className += " selected";

  const handleClick = () => {
    if (!onClickPlayer) return;

    if (!isPlaying) {
      onClickPlayer(data);
      return;
    } else {
      onClickPlayer(data, rewardStatus);
    }

    if (rewardStatus === rewardState.neutral)
      setRewardStatus(rewardState.success);
    else if (rewardStatus === rewardState.success)
      setRewardStatus(rewardState.fail);
    else if (rewardStatus === rewardState.fail)
      setRewardStatus(rewardState.neutral);
  };

  const winWager = () => {
    updatePlayerScore(data.index, players[data.index].score + wager);
  };

  const loseWager = () => {
    updatePlayerScore(data.index, players[data.index].score - wager);
  };

  const currentScore = players[data.index]?.score ?? 0;

  useEffect(() => {
    if (onClickPlayer) return;
    setRewardStatus(rewardState.neutral);
  }, [onClickPlayer]);

  return (
    <div
      className={className}
      style={display ? {} : { display: "none" }}
      onClick={handleClick}
    >
      <PlayerIcon color={data.color} url={data.url} />
      <p className="player-name">{data.name}</p>
      {isPlaying || (!isPlaying && !isFinalJeopardy) ? (
        <>
          <p className="player-score">${currentScore}</p>
        </>
      ) : (
        <></>
      )}
      {isFinalJeopardy && (
        <>
          <NumberInput
            label={"Wager"}
            value={wager}
            setValue={setWager}
            minVal={0}
            maxVal={currentScore > 500 ? currentScore : 500}
            incPerDigit
            topLabel
            includePlusMinus
            plusFunc={winWager}
            minusFunc={loseWager}
          />
        </>
      )}
    </div>
  );
}
