import Link from "next/link";

export default function PostFeed({ posts, admin }) {
    return posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />) : null;
}

function PostItem({ post, admin = false }) {
    // Naive method to calc word count and read time
    const wordCount = post?.content.trim().split(/\s+/g).length;
    const minutesToRead = (wordCount / 100 + 1).toFixed(0);

    return (
        <div className="card">
            <Link className="text-username" href={`/${post.username}`}>
                By <span>@{post.username}</span>
            </Link>

            <Link href={`/${post.username}/${post.slug}`}>
                <h2>
                    {post.title}
                </h2>
            </Link>

            <footer>
                <span>{wordCount} words. {minutesToRead} min read.</span>
                <span className="push-left"><img src={'/carrot.png'} width="30px" />&nbsp;{post.heartCount || 0}</span>
            </footer>

            {/* If admin mood, display exctra controls for user*/}
            {admin && (
                <>
                    <Link href={`/admin/${post.slug}`}>
                        <button className="btn-green">Edit</button>
                    </Link>

                    {post.published ? <p className="text-success">Live</p> : <p className="text-danger">Unpublished</p>}
                </>
            )}
        </div>
    );
}