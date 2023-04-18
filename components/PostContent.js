import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

// UI component for main post content
export default function PostContent({ post} ) {
    const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();

    return (
        <div className="card-post">
            <h1>{post?.title}</h1>
            <span className="text-sm">
                Written by{' '}
                <Link className="text-username" href={`/${post.username}/`}>
                    <span>@{post.username}</span>
                </Link>{' '}
                on {createdAt.toISOString()}
            </span>
            <ReactMarkdown>{post?.content}</ReactMarkdown>
        </div>
    );
}