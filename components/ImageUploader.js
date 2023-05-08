import { STATE_CHANGED, auth, storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import Loader from "./Loader";
import { useRouter } from "next/router";


// Upload images to Firebase Storage
export default function ImageUploader() {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadURL, setDownloadURL] = useState(null);

    const router = useRouter();
    const { slug } = router.query;

    // Creates a Firebase Upload task
    const uploadFile = async (e) => {
        // Get file
        const file = Array.from(e.target.files)[0];
        const extension = file.type.split('/')[1];

        // Makes reference to the storage bucket location
        const fileRef = ref(storage, `uploads/${auth.currentUser.uid}/${slug}/${Date.now()}.${extension}`);
        setUploading(true);

        // Starts the upload
        const task = uploadBytesResumable(fileRef, file);

        // Listen to updates to upload task
        task.on(STATE_CHANGED, (snapshot) => {
            const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
            setProgress(pct);
        });

        // Get dowloadURL *AFTER* task resolves (Note: this is not a native promise)
        task
            .then((d) => getDownloadURL(fileRef))
            .then((url) => {
                setDownloadURL(url);
                setUploading(false);
            });
    };

    return (
        <div className="box">
            <Loader show={uploading} />
            {uploading && <p>Uploading {progress}%</p>}

            {!uploading && (
                <>
                    <label className="btn">
                        <img src={'/camera.gif'} width="60px" />
                        <input type="file" onChange={uploadFile} accept="image/x-png,image/gif,image/jpeg" />
                    </label>
                </>
            )}

            {downloadURL && <code className="upload-snippet">{`![alt](${downloadURL})`}</code>}
        </div>
    );
}