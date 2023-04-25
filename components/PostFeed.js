import { Timestamp, serverTimestamp } from "firebase/firestore";
import Link from "next/link";

export default function PostFeed({ posts, admin }) {
    return posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />) : null;
}
// Calculate the time ago of a post
function getTimeAgo(timestamp) {
    const postDate = timestamp === null? new Date() : timestamp.toDate();
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - postDate.getTime();
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    
    if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }
  }

function PostItem({ post, admin = false }) {
    // Naive method to calc word count and read time
    const wordCount = post?.content.trim().split(/\s+/g).length;
    const minutesToRead = (wordCount / 100 + 1).toFixed(0);
    var carrotsCount = post.heartCount
    if ( carrotsCount >= 1000) {
        // Divide the likes count by 1000 and round it to one decimal place
        // Append the 'k' suffix to the likes count
        carrotsCount = `${(carrotsCount / 1000).toFixed(1)}k`;
    }    

    const time = typeof post.createdAt === 'number' ? Timestamp.fromMillis(post.createdAt) : post.createdAt;

    const timeDiff = getTimeAgo(time); 

    return (
        <div className="card">
            {admin && (
                <div className="card-header">
                    <Link href={`/admin/${post.slug}`}>
                        <button className="btn-green">Edit</button>
                    </Link>

                    {post.published ? <p className="text-success push-left">Live</p> : <p className="push-left text-danger">Unpublished</p>}
                </div>
            )}
            <header className="card-header">
                <Link className="text-username" href={`/${post.username}`}>
                    By <span>@{post.username}</span>
                </Link>
                <p className="push-left">{timeDiff}</p>
            </header>

            <Link href={`/${post.username}/${post.slug}`}>
                <h2>
                    {post.title}
                </h2>
            </Link>

            <footer>
                <span>{wordCount} words. {minutesToRead} min read.</span>
                <span className="push-left"><img src={'/carrot.png'} width="30px" />&nbsp;{carrotsCount || 0}</span>
            </footer>

            {/* If admin mood, display exctra controls for user*/}
            
        </div>
    );
}