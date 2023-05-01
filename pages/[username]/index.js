import { firestore, getUserWithUsername, postToJSON } from "@/lib/firebase"
import UserProfile from "@/components/UserProfile"
import PostFeed from "@/components/PostFeed"
import { getFirestore, orderBy, where, query, collection, getDocs, limit, Timestamp, collectionGroup, startAfter } from "firebase/firestore";
import Metatags from "@/components/Metatags";
import { useState } from "react";
import Loader from "@/components/Loader";

// Max post to query per page
const LIMIT = 5;

export async function getServerSideProps({ query: urlQuery }) {
    const { username } = urlQuery;

    const userDoc = await getUserWithUsername(username);

    // If no user, display 4004 page
    if (!userDoc) {
        return {
            notFound: true,
        }
    }

    // JSON serializable data
    let user = null;
    let posts = null;
    const refPath = userDoc.ref.path;
    if (userDoc) {
        user = userDoc.data();

        const postsQuery = query(
            collection(getFirestore(), refPath, 'posts'),
            where('published', '==', true),
            orderBy('createdAt', 'desc'),
            limit(LIMIT)
        );
        posts = (await getDocs(postsQuery)).docs.map(postToJSON);
    }

    return {
        props: { user, posts, refPath }, // will be passed to the page component as props
    };
}

export default function UserProfilePage( props ) {
    const user = props.user;
    const refPath = props.refPath;
    const [posts, setPosts] = useState(props.posts);
    const [loading, setLoading] = useState(false);
    const [postsEnd, setPostsEnd] = useState(false);

    // Get next page in pagination query
    const getMorePosts = async () => {
        setLoading(true)
        const last = posts[posts.length - 1];

        const cursor = typeof last.createdAt === 'number' ? Timestamp.fromMillis(last.createdAt) : last.createdAt;

        const postsQuery = query(
            collection(getFirestore(), refPath, 'posts'),
            where('published', '==', true),
            orderBy('createdAt', 'desc'),
            startAfter(cursor),
            limit(LIMIT)
        );

        const newPosts = (await getDocs(postsQuery)).docs.map((doc) => doc.data());

        setPosts(posts.concat(newPosts));
        setLoading(false);

        if (newPosts.length < LIMIT) {
        setPostsEnd(true);
        }
    };

    return (
        <main>
            <Metatags title={user.username} description={`${user.username}'s public profile`} />
            <UserProfile user={user} />
            <PostFeed posts={posts} />

            <div className='box-center'>

                {!loading && !postsEnd && <button className='load-more' onClick={getMorePosts}>Load more</button>}
                <Loader show={loading} />
                {postsEnd && 'You have reached the end!'}

            </div>

        </main>
    );
}