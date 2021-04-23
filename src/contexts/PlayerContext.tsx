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
    isLooping: boolean,
    isShuffling: boolean,
	hasPrevious: boolean,
	hasNext: boolean,
	play: (episode: Episode) => void
	playList: (episode: Episode[], index: number) => void
	playNext: () => void
	togglePlay: () => void
	toggleLoop: () => void
	toggleShuffle: () => void
	playPrevious: () => void
	setPlayingState: (state: boolean) => void
	clearPlayerState: (state: boolean) => void
}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode
}

export function PlayerContextProvider (props: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLooping, setIsLooping] = useState(false);
	const [isShuffling, setIsShuffling] = useState(false);

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
    
	function toggleLoop() {
		setIsLooping(!isLooping);
	}

	function toggleShuffle() {
		setIsShuffling(!isShuffling);
	}

	function setPlayingState(state: boolean) {
		setIsPlaying(state);
	}

    function playNext() {
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeIndex(nextRandomEpisodeIndex)
        }else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1)
        } 
    }
    function playPrevious() {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1)
        } 
    }

    function clearPlayerState() {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    const hasPrevious = currentEpisodeIndex > 0
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

	return (
		<PlayerContext.Provider value={{
			episodeList,
			currentEpisodeIndex,
			isPlaying,
            isLooping,
            isShuffling,
			togglePlay,
            toggleLoop,
            toggleShuffle,
			setPlayingState,
			play,
            playList,
            playNext,
            playPrevious,
            clearPlayerState,
            hasNext,
            hasPrevious,
            
		}}>
            {props.children}
        </PlayerContext.Provider>
    )
}

export const userPlayer = () => useContext(PlayerContext);