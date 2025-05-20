import { useState } from "react";
import { queryDB } from "../db";

export default function SqlQuery({ onQueryExecuted }) {
  const [sql, setSql] = useState("SELECT * FROM patients LIMIT 10");
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const executeQuery = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await queryDB(sql);
      setResults(result);
      onQueryExecuted?.();
    } catch (err) {
      setError(err.message);
      console.error("SQL error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sql-query">
      <h2>SQL Query Interface</h2>
      <div className="query-input">
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          rows={5}
          placeholder="Enter SQL query..."
        />
        <button onClick={executeQuery} disabled={loading}>
          {loading ? "Executing..." : "Execute Query"}
        </button>
      </div>
      {error && <div className="error">Error: {error}</div>}
      {results && (
        <div className="results">
          <h3>Results ({results.rows.length} rows)</h3>
          <pre>{JSON.stringify(results.rows, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}