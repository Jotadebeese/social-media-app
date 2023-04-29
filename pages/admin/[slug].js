import styles from '@/styles/Admin.module.css';
import AuthCheck from "@/components/AuthCheck";
import { auth, firestore } from "@/lib/firebase";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

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

    const postRef = doc(firestore, 'users', auth.currentUser.uid, 'posts', slug);
    const [post] = useDocumentDataOnce(postRef);

    return (
        <main className={styles.container}>
            {post && (
                <>
                    <section>
                        <h1>{post.title}</h1>
                        <p>ID: {post.slug}</p>

                        <PostForm postRef={postRef} defaultValues={post} preview={preview} />
                    </section>

                    <aside>
                        <h3>Tools</h3>
                        <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
                        <Link href={`/${post.username}/${post.slug}`}>
                            <button className="btn-blue">Live view</button>
                        </Link>
                    </aside>
                </>
            )}
        </main>
    );
}

function PostForm({ defaultValues, postRef, preview }) {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({ defaultValues, mode: 'onChange' });

    const { isValid, isDirty } = formState;

    const updatePost = async ({ content, published }) => {
        await updateDoc(postRef, {
            content,
            published,
            updateAt: serverTimestamp(),
        });

        reset( { content, published });

        toast.success('Post updated successfully!');
    };

    return (
        <form onSubmit={handleSubmit(updatePost)}>
            {preview && (
                <div className="card">
                    <ReactMarkdown>{watch('content')}</ReactMarkdown>
                </div>
            )}

            <div className={preview ? styles.hidden : styles.controls}>
            <textarea
          name="content"
          ref={register({
            maxLength: { value: 20000, message: 'content is too long' },
            minLength: { value: 10, message: 'content is too short' },
            required: { value: true, message: 'content is required' },
          })}
        ></textarea>

                {/* {errors.content && <p className="text-danger">{errors.content.message}</p>} */}

                <fieldset>
                    <input className={styles.checkbox} name="published" type="checkbox" ref={register} />
                    <label>Published</label>
                </fieldset>

                <button type="submit" className="btn-green">
                    Save Changes
                </button>
            </div>
        </form>
    );
}

