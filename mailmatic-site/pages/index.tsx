import Head from "next/head";
import styles from "../styles/Home.module.css";
import Main from "../components/main";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>MailMatic | AI Written Emails</title>
        <meta name="description" content="Let AI help you write emails" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main />
    </div>
  );
}
