import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { EpisodeAdapter } from "../../adapter/EpisodieAdapter";
import { api } from "../../components/api";
import { userPlayer } from "../../contexts/PlayerContext";
import { Episode } from "../../entity/Episode";

import styles from "./episodes.module.scss"

type episodeProps = {
  episode: Episode
}

export default function Episodes({ episode }: episodeProps) {

  const { play } = userPlayer();
  const router = useRouter();

  if (router.isFallback) {
    return (
      <p>Carregando</p>
    )
  }

  return (
    <div className={styles.episode}>
      <Head>
        <title>{episode.title}</title>
      </Head>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={320}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar episodio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      >

      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {

  const paths = await api.get("/episodes", {
    params: {
      _limit: 2,
      _sort: "published_at",
      _order: "desc"
    }
  })
    .then(res => res.data)
    .then(episodes => episodes.map(episode => {
      return {
        params: {
          slug: episode.id
        }
      }
    }));
  return {
    paths: paths,
    fallback: "blocking"
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {

  const episode = await api
    .get(`/episodes/${ctx.params.slug}`)
    .then(res => res.data)
    .then(EpisodeAdapter)

  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24,
  }
}