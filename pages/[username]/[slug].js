import styles from '@/styles/Post.module.css';
import PostContent from "@/components/PostContent";
import { UserContext } from "@/lib/context";
import { firestore, getUserWithUsername, postToJSON } from "@/lib/firebase";
import { doc, getDocs, getDoc, collectionGroup, query, limit, getFirestore } from "firebase/firestore";
import { useContext } from "react";
import { useDocumentData } from 'react-firebase-hooks/firestore'
import Link from 'next/link';
import Metatags from '@/components/Metatags';


export async function getStaticProps({ params }) {
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);

    let user;
    let post;
    let path;

    if (userDoc) {
        user = userDoc.data();
        const postRef = doc(firestore, userDoc.ref.path, 'posts', slug);
        post = postToJSON(await getDoc(postRef));

        path = postRef.path;
    }

    return {
        props: { post, path, user },
        revalidate: 100,
    };
}

export async function getStaticPaths() {
    const q = query(
        collectionGroup(getFirestore(), 'posts'),
        limit(20)
    )
    const snapshot = await getDocs(q);

    const paths = snapshot.docs.map((doc) => {
        const { slug, username } = doc.data();
        return {
            params: { username, slug },
        };
    });

    return {
        // must be in this format:
        // paths: [
        //   { params: { username, slug }}
        // ],
        paths,
        fallback: 'blocking',
    };
}

export default function Post(props) {
    const postRef = doc(getFirestore(), props.path);
    const [realtimePost] = useDocumentData(postRef);

    const post = realtimePost || props.post;
    const user = props.user;

    var carrotsCount = post.heartCount
    if ( carrotsCount >= 1000) {
        // Divide the likes count by 1000 and round it to one decimal place
        // Append the 'k' suffix to the likes count
        carrotsCount = `${(carrotsCount / 1000).toFixed(1)}k`;
    } 

    return (
      <main className={styles.container}>
        <Metatags title={post.title} description={post.title} />
        <section>
            <PostContent post={post} />
        </section>

        <aside>
            <div className='card-post'>
                <Link href={`/${user.username}`}>
                    <img src={user?.photoURL || '/profile.png'} className="card-img-center" />
                </Link>
                <Link href={`/${user.username}/`}>
                    <p><i>@{user.username}</i></p>
                </Link>
                <h1>{user.displayName || 'Anonymous User'}</h1>
                <p><img src={'/carrot.png'} width="30px" />&nbsp;{carrotsCount || 0}</p>
            </div>
        </aside>
  
      </main>
    );
  }