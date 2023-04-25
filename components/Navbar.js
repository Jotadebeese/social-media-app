import Link from 'next/link'
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth";
import { useContext, useState } from 'react';
import { UserContext } from '@/lib/context';
import { useRouter } from 'next/router';


// Tap navbar

export default function Navbar() {
    
    const { user, username } = useContext(UserContext);
    const router = useRouter();

    function handleLoginClick() {
        
        const redirectUrl = router.asPath // get the current URL
        router.push({
          pathname: '/enter',
          query: { redirect: redirectUrl } // pass the URL as a query parameter
        })
    }

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
                                <img src={user?.photoURL || '/profile.png'} />
                            </Link>
                        </li>
                    </>
                )}

                {/* user is not signed */}
                {!user && !username && (
                    <li className="push-left">
                        <Link href="/enter">
                            <button onClick={handleLoginClick} className='btn-orange'>Log In</button>
                        </Link>
                    </li>
                )}
                {/* user is signed and has not created username */}
                {user && !username && (
                    <>
                    <li className="push-left">
                        <Link href="/enter">
                            <button className='btn-orange'>Log In</button>
                        </Link>
                    </li>
                    <li>
                    <   button className="btn-orange" onClick={() => signOut(auth)}>Sign Out</button>
                    </li>
                    </>
                )}
            </ul>
        </nav>
    )
}