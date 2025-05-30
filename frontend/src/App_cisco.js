import { useState, useEffect } from 'react';
import FRONTEND_CONFIG from './frontend_config';
import ciscoLogo from './assets/cisco_logo.png';

function App() {
  const [code, setCode] = useState('');
  const [responses, setResponses] = useState({ codeReview: '', bom: '', license: '' });
  const [history, setHistory] = useState([]);
  const [selectedModel, setSelectedModel] = useState('cisco_bridge_sonar');
  const [tasks, setTasks] = useState({ codeReview: true, bom: false, licenseCheck: false });

  useEffect(() => {
    if (!selectedModel) {
      setSelectedModel('cisco_bridge_sonar');
    }
  }, [selectedModel]);

  const handleSubmit = async () => {
    if (!code.trim()) return;

    setResponses({ codeReview: '', bom: '', license: '' });

    const modelToSend = selectedModel === 'cisco_bridge_sonar' ? 'openai' : selectedModel;

    const requestPayload = {
      code,
      model: modelToSend,
      tasks
    };

    setHistory(prev => [...prev, { prompt: code }]);

    try {
      const res = await fetch(`${FRONTEND_CONFIG.BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      const data = await res.json();
      if (data.response) {
        setResponses({
          codeReview: data.response.codeReview || '',
          bom: data.response.bom || '',
          license: data.response.license || ''
        });
      } else {
        setResponses({ codeReview: '', bom: '', license: '' });
      }
    } catch (err) {
      setResponses({ codeReview: 'Server error', bom: '', license: '' });
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
        boxShadow: '0 6px 24px rgba(128, 90, 213, 0.2)',
        background: '#f3e8ff',
        fontFamily: 'Segoe UI, sans-serif'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
        <img src={ciscoLogo} alt="Cisco Logo" style={{ width: '50px', marginRight: '10px' }} />
        <h2 style={{ color: '#4b0082' }}>Cisco Bridge IT - Code Review</h2>
      </div>

      <textarea
        rows={10}
        placeholder="Paste or type your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{
          width: '100%',
          fontFamily: 'monospace',
          fontSize: '14px',
          borderRadius: '10px',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
          border: '1px solid #aaa',
          padding: '12px',
          marginBottom: '1rem',
          backgroundColor: '#fff'
        }}
      />

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <label>
          <input
            type="checkbox"
            checked={tasks.codeReview}
            onChange={() => setTasks({ ...tasks, codeReview: !tasks.codeReview })}
          /> Code Review
        </label>
        <label>
          <input
            type="checkbox"
            checked={tasks.bom}
            onChange={() => setTasks({ ...tasks, bom: !tasks.bom })}
          /> Bill of Materials
        </label>
        <label>
          <input
            type="checkbox"
            checked={tasks.licenseCheck}
            onChange={() => setTasks({ ...tasks, licenseCheck: !tasks.licenseCheck })}
          /> License Check
        </label>
      </div>

      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        style={{
          width: '100%',
          padding: '0.6rem',
          marginBottom: '1rem',
          borderRadius: '8px',
          border: '1px solid #a78bfa',
          backgroundColor: '#f5f3ff',
          color: '#4b0082'
        }}
      >
        <option value="cisco_bridge_sonar">Cisco Bridge IT</option>
        <option value="openai">OpenAI</option>
        <option value="llama3">LLaMA 3</option>
        <option value="llama2">LLaMA 2</option>
        <option value="deepseek">DeepSeek</option>
      </select>

      <button
        onClick={handleSubmit}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: 'linear-gradient(to bottom, #b794f4, #805ad5)',
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
        🚀 Submit for Review
      </button>

      {(tasks.codeReview || tasks.bom || tasks.licenseCheck) && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ borderBottom: '1px solid #aaa', paddingBottom: '0.5rem', color: '#4b0082' }}>Review Response:</h3>

          {tasks.codeReview && (
            <div style={{ background: '#ede9fe', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h4>🔍 Code Review</h4>
              <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {responses.codeReview.split(/(?=Improved Code)/i).map((section, index) => {
                  const isImproved = section.trim().toLowerCase().startsWith('improved code');
                  return (
                    <div
                      key={index}
                      style={{
                        background: isImproved ? '#faf5ff' : 'transparent',
                        padding: isImproved ? '0.5rem' : '0',
                        borderRadius: isImproved ? '6px' : '0',
                        marginBottom: isImproved ? '0.5rem' : '0'
                      }}
                    >
                      {section}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tasks.bom && (
            <div style={{ background: '#fce7f3', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h4>📦 Bill of Materials</h4>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{responses.bom}</pre>
            </div>
          )}

          {tasks.licenseCheck && (
            <div style={{ background: '#e9d5ff', padding: '1rem', borderRadius: '8px' }}>
              <h4>📜 License Information</h4>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{responses.license}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
