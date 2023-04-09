import Link from 'next/link'
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth";
import { useContext } from 'react';
import { UserContext } from '@/lib/context';

// Tap navbar
export default function Navbar() {
    
    const { user, username } = useContext(UserContext)

    return (
        <nav className='navbar'>
            <ul>
                <li>
                    <Link href="/">
                        <button>PAGINA</button>
                    </Link>
                </li>
                {/* user is signed-in and has username */}
                {username && (
                    <>
                        <li className="push-left">
                            <Link href="/admin">
                                <button>Write Posts</button>
                            </Link>
                        </li>
                        <li>
                            <button className="btn-orange" onClick={() => signOut(auth)}>Sign Out</button>
                        </li>
                        <li>
                            <Link href={`/${username}`}>
                                <img src={user?.photoURL} />
                            </Link>
                        </li>
                    </>
                )}

                {/* user is not signed OR has not created username */}
                {!username && (
                    <li>
                        <Link href="/enter">
                            <button className='btn-orange'>Log In</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}