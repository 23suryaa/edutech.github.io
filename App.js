import { useState } from 'react';
import React from 'react';
import './App.css';
import leaderboard from './leaderboard.svg';
import rules from './rules.svg';

let termSubmit = "";
let termCondition = "";
let termCounter = 0;
let test = "a";

const API_KEY = "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";

function App() {
  const [currentWord, setCurrentWord] = useState("");
  const [previousWord, setPreviousWord] = useState("");
  const [valid, setValid] = useState("");

  async function callOpenAIAPI() {
    const prompt = previousWord
      ? `Does the word "${currentWord}" start with the letter "${previousWord.slice(-1)}"? Respond with 'yes' or 'no'.`
      : "This is the first word.";

    const APIBody = {
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an assistant whose job is to say 'yes' if the new word starts with the last letter of the previous word, or 'no' if it doesn't."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_KEY,
      },
      body: JSON.stringify(APIBody),
    })
    .then(response => response.json())
    .then(data => {
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        const response = data.choices[0].message.content.trim();
        setValid(response);

        // Update the previous word if the new word is valid
        if (response.toLowerCase() === 'yes' && currentWord) {
          setPreviousWord(currentWord);

        }
      } else {
        setValid("No valid response from the API");

      }
    })
    .catch(error => {
      console.error("Error calling OpenAI API:", error);
      setValid("Error calling API");
    });
  }

  function handleCurrentWordChange(e) {
    setCurrentWord(e.target.value);
    setValid(""); // Reset the validation message whenever the word is changed
  }

  
  console.log(valid);
  if (valid == "Yes" || valid == "yes" || valid == "Yes.") {
    termCondition = "✅✅✅";
    console.log(termCounter);
  } 
  else if (valid == "no" || valid == "No" || valid == 'No.') {
    termCondition = "❌❌❌";
    console.log(termCondition);
    console.log(termCounter);
  } else {
    termCondition = "You may begin.";
  }

  function countAndAPI() {
    callOpenAIAPI()
    if (termCondition = "✅✅✅") {
      termCounter = termCounter + 1;
    }   else {
          termCounter = termCounter -1;
        }
  }

  console.log(currentWord);
  return (
    <div className="App">
      <header className="App-header">
        <img src={leaderboard} className="leaderboard" alt="leadrboard" />
        <img src={rules} className="rules" alt="rules" />

      <button className="button1" data-text="Awesome">
      <span className="button1">&nbsp;WordLink.&nbsp;</span>
      </button>

      <button className="button2" data-text="Awesome">
      <span className="actual-text">&nbsp;MAKE THE LONGEST CHAIN!&nbsp;</span>
      </button>

      <div className="input-wrapper">
      <input type="text" placeholder="Write Here" name="text" className="input" onChange={(e) => setCurrentWord(e.target.value)}/>
      </div>

      <h3>{termCondition}</h3>

      <div>
        <button onClick= {countAndAPI} class="button3"> <p class="submit">submit</p> </button>
      </div>

      <div>
      <button class="button4"> <p class="{termcounter}"> {termCounter} </p> </button>
      </div>

      </header>
      
    </div>
  );
}

export default App;