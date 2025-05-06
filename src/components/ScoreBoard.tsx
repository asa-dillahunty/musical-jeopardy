import { FaTrophy } from "react-icons/fa6";
import "./sass/ScoreBoard.css";
import confetti from "canvas-confetti";
import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { NumPlayersAtom, PlayersAtom } from "../util/atoms";

export function ScoreBoard() {
  const numPlayers = useAtomValue(NumPlayersAtom);
  const players = useAtomValue(PlayersAtom);
  const scoredPlayers = players
    .filter((player) => player.index < numPlayers)
    .sort((a, b) => b.score - a.score);

  useEffect(() => {
    // do confetti
    // this is ripped straight from the demo
    var duration = 5 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }, []);

  return (
    <section className="score-board">
      <ol>
        {scoredPlayers.map((player, index) => {
          if (index < 3) {
            return (
              <li key={index}>
                <FaTrophy />
                <div>{index + 1}.</div>
                <div>{player.name}</div>
                <div>{player.score}</div>
              </li>
            );
          } else {
            return (
              <li key={index}>
                <div>{index + 1}.</div>
                <div>{player.name}</div>
                <div>{player.score}</div>
              </li>
            );
          }
        })}
      </ol>
    </section>
  );
}
