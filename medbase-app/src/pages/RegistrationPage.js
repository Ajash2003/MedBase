import { useLocation } from 'react-router-dom';
import PatientForm from '../components/PatientForm';

export default function RegistrationPage() {
  const location = useLocation();
  const patient = location.state?.patient;


  return (
    <div className="registration-page">
      <div className="page-header">
        <h1 className="page-title">
          <i className="fas fa-user-plus"></i> 
          {patient ? 'Edit Patient Details' : 'Register Patient'}
        </h1>
      </div>
      <PatientForm patient={patient} />
    </div>
  );
}