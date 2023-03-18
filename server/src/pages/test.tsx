import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '@/styles/Home.module.css';
import Link from "next/link";

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
    return (
        <>
            <main className={styles.main}>
                <div className={styles.description}>
                    <Link href={"/"}>Back to home page</Link>
                </div>
                <div className={styles.center}>
                    <p>Test page</p><br/>
                </div>
                <div></div>
            </main>
        </>
    );
}
