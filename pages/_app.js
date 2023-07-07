import '@/styles/globals.css'
import Navbar from '@/components/Navbar'
import { Toaster } from 'react-hot-toast';
import { UserContext } from '@/lib/context';
import { useUserData } from '@/lib/hooks';
import { Analytics } from '@vercel/analytics/react';
import Version from '@/components/Version';

export default function App({ Component, pageProps }) {

  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
      <Analytics />
      <Version />
    </UserContext.Provider>
  );
}
