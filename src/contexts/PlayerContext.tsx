import { createContext, ReactNode, useState } from "react";

type Episode = {
	title: string;
	members: string;
	thumbnail: string;
	duration: number;
	url: string;
}

type PlayerContextData = {
	episodeList: Episode[]
	currentEpisodeIndex: number,
	isPlaying: boolean,
	play: (episode: Episode) => void
	togglePlay: () => void
	setPlayingState: (state: boolean) => void
}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode
}

export function PlayerContextProvider (props: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);

	function play(episode) {
		setEpisodeList([episode]);
		setIsPlaying(true);
		setCurrentEpisodeIndex(0);
	}
	function togglePlay() {
		setIsPlaying(!isPlaying);
	}
	function setPlayingState(state: boolean) {
		setIsPlaying(state);
	}

	return (
		<PlayerContext.Provider value={{
			episodeList,
			currentEpisodeIndex,
			isPlaying,
			togglePlay,
			setPlayingState,
			play
		}}>
            {props.children}
        </PlayerContext.Provider>
    )
}