import PostFeed from '@/components/PostFeed'
import Loader from '@/components/Loader'
import { orderBy, where, query, collectionGroup, limit, getDocs, Timestamp, startAfter } from 'firebase/firestore';
import { firestore, postToJSON } from '@/lib/firebase';
import { useState } from 'react';
import Metatags from '@/components/Metatags';


// Max post to query per page
const LIMIT = 5;

export async function getServerSideProps(context) {
  const ref = collectionGroup(firestore, 'posts');
  const postsQuery = query(
    ref,
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(LIMIT),
  )

  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);

  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  // Get next page in pagination query
  const getMorePosts = async () => {
    setLoading(true)
    const last = posts[posts.length - 1];

    const cursor = typeof last.createdAt === 'number' ? Timestamp.fromMillis(last.createdAt) : last.createdAt;

    const ref = collectionGroup(firestore, 'posts');
    const postsQuery = query(
      ref,
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      startAfter(cursor),
      limit(LIMIT)
    )

    const newPosts = (await getDocs(postsQuery)).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <Metatags title="Home Page" description="Get the latest posts on our site" />

      <PostFeed posts={posts} />

      <div className='box-center'>

        {!loading && !postsEnd && <button className='load-more' onClick={getMorePosts}>Load more</button>}
        <Loader show={loading} />
        {postsEnd && 'You have reached the end!'}

      </div>
    </main>
  )
}
