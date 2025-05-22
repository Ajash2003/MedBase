import PatientList from '../components/PatientList';
import './Page.css';

export default function DatabasePage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <i className="fas fa-database"></i> Patient Database
        </h1>
      </div>
      <PatientList />
    </div>
  );
}