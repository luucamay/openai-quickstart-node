import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [questionInput, setQuestionInput] = useState("");
  const [artistInput, setArtistInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: questionInput, artist: artistInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setQuestionInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Ask a question to a Choreographer</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/rainbow.svg" className={styles.icon} />
        <h3>Question for the choreographer</h3>
        <form onSubmit={onSubmit}>
          <label for="choreographer-select">Choose an choreographer:</label>
          <select name="choreographers" id="choreographer-select"
            onChange={(e) => setArtistInput(e.target.value)}
          >
            <option value="Jonathan Burrows">Jonathan Burrows</option>
            <option value="Martha Graham">Martha Graham</option>
            <option value="George Balanchine">George Balanchine</option>
            <option value="Merce Cunningham">Merce Cunningham</option>
            <option value="Pina Bausch">Pina Bausch</option>
            <option value="William Forsythe">William Forsythe</option>
            <option value="Alvin Ailey">Alvin Ailey</option>
            <option value="Jiří Kylián">Jiří Kylián</option>
            <option value="Twyla Tharp">Twyla Tharp</option>
            <option value="Akram Khan">Akram Khan</option>
            <option value="Crystal Pite">Crystal Pite</option>
          </select>
          <input
            type="text"
            name="question"
            placeholder="Enter a question"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
          />
          <input type="submit" value="Generate answer" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
