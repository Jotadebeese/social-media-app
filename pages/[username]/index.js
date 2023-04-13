import { firestore, getUserWithUsername, postToJSON } from "@/lib/firebase"
import UserProfile from "@/components/UserProfile"
import PostFeed from "@/components/PostFeed"
import { getFirestore, orderBy, where, query, collection, getDocs, limit } from "firebase/firestore";

export async function getServerSideProps({ query: urlQuery }) {
    const { username } = urlQuery;

    const userDoc = await getUserWithUsername(username);

    // JSON serializable data
    let user = null;
    let posts = null;

    if (userDoc) {
        user = userDoc.data();

        const postsQuery = query(
            collection(firestore, 'posts'),
            where('published', '==', true),
            where('username', '==', username),
            orderBy('createdAt', 'desc'),
            limit(5)
        );
        posts = (await getDocs(postsQuery)).docs.map(postToJSON);
    }

    return {
        props: { user, posts }, // will be passed to the page component as props
    };
}

export default function UserProfilePage({ user, posts }) {
    return (
        <main>
            <UserProfile user={user} />
            <PostFeed posts={posts} />
        </main>
    );
}