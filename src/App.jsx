
import { useState } from 'react';

function App() {
  const [jsonOutput, setJsonOutput] = useState(null);
  const [jsonInput, setJsonInput] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target.result;
        const json = convertTextToJson(text);
        setJsonOutput(json);
        setJsonInput(JSON.stringify(json, null, 2)); // Set the editable input
      };

      reader.readAsText(file);
    }
  };

  const convertTextToJson = (text) => {
    const lines = text.split('\n');
    const jsonObject = {};

    lines.forEach(line => {
      const [key, value] = line.split(':').map(item => item.trim());
      if (key && value) {
        jsonObject[key] = value;
      }
    });

    return jsonObject;
  };

  const handleDownload = () => {
    const blob = new Blob([jsonInput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleChange = (event) => {
    setJsonInput(event.target.value);
    try {
      setJsonOutput(JSON.parse(event.target.value)); // Update the jsonOutput on input change
    } catch (e) {
      console.log(e.message || e);
    }
  };

  return (
    <div>
      <h1>Text to JSON Converter</h1>
      <input type="file" accept=".txt" onChange={handleFileChange} />
      {jsonOutput && (
        <div>
          <h2>Editable JSON Output:</h2>
          <textarea
            value={jsonInput}
            onChange={handleChange}
            rows={10}
            cols={50}
          />
          <br />
          <button onClick={handleDownload}>Download JSON</button>
        </div>
      )}
    </div>
  );
}

export default App;
