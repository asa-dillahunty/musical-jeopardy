import { useEffect, useState } from 'react';
import { getCurrentlyPlaying, pausePlayback, resumePlayback } from '../util/spotifyAPI';
import './CurrentlyPlayingWidget.css';
import { BsArrowClockwise, BsPauseFill, BsPlayFill } from 'react-icons/bs';

function PlayButton({paused, setPaused, token}) {
	const togglePause = () => {
		if (paused) resumePlayback(token);
		else pausePlayback(token);

		setPaused(!paused);
	} 

	if (paused) return <BsPlayFill onClick={togglePause} />
	else return <BsPauseFill onClick={togglePause} />
}

export default function CurrentlyPlayingWidget({token, widgetNeedsRefresh, toggleRefresh}) {
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(1);
	const [paused, setPaused] = useState(true);

	const refreshWidget = () => {
		getCurrentlyPlaying(token).then((val) => {
			console.log(val);
			if (!val) {
				setProgress(0);
				setPaused(true);
				setDuration(1);
				return;
			};
			setProgress(val.progress_ms);
			setPaused(!val.is_playing);
			setDuration(val.item.duration_ms);
		});
	}

	useEffect(() => {
		if (duration === 0) setDuration(1);
	}, [duration, setDuration])

	useEffect(() => {
		if (progress >= duration) return;
		if (paused) return;

		const intervalId = setInterval(() => {
			setProgress(progress + 1000)
		}, 1000);
	
		// clear interval on re-render to avoid memory leaks
		return () => clearInterval(intervalId);
	}, [progress, duration, paused]);

	useEffect(() => {
		if (widgetNeedsRefresh) {
			refreshWidget();
			toggleRefresh();
		}
		if (duration === 1) refreshWidget();
	}, [duration, widgetNeedsRefresh, toggleRefresh])

	return (
		<div className='currently-playing-widget'>
			<span>{Math.floor(progress/1000)}s</span>
			<progress value={progress} max={duration}></progress>
			<span>{Math.floor(duration/1000)}s</span>
			<PlayButton
				paused={paused}
				setPaused={setPaused}
				token={token}
			/>
			<BsArrowClockwise onClick={refreshWidget} />
		</div>
	);
	
}