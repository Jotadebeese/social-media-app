import { firestore, getUserWithUsername, postToJSON } from "@/lib/firebase"
import UserProfile from "@/components/UserProfile"
import PostFeed from "@/components/PostFeed"
import { getFirestore, orderBy, where, query, collection, getDocs, limit } from "firebase/firestore";
import Metatags from "@/components/Metatags";

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

    if (userDoc) {
        user = userDoc.data();

        const postsQuery = query(
            collection(getFirestore(), userDoc.ref.path, 'posts'),
            where('published', '==', true),
            orderBy('createdAt', 'desc'),
            limit(1)
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
            <Metatags title={user.username} description={`${user.username}'s public profile`} />
            <UserProfile user={user} />
            <PostFeed posts={posts} />
        </main>
    );
}