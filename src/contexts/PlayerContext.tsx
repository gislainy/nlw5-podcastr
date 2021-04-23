import { createContext, ReactNode, useContext, useState } from "react";

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
	hasPrevious: boolean,
	hasNext: boolean,
	play: (episode: Episode) => void
	playList: (episode: Episode[], index: number) => void
	playNext: () => void
	togglePlay: () => void
	playPrevious: () => void
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

	function playList(list: Episode[], index: number) {
		setEpisodeList(list);
		setIsPlaying(true);
		setCurrentEpisodeIndex(index);
	}

	function togglePlay() {
		setIsPlaying(!isPlaying);
	}

	function setPlayingState(state: boolean) {
		setIsPlaying(state);
	}

    function playNext() {
        if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)
        } 
    }
    function playPrevious() {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)
        } 
    }

    const hasPrevious = currentEpisodeIndex > 0
    const hasNext = (currentEpisodeIndex + 1) < episodeList.length

	return (
		<PlayerContext.Provider value={{
			episodeList,
			currentEpisodeIndex,
			isPlaying,
			togglePlay,
			setPlayingState,
			play,
            playList,
            playNext,
            playPrevious,
            hasNext,
            hasPrevious
		}}>
            {props.children}
        </PlayerContext.Provider>
    )
}

export const userPlayer = () => useContext(PlayerContext);