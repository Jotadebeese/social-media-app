import { auth, firestore, googleAuthProvider } from "@/lib/firebase"
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, writeBatch, getDoc, getFirestore } from 'firebase/firestore';
import { useEffect, useState, useCallback, useContext } from "react";
import { UserContext } from "@/lib/context";
import debounce from "lodash.debounce";

export default function EnterPage(props) {
    
    const { user, username } = useContext(UserContext)

    return (
        <main>
            {user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />
            }
        </main>
    )
}

// Sign in with google button
function SignInButton() {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleAuthProvider)
    };

    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <img src={'/google.png'} width="20px" />&nbsp;Sign in with Google
        </button>
    )
}

// Sign out button
function SignOutButton() {
    return <button onClick={() => signOut(auth)}>Sign Out</button>;
}

// Username form
function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext);

    const onSubmit = async (e) => {
        e.preventDefault();

        // Create refs for both documents
        const userDoc = doc(getFirestore(), 'users', user.uid);
        const usernameDoc = doc(getFirestore(), 'usernames', formValue);

        // Commit both docs together as a batch write
        const batch = writeBatch(getFirestore());
        batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
        batch.set(usernameDoc, { uid: user.uid });

        await batch.commit();
    };

    const onChange = (e) => {
        // Force form value typed in form to match correct format
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
        setFormValue(val);
        setLoading(false);
        setIsValid(false);
      }
  
    if (re.test(val)) {
        setFormValue(val);
        setLoading(true);
        setIsValid(false);
      }
    };

    //

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    // check the database for usrname match after each debounced change
    // useCallback required for debounce to work
    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                const ref = doc(getFirestore(), 'usernames', username);
                const snap = await getDoc(ref);
                console.log('Firestore read executed', snap.exists());
                setIsValid(!snap.exists());
                setLoading(false);
            }
        }, 500),
        []
    );

    return (
        !username && (
            <section>
                <h3>Create an Username</h3>
                <form onSubmit={onSubmit}>
                    <input name="username" placeholder="Start typing..." value={formValue} onChange={onChange} />
                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
                    <button type="submit" disabled={!isValid}>
                        I choose you!&nbsp;
                        <img src={'/pokeball.png'} width="20px" />
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br />
                        loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    );
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
        return <p>Checking deeply in our database...</p>
    } else if (isValid) {
        return <p className="text-success">{username} is available&nbsp;<img src={'/mario.webp'} width="20px" /></p>
    } else if (username && !isValid) {
        return <p className="text-danger">nah... keep trying!</p>;
    } else {
        return <p></p>;
    }
}