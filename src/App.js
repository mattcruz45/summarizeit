import React, { useState } from 'react';
import './App.css';
import logoDefault from './images/summarizelogo.png';
import logoThink from './images/summarizethink.png';
import infoIcon from './images/infoicon.png';
import OpenAI from "openai";


function App() {
  const [titleInput, setTitleInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');
  const [yearInput, setYearInput] = useState('');
  const [chapterInput, setChapterInput] = useState('');
  let [wordcountInput, setWordcountInput] = useState('');
  const [customInput, setCustomInput] = useState('');

  const [apiResponse, setApiResponse] = useState('');

  const [loading, setLoading] = useState(false); //used in api

  const wordcountIconText = "Default value is 500 words.\nThe average person reads about 250 words per minute, so for a short detailed summary we recommend 500.";
  const extraInfoIconText = 'Add any extra information needed for the summary. For example, you can ask to focus on the themes and character development, to make the response in Italian, or to speak like Yoda.';

  const [titleBounce, setTitleBounce] = useState(false);

  // Generate years from 1700 to 2030
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1700 + 1 }, (_, i) => currentYear - i);
  const wordCounts = [100, 250, 500, 1000, 1250, 1500, 2000, 2500, 3000];
  const handleSubmit = async () => {

    if (!titleInput.trim()) { //////SUBMIT BOTTON CODE
      console.log('Failed to submit - fill in title input');
      setTitleBounce(true);
      setTimeout(() => setTitleBounce(false), 500); //one animation duration 400
      return;
    }

    console.log('Title:', titleInput);
    console.log('Author:', authorInput);
    console.log('Year:', yearInput);
    console.log('Chapter:', chapterInput);

    if (!wordcountInput) {
      wordcountInput = 500;
      console.log("Wordcount ", wordcountInput)
    } else {
      console.log("Wordcount ", wordcountInput)
    }

    //const maxTokens = wordcountInput * 2; // doubles for max tokens on 4o-mini

    //console.log('Max Tokens:', maxTokens);

    setApiResponse('');

   //const key = process.env.REACT_APP_OPENAI_KEY;
    const key = "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";

    //api stuff
    setLoading(true);
    let chatPrompt = `Besides this upcoming summary, do not include anything else in your response, do not use any markdown or formatting symbols like ###, **, or bullet points. Just use plain section titles and paragraphs. Be thorough in each section, but also do not include headers such as "Introduction", "Summary", or "Plot Overview" in the actual response. Create a truthful summary of ${titleInput}. `; //theme, charcters, make it deep summary prompt
    //create something that edits "max tokens" to be in line with detail/wordcount

    //engineering the prompt based on filled in inputs

    if (authorInput) {
      chatPrompt += `This book is written by ${authorInput}. `
    }
    if (yearInput) {
      chatPrompt += `Published in ${yearInput}. `
    }
    if (chapterInput) {
      chatPrompt += `Only give a summary of chapter(s) ${chapterInput}. `
    }
    if (customInput){
      chatPrompt += customInput;
      chatPrompt += '. ';
    }
    if (wordcountInput) {
      chatPrompt += `The in-depth summary needs to be about ${wordcountInput} words. Do not use the word 'delve'. ` //Break it into the following sections: Introduction, Plot Overview, Character Arcs, Major Themes, and Conclusion but also do not include headers such as "Introduction", "Summary", or "Plot Overview" in the actual response. 
    }

    console.log(chatPrompt);

    const client = new OpenAI({apiKey: key, dangerouslyAllowBrowser: true});

    try {
      const response = await client.responses.create({
        model: "gpt-5",
        input: chatPrompt

      });
      console.log(response);
      const reply = response.output_text;
      console.log("Sir Squire Squilliam Shakespeare has broughteth thou thy summary...");
      console.log(reply);
      setApiResponse(reply);
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        setApiResponse('Invalid API key. Please check your OpenAI API key.');
      } else if (error.response?.status === 404) {
        setApiResponse('Model not found. The model might not be available.');
      } else {
        setApiResponse(`Error: ${error.response?.data?.error?.message || 'Something went wrong'}`);
      }
    } finally {
      setLoading(false);
    }
  };


  return (

    <div className="everything">
    <div className="app-container">
      <h1>
        SummarizeIt{' '}
        <img
          src={loading ? logoThink : logoDefault}
          alt="App Logo"
          className={`header-logo ${loading ? 'logo-pulse' : ''}`}
        />
      </h1>

      <h4>
        Summarize any book, article, or paper with just the title and author{' '}
      </h4>

      <div className="input-group">
        <label htmlFor="title-input" className={titleBounce ? 'label-bounce' : ''}
        >Title*
        </label>
        <textarea
          id="title-input"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          placeholder="..."
        />
      </div>

      <div className="input-group">
        <label htmlFor="author-input">Author</label>
        <textarea
          id="author-input"
          value={authorInput}
          onChange={(e) => setAuthorInput(e.target.value)}
          placeholder="..."
        />
      </div>

      <div className="input-group">
        <label htmlFor="chapter-input">Chapter(s)</label>
        <textarea
          id="chapter-input"
          value={chapterInput}
          onChange={(e) => setChapterInput(e.target.value)}
          placeholder="..."
        />
      </div>

      <div className="input-group">
        <label htmlFor="year-input">Year Published</label>
        <select
          id="year-input"
          value={yearInput}
          onChange={(e) => setYearInput(e.target.value)}
        >
          <option value="">...</option>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="wordcount-input">
          Word Count
          <span className="wordcount-icon"><img src={infoIcon} alt="Info" className="info-icon-image" />
            <span className="wordcount-icon-text">{wordcountIconText}</span>
          </span>
        </label>
        <select
          id="wordcount-input"
          value={wordcountInput}
          onChange={(e) => setWordcountInput(e.target.value)}
        >
          <option value="">...</option>
          {wordCounts.map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="custom-input">Extra Information
          <span className="wordcount-icon"><img src={infoIcon} alt="Info" className="info-icon-image" />
            <span className="wordcount-icon-text">{extraInfoIconText}</span>
          </span>
        </label>
        <textarea
          id="custom-input"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="..."
        />
      </div>

      <div className="input-group">
        <button onClick={handleSubmit} disabled={loading} id="submit-button">
          {loading ? 'Thinking...' : 'Submit'}
        </button>
      </div>

    {apiResponse && (
      <div className="api-response">
        <h3> </h3> 
      <p>{apiResponse}</p>
    </div>
    )}

  </div>

  <footer className="footer">
      © {new Date().getFullYear()} MattCruzCo - All rights reserved
  </footer>
  </div>
  );
}

export default App;
