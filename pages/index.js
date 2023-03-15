import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [messageInput, setMessageInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'User-Agent': '*'
        },
        body: JSON.stringify({ messages: messageInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setMessageInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>PAAI</title>
      </Head>

      <main className={styles.main}>
        <h3>Ask your question</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="message"
            placeholder="Ask your question"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <input type="submit" value="Generate Answers" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
