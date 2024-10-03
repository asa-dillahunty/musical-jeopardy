import './SongSelect.css';
import { useState } from "react";
import { searchTracks } from "../util/spotifyAPI";
import { AiOutlineSearch } from "react-icons/ai";

export function SongSelect({ token, onClose, selectTrack, val }) {
	const [queryVal, setQueryVal] = useState("");
	const [searchResults, setSearchResults] = useState([]);

	const onEnter = (e) => {
		if (e.key === 'Enter') {
			performQuery();
		}
	}

	const performQuery = () => {
		console.log(queryVal);
		searchTracks(queryVal, token).then((results) => {
			setSearchResults(results);
			console.log(results);
		});
	}

	return (
		<div className="question-box">
			<div className="search-bar">
				<input
					onChange={(e) => setQueryVal(e.target.value)}
					value={queryVal}
					onKeyDown={onEnter}
				/>
				<AiOutlineSearch onClick={performQuery}/>
			</div>
			<div className='search-box'>
				{ searchResults && searchResults.map( (val, index) => 
					<div 
						className="search-item"
						onClick={() => selectTrack(val)}
						key={index}
					>
						<p> { val.name } </p>
						<p> { val.artists[0].name } </p>
					</div>
				) }
			</div>
			{ val && 
				<p>{ val.name }</p>
			}
			<button onClick={() => onClose()}>close</button>
		</div>
	);
}