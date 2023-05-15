import { auth, firestore, googleAuthProvider } from "@/lib/firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { doc, writeBatch, getDoc, getFirestore } from 'firebase/firestore';
import { useEffect, useState, useCallback, useContext } from "react";
import { UserContext } from "@/lib/context";
import debounce from "lodash.debounce";
import Metatags from "@/components/Metatags";
import { useRouter } from "next/router";

export default function EnterPage(props) {
    const { user, username } = useContext(UserContext)

    return (
        <main>
            <Metatags title="Enter" description="Sign up for this amazing app!" />
            {user ? !username ? <UsernameForm /> : <Redirect /> : <SignInButton />
            }
        </main>
    )
}

function Redirect() {
    const router = useRouter()
    const redirectUrl = router.query.redirect == null ? '/' : router.query.redirect;// get the URL from the query parameter
    console.log({redirectUrl});
    router.push(redirectUrl); // redirect the user back to the original page
}

// Sign in with google button
function SignInButton() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleAuthProvider);
    };

    const signInWithEmail = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setError(error.message);
        }
    };

    const signUpWithEmail = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="login-box">
            <h2>How do you want to login?</h2>
            <p>Email and password for people who always do extra work...</p>
            <form className="login-form" onSubmit={signInWithEmail}>
                <label>Email</label>
                <input name="email" placeholder="Enter an email..." type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label>Password</label>
                <input name="password" placeholder="Create a password you can remember!" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">
                    Sign In
                </button>
            </form>
            {error && <p className="text-danger">{error}</p>}
            <p> Or...<br/>
                Google for people who wants an easy process.</p>
            <button className="btn-google" onClick={signInWithGoogle}>
                <img src={'/google.png'} width="20px" />&nbsp;Sign in with Google
            </button>
            <br />
            <span>Don't have an account yet? </span>
            <button onClick={signUpWithEmail}>Sign up here</button>
        </div>
    )
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
            <section className="login-box">
                <h3>Create an Username</h3>
                <form className="card-post card login-form" onSubmit={onSubmit}>
                    <input name="username" placeholder="Start typing..." value={formValue} onChange={onChange} />
                    <button type="submit" disabled={!isValid}>
                        I choose you!&nbsp;
                        <img src={'/pokeball.png'} width="20px" />
                    </button>
                </form>
                <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
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