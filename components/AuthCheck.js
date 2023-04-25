import { UserContext } from "@/lib/context";
import Link from "next/link";
import { useContext } from "react";

// Component's children only shown to logged-in users

export default function AuthCheck(props) {
    const { username } = useContext(UserContext);

    return username ? props.children : props.fallback || 
    <main className='box-404 auth'>
        <div>
            <p>
                You must be signed in,&nbsp;
                <Link href="/enter">
                    <button className="load-more"><b>Click here...</b></button>
                </Link>
            </p>
        </div>
        <img src={'./404-page2.png'} />
    </main>;
}