import styles from '@/styles/Admin.module.css';
import AuthCheck from "@/components/AuthCheck";
import { auth, firestore } from "@/lib/firebase";
import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import ReactMarkdown  from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeMathJaxSvg from 'rehype-mathjax';
import ImageUploader from '@/components/ImageUploader';
import { deleteObject, getStorage, listAll, ref } from 'firebase/storage';

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
                        <h1 className={styles.title}>{post.title}</h1>

                        <PostForm postRef={postRef} defaultValues={post} preview={preview} />
                    </section>

                    <aside>
                        <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
                        <Link href={`/${post.username}/${post.slug}`}>
                            <button className="btn-blue">Live view</button>
                        </Link>
                        <DeletePostButton postRef={postRef} slug={slug} />
                    </aside>
                </>
            )}
        </main>
    );
}

function PostForm({ postRef, defaultValues, preview }) {
    const { 
        register, 
        handleSubmit, 
        reset,
        formState, 
        watch 
    } = useForm({ defaultValues, mode: 'onChange' });

    const { isValid, isDirty, errors } = formState;

    const updatePost = async ({ content, published }) => {
        await updateDoc(postRef, {
            content,
            published,
            updatedAt: serverTimestamp(),
        });

        reset({ content, published });

        toast.success('Post updated successfully!');
    };

    // function handleChange(event) {
    //     event.target.style.height = 'auto';
    //     event.target.style.height = event.target.scrollHeight + 'px';
    //   }

    return (
        <form onSubmit={handleSubmit(updatePost)}>
            {preview && (
                <div className='card-post fade-in'>
                    <ReactMarkdown 
                        className='mark-down' 
                        children={watch('content')}
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeMathJaxSvg]}
                        
                    />
                        
                </div>
            )}

            <div className={`${preview ? styles.hidden : styles.controls} ${'fade-in'}`}>

                <ImageUploader />

                <textarea 
                    {...register('content', {
                        maxLength: { value: 20000, message: 'content is too long' },
                        minLength: { value: 10, message: 'content is too short' },
                        required: { value: true, message: 'content is required' },
                    })}
                    // onChange={handleChange}
                >

                </textarea>

                {errors.content && <p className="text-danger">{errors.content.message}</p>}

                <div className={styles.controls2}>
                    <p>LIVE</p>
                    <div className={styles.checkbox}>
                        <input id="checkbox" {...register('published')} type='checkbox' />
                        <label for="checkbox"></label>
                    </div>
                    
                    <button type='submit' className='btn-green' disabled={!isDirty || !isValid}>
                        Save changes
                    </button>

                </div>                
            </div>
        </form>
    );
}

function DeletePostButton( {postRef, slug} ) {
    const router = useRouter();
    const storage = getStorage();

    // const fileRef = ref(storage, `uploads/${auth.currentUser.uid}/${slug}/`);

    const deletePost = async () => {
        const doIt = confirm('are you sure?');
        if (doIt) {
            await deleteDoc(postRef);
            router.push('/admin');
            toast('Eliminado! ', { icon: '🗑️'} );
        }
        // if(fileRef) {
        //     listAll(fileRef)
        //         .then((result) => {
        //             // Delete the file
        //         deleteObject(fileRef).then(() => {
        //             console.log('File deleted');
        //         }).catch((error) => {
        //             console.log(error);
        //         });
        //         })
        // }
    };

    return (
        <button className='btn-red' onClick={deletePost}>
            Delete
        </button>
    );
}

