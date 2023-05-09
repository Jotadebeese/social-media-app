import { auth, firestore } from "@/lib/firebase";
import { doc, increment, writeBatch } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";


// Allows user to hear or like a post
export default function Heart({ postRef, carrotsCount }) {
    // Listen to heart document for currently logged in user
    const heartRef = doc(firestore, postRef.path, 'hearts', auth.currentUser.uid);
    const [heartDoc] = useDocument(heartRef);

    // Create user-to-post relationship
    const addHeart = async () => {
        const uid = auth.currentUser.uid;
        const batch = writeBatch(firestore);

        batch.update(postRef, { heartCount: increment(1) });
        batch.set(heartRef, { uid });

        await batch.commit();
    };

    // Remove a user-to-post relationship
    const removeHeart = async () => {
        const batch = writeBatch(firestore);

        batch.update(postRef, { heartCount: increment(-1) });
        batch.delete(heartRef);

        await batch.commit();
    };

    return heartDoc?.exists() ? (
        <div className="carrot-box">
            <button className="btn" onClick={removeHeart}><img src={'/carrot.png'} width="30px" /></button>
            {carrotsCount || 0}
        </div>
    ) : (
        <div className="carrot-box">
            <button className="btn" onClick={addHeart}><img src={'/empty-carrot.png'} width="30px" /></button>
            {carrotsCount || 0}
        </div>
    );
}