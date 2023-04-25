import Link from 'next/link';

export default function Custom404() {
  return (
    <main className='box-404'>
        <div>
            <h2>
                404 - nah, 
                <br/>that page does not exist.
            </h2>
            <Link href="/">
                <button className="load-more"><b>Go back!</b></button>
            </Link>
        </div>
        <img src={'./404-page.png'} />
    </main>
  );
}