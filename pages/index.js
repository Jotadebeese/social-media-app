import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'

import Loader from '@/components/Loader'
import toast from 'react-hot-toast';

export default function Home() {
  return (
    <div>
      <Loader show />
      <button onClick={() => toast.success('Love you my vida!!!!')}>
        Toast Me
      </button>
    </div>
  )
}
