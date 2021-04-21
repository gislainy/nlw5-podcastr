import { GetStaticProps } from "next";
import Image from "next/image"
import { format, parseISO } from "date-fns";
import ptBr from "date-fns/locale/pt-BR";


import { api } from "../components/api";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

import styles from "./home.module.scss";

type Episodies = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  description: string;
  url: string;
  publishedAt: string;
  durationAsString: string;
  duration: Number;
}

type HomeProps = {
  lastestEpisodes: Episodies[],
  allEpisodes: Episodies[]
}


export default function Home({ lastestEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className={styles.homePage}>
      <section className={styles.lastestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {lastestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <div  className={styles.image}>
                  <Image
                    width={192}
                    height={192}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                  />
                </div>

                <div className={styles.episodeDetails}>
                  <a href="">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.duration}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episodio" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>

        <h2>Todos os episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <a href="">{episode.title}</a>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button>
                      <img src="/play-green.svg" alt="Tocar episodio" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const episodes = await api.get("/episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc"
    }
  })
    .then(res => res.data)
    .then(episodes => episodes.map(episode => {
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
    }));

  const lastestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2)
  return {
    props: {
      lastestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8
  }
}