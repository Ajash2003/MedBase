import { useState } from 'react';
import { queryDB } from '../db';

export default function SqlQuery() {
  const [sql, setSql] = useState();
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const executeQuery = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await queryDB(sql);
      setResults(result);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="query-container">
        <div className="query-input">
          <textarea
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            rows={5}
            placeholder="Enter SQL query..."
          />
          <button onClick={executeQuery} disabled={loading}>
            {loading ? 'Executing...' : 'Execute Query'}
          </button>
        </div>
        
        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}
        
        {results && (
          <div className="query-results">
            <h3>Results ({results.rows.length} rows)</h3>
            <pre>{JSON.stringify(results.rows, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}