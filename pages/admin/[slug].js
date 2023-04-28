import AuthCheck from "@/components/AuthCheck";
import { auth, firestore } from "@/lib/firebase";
import { doc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";

export default function AdminPostsPage(props ) {
    return (
        <AuthCheck>
            <PostManager />
        </AuthCheck>
    );
}

function PostManager() {
    const [preview, setPreview] = useState(false);

    const router = useRouter();
    const { slug } = router.query;
}

const postRef = doc(firestore, 'users', auth.currentUser.uid, 'posts', slug);
const [post] = useDocumentDataOnce(postRef);

return (
    <main className={styles.container}></main>
)