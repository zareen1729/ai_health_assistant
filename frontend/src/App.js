import { useState, useEffect } from 'react';
import FRONTEND_CONFIG from './frontend_config';
import healthLogo from './assets/healthcare.png'; // Replace with a relevant image

function App() {
  const [healthInput, setHealthInput] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState([]);
  const [selectedModel, setSelectedModel] = useState('gpt-4o');

  useEffect(() => {
    if (!selectedModel) {
      setSelectedModel('gpt-4o');
    }
  }, [selectedModel]);

  const handleSubmit = async () => {
    if (!healthInput.trim()) return;

    const prompt = `A patient reports the following health details: ${healthInput}.
    Based on this information, provide a preliminary analysis, suggest possible conditions,
    and recommend whether they should see a specialist or take further action.`;

    setHistory(prev => [...prev, { prompt }]);

    const requestPayload = {
      code: prompt, // reusing 'code' as the backend expects it
      model: selectedModel,
      tasks: { codeReview: true } // you can rename this at backend if needed
    };

    try {
      const res = await fetch(`${FRONTEND_CONFIG.BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      const data = await res.json();
      setResponse(data?.response?.codeReview || 'No response from model');
    } catch (err) {
      setResponse('Server error while processing your request.');
    }
  };

  return (
    <div
      style={{
        padding: '2rem',
        margin: '2rem auto',
        maxWidth: '900px',
        border: '1px solid #ddd',
        borderRadius: '16px',
        boxShadow: '0 6px 24px rgba(0, 0, 0, 0.1)',
        background: '#f0fdf4',
        fontFamily: 'Segoe UI, sans-serif'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
        <img src={healthLogo} alt="Health Review Logo" style={{ width: '50px', marginRight: '10px' }} />
        <h2 style={{ color: '#065f46' }}>AI Health Assistant</h2>
      </div>

      <textarea
        rows={10}
        placeholder="Describe your health condition (e.g. symptoms, age, gender, health history)..."
        value={healthInput}
        onChange={(e) => setHealthInput(e.target.value)}
        style={{
          width: '100%',
          fontFamily: 'monospace',
          fontSize: '14px',
          borderRadius: '10px',
          border: '1px solid #aaa',
          padding: '12px',
          marginBottom: '1rem',
          backgroundColor: '#fff'
        }}
      />

      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        style={{
          width: '100%',
          padding: '0.6rem',
          marginBottom: '1rem',
          borderRadius: '8px',
          border: '1px solid #6ee7b7',
          backgroundColor: '#ecfdf5',
          color: '#065f46'
        }}
      >
        <option value="gpt-4o">OpenAI GPT-4o</option>
        <option value="gpt-4">GPT-4</option>
        <option value="llama3">LLaMA 3</option>
      </select>

      <button
        onClick={handleSubmit}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: 'linear-gradient(to bottom, #6ee7b7, #34d399)',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          fontSize: '15px',
          fontWeight: '600',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(0)',
          transition: 'all 0.2s ease-in-out'
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
      >
        🩺 Submit Health Details
      </button>

      {response && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ borderBottom: '1px solid #aaa', paddingBottom: '0.5rem', color: '#065f46' }}>
            AI Health Response:
          </h3>
          <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace' }}>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{response}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

