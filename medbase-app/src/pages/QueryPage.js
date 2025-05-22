import SqlQuery from '../components/SqlQuery';
import './Page.css';

export default function QueryPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <i className="fas fa-code"></i> SQL Query Interface
        </h1>
      </div>
      <SqlQuery />
    </div>
  );
}