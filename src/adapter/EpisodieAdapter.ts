
import { format, parseISO } from "date-fns";
import ptBr from "date-fns/locale/pt-BR";

import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

import { Episode } from '../entity/Episode';


export function EpisodeAdapter(episode): Episode {
    return {
        id: episode.id,
        title: episode.title,
        thumbnail: episode.thumbnail,
        members: episode.members,
        description: episode.description,
        url: episode.file.url,
        publishedAt: format(
            parseISO(episode.published_at), "d MMM yy", {
            locale: ptBr
        }
        ),
        durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
        duration: Number(episode.file.duration),
    }
}