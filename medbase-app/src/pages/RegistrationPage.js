import PatientForm from '../components/PatientForm';
import './Page.css';

export default function RegistrationPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <i className="fas fa-user-plus"></i> Patient Registration
        </h1>
      </div>
      <PatientForm />
    </div>
  );
}