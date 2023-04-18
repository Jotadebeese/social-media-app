import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import Head from "next/head";

export default function Metatags({
    title = 'The new social Media platform for developers',
    description = 'A new social media platform to create posts about AI, programming, new technologies or anything related to tech. All of it by using a markdown text-editor',
    image = '/404-page2.png',
}) {
    return (
        <Head>
            <title>{title}</title>
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@jotadebeese" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
        </Head>
    );
}