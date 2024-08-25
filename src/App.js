import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase', label: 'Highest Lowercase Alphabet' }
  ];

  useEffect(() => {
    document.title = '123456'; // Replace with your roll number
  }, []);

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async () => {
    try {
        setErrorMessage('');
        // Parse JSON to ensure it's valid
        const parsedInput = JSON.parse(jsonInput);
        
        // Make API call
        const response = await axios.post('http://localhost:5000/bfhl', parsedInput);
        setResponseData(response.data);
    } catch (error) {
        if (error instanceof SyntaxError) {
            setErrorMessage('Invalid JSON format');
        } else if (error.response) {
            // Server responded with a status outside the 2xx range
            setErrorMessage(`API request failed with status: ${error.response.status}`);
        } else if (error.request) {
            // No response was received (network error)
            setErrorMessage('API request failed. Please check if the backend is running.');
        } else {
            // Other errors
            setErrorMessage(`Error: ${error.message}`);
        }
    }
};


  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };

  const renderResponse = () => {
    if (!responseData) return null;

    return (
      <div>
        {selectedOptions.map(option => (
          <div key={option.value}>
            <h3>{option.label}:</h3>
            <p>{JSON.stringify(responseData[option.value])}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '20px' }}>BFHL Frontend</h1>
      <div style={{ marginBottom: '10px' }}>
        <label>API Input</label>
        <input
          type="text"
          placeholder='{"data":["A","1","334","4","B"]}'
          value={jsonInput}
          onChange={handleInputChange}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button
          onClick={handleSubmit}
          style={{ backgroundColor: '#007bff', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}
        >
          Submit
        </button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>

      {responseData && (
        <>
          <div style={{ marginTop: '20px' }}>
            <label>Multi Filter</label>
            <Select
              isMulti
              options={options}
              onChange={handleSelectChange}
            />
          </div>
          <div style={{ marginTop: '20px' }}>
            <h3>Filtered Response</h3>
            {renderResponse()}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
