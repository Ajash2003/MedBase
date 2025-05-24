import { useState } from 'react';
import { queryDB } from '../db';
import './SqlQuery.css'; // We'll create this CSS file

export default function SqlQuery() {
  const [sql, setSql] = useState('');
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

  // Function to format date strings for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="sql-query-container">
      <div className="query-input-container">
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          rows={5}
          placeholder="Enter SQL query..."
          className="query-textarea"
        />
        <button 
          onClick={executeQuery} 
          disabled={loading || !sql.trim()}
          className="execute-button"
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Executing...
            </>
          ) : (
            <>
              <i className="fas fa-play"></i> Execute Query
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}
      
      {results && (
        <div className="results-container">
          <h3 className="results-header">
            Results ({results.rows.length} row{results.rows.length !== 1 ? 's' : ''})
          </h3>
          
          <div className="table-container">
            <table className="results-table">
              <thead>
                <tr>
                  {results.rows.length > 0 && 
                    Object.keys(results.rows[0]).map((key) => (
                      <th key={key}>{key.replace(/_/g, ' ')}</th>
                    ))
                  }
                </tr>
              </thead>
              <tbody>
                {results.rows.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i}>
                        {typeof value === 'string' && value.includes('T00:00:00') 
                          ? formatDate(value)
                          : (value === null ? 'NULL' : String(value))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}