import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import logoDefault from './images/summarizelogo.png';
import logoThink from './images/summarizethink.png';
import infoIcon from './images/infoicon.png';



function App() {
  const [titleInput, setTitleInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');
  const [yearInput, setYearInput] = useState('');
  const [chapterInput, setChapterInput] = useState('');
  let [wordcountInput, setWordcountInput] = useState('');

  const [apiResponse, setApiResponse] = useState('');

  const [loading, setLoading] = useState(false); //used in api

  const [requiredFields, setRequiredFields] = useState(false); //see if all required fields are filled in

  const wordcountIconText = "Default value is 250 words.\nThe average person reads 250 words per minute.";



  // Generate years from 1700 to 2030
  const years = Array.from({ length: 2030 - 1700 + 1 }, (_, i) => 2030 - i);
  const wordCounts = [100, 250, 500, 1000, 1250, 1500, 2000, 2500, 3000];
  const handleSubmit = async () => {
    setRequiredFields(true);

    if (!titleInput.trim()) {
      return;
    }

    console.log('Title:', titleInput);
    console.log('Author:', authorInput);
    console.log('Year:', yearInput);
    console.log('Chapter:', chapterInput);
    console.log('Wordcount:', wordcountInput);

    if (!wordcountInput) {
      wordcountInput = 250;
      console.log("Missing Wordcount ", wordcountInput)
    }

    const maxTokens = wordcountInput * 2; // doubles for max tokens on 4o-mini

    console.log('Max Tokens:', maxTokens);

    setApiResponse('');

    const key = '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'

    //api stuff
    setLoading(true);
    let chatPrompt = `Besides this upcoming summary, do not include anything else in your response, do not use any markdown or formatting symbols like ###, **, or bullet points. Just use plain section titles and paragraphs. Be thorough in each section, but also do not include headers such as "Introduction", "Summary", or "Plot Overview" in the actual response. Create a truthful summary of the book ${titleInput}. ` //theme, charcters, make it deep summary prompt
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
    if (wordcountInput) {
      chatPrompt += `The in-depth summary needs to be about ${wordcountInput} words. Break it into the following sections: Introduction, Plot Overview, Character Arcs, Major Themes, and Conclusion but also do not include headers such as "Introduction", "Summary", or "Plot Overview" in the actual response. `
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: chatPrompt }],
          max_tokens: maxTokens
        },
        {
          headers: {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('OpenAI Prompt:', chatPrompt); // 👈 Add this - checks the prompt


      const reply = response.data.choices[0].message.content;
      setApiResponse(reply);
    } catch (error) {
      console.error('OpenAI Error:', error);
      setApiResponse('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="app-container">
      <h1>
        SummarizeIt{' '}
        <img
          src={loading ? logoThink : logoDefault}
          alt="App Logo"
          className={`header-logo ${loading ? 'logo-pulse' : ''}`}
        />
      </h1>

      <div className="input-group">
        <label htmlFor="title-input">Title*</label>
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
        <button onClick={handleSubmit} disabled={loading} id="submit-button">
          {loading ? 'Thinking...' : requiredFields && !titleInput.trim() ? 'Fill in Title' : 'Submit'}
        </button>
      </div>

    {apiResponse && (
      <div className="api-response">
        <h3> </h3> 
      <p>{apiResponse}</p>
    </div>
    )}

  </div>
  );
}

export default App;
