import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { EpisodieAdapter } from "../../adapter/EpisodieAdapter";
import { api } from "../../components/api";
import { Episode } from "../../entity/Episodie";

import styles from "./episodes.module.scss"

type EpisodieProps = {
    episodie: Episode
}

export default function Episodes({ episodie }: EpisodieProps) {
    const router = useRouter();

    return (
        <div className={styles.episode}>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>
                <Image
                    width={700}
                    height={320}
                    src={episodie.thumbnail}
                    objectFit="cover"
                />
                <button type="button">
                    <img src="/play.svg" alt="Tocar episodio" />
                </button>
            </div>

            <header>
                <h1>{episodie.title}</h1>
                <span>{episodie.members}</span>
                <span>{episodie.publishedAt}</span>
                <span>{episodie.durationAsString}</span>
            </header>

            <div className={styles.description}
                dangerouslySetInnerHTML={{ __html: episodie.description }}
            >

            </div>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {

    const episodie = await api
        .get(`/episodes/${ctx.params.slug}`)
        .then(res => res.data)
        .then(EpisodieAdapter)

    return {
        props: {
            episodie
        },
        revalidate: 60 * 60 * 24,
    }
}