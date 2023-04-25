import AuthCheck from "@/components/AuthCheck";
import PostFeed from "@/components/PostFeed";
import { UserContext } from "@/lib/context";
import { auth, firestore } from "@/lib/firebase";
import { collection, doc, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import kebabCase from "lodash.kebabcase";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { toast } from "react-hot-toast";

export default function AdminPostsPage({ }) {
    return (
        <main>
            <AuthCheck>
                <CreateNewPost />
                <PostList />
            </AuthCheck>
        </main>
    );
}

function CreateNewPost() {
    const router = useRouter();
    const { username } = useContext(UserContext);
    const [title, setTitle] = useState('');

    // Ensure slug is URL safe
    const slug = encodeURI(kebabCase(title));

    // Validate length
    const isValid = title.length > 3 && title.length < 100;

    // Create a new post in firestore
    const createPost = async (e) => {
        e.preventDefault();
        const uid = auth.currentUser.uid;
        const ref = doc(firestore, 'users', uid, 'posts', slug);

        // Give all fields a default here
        const data = {
            title,
            slug,
            uid,
            username,
            published: false,
            content: '# hello world!',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            heartCount: 0,
        };

        await setDoc(ref, data);
        
        toast.success('Post created!');

        // Imperative navigation after post is set
        router.push(`/admin/${slug}`);
    };

    return (
        <div className="box-center">
            <h1>Manage your Posts</h1>
            <form onSubmit={createPost}>
                <input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Have something in mind?"
                />
                <button type="submit" disabled={!isValid} className="btn-orange">
                    Create New Post
                </button>
            </form>
        </div>
    );
}

function PostList() {
    const ref = collection(firestore, 'users', auth.currentUser.uid, 'posts')
    const postQuery = query(ref, orderBy('createdAt', "desc"))

    const [querySnapshot] = useCollection(postQuery);

    const posts = querySnapshot?.docs.map((doc) => doc.data());

    return (
        <div>
            <PostFeed posts={posts} admin />
        </div>
    );
}