import React, { useState } from 'react';
import './App.css';

function App() {
  const [titleInput, setTitleInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');
  const [yearInput, setYearInput] = useState('');
  const [chapterInput, setChapterInput] = useState('');
  const [wordcountInput, setWordcountInput] = useState('');

  const [apiResponse, setApiResponse] = useState('');

  const [loading, setLoading] = useState(false); //used in api


  // Generate years from 1700 to 2030
  const years = Array.from({ length: 2030 - 1700 + 1 }, (_, i) => 1700 + i);
  const wordCounts = [100, 250, 500, 1000, 1250, 1500, 2000, 2500, 3000];
  const handleSubmit = () => {
    console.log('Title:', titleInput);
    console.log('Author:', authorInput);
    console.log('Year:', yearInput);
    console.log('Chapter:', chapterInput);
    console.log('Wordcount:', wordcountInput);
    alert('Submitted!');
    setApiResponse('');

    //api stuff
    setLoading(true);
    const chatPrompt = "Create a truthful summary of the book ${titleInput}"



    setApiResponse('Here is the response text you got! at end of handleSubmit'); // get back from api
  };


  return (
    <div className="app-container">
      <h1>SummarizeIt</h1>

      <div className="input-group">
        <label htmlFor="title-input">Book Title</label>
        <textarea
          id="title-input"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          placeholder="Diary of a Wimpy Kid..."
        />
      </div>

      <div className="input-group">
        <label htmlFor="author-input">Author</label>
        <textarea
          id="author-input"
          value={authorInput}
          onChange={(e) => setAuthorInput(e.target.value)}
          placeholder="Jeff Kinney..."
        />
      </div>

      <div className="input-group">
        <label htmlFor="year-input">Year Published</label>
        <select
          id="year-input"
          value={yearInput}
          onChange={(e) => setYearInput(e.target.value)}
        >
          <option value="">-- Choose a Year --</option>
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <label htmlFor="chapter-input">Chapter/Section</label>
        <textarea
          id="chapter-input"
          value={chapterInput}
          onChange={(e) => setChapterInput(e.target.value)}
          placeholder="Chapter 12..."
        />
      </div>

      <div className="input-group">
        <label htmlFor="wordcount-input">Word Count</label>
        <select
          id="wordcount-input"
          value={wordcountInput}
          onChange={(e) => setWordcountInput(e.target.value)}
        >
          <option value="">-- Choose a Word Count --</option>
          {wordCounts.map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>
      </div>

      <div className="input-group">
        <button onClick={() => handleSubmit()}>Submit</button>
    </div>

    {apiResponse && (
      <div className="api-response">
        <h3>Result:</h3>
      <p>{apiResponse}</p>
    </div>
    )}

  </div>
  );
}

export default App;
