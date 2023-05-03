import Link from "next/link";
import ReactMarkdown  from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeMathJaxSvg from 'rehype-mathjax';

// UI component for main post content
export default function PostContent({ post} ) {
    const dateObj  = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();

    const createdAt = dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    return (
        <div className="card-post">
            <h1>{post?.title}</h1>
            <span className="text-sm">
                Written by{' '}
                <Link className="text-username" href={`/${post.username}/`}>
                    <span>@{post.username}</span>
                </Link>{' '}
                on {createdAt}
            </span>
            <ReactMarkdown 
                        className='mark-down post-content' 
                        children={post?.content}
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeMathJaxSvg]}
                        
                    />
        </div>
    );
}