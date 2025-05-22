import { useEffect, useState } from 'react';
import { queryDB } from '../db';
import './PatientList.css';

// Helper function to format phone numbers
const formatPhone = (phone) => {
  if (!phone || phone.length !== 10) return phone;
  return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
};

// Helper function to calculate age from date of birth
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await queryDB(
          `SELECT * FROM patients ORDER BY created_at DESC`
        );
        setPatients(result.rows);
      } catch (err) {
        setError('Failed to load patient data. Please try again.');
        console.error('Error fetching patients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.first_name.toLowerCase().includes(searchLower) ||
      patient.last_name.toLowerCase().includes(searchLower) ||
      patient.phone?.includes(searchTerm) ||
      patient.email?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) return (
    <div className="loading-container">
      <i className="fas fa-spinner fa-spin"></i>
      <p>Loading patients...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <i className="fas fa-exclamation-triangle"></i>
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>
        <i className="fas fa-sync-alt"></i> Retry
      </button>
    </div>
  );

  return (
    <div className="card">
      <div className="patient-list-header">
        <h2>Patient Records</h2>
        <div className="search-container">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredPatients.length === 0 ? (
        <div className="no-results">
          <i className="fas fa-user-slash"></i>
          <p>No patients found</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Contact</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>
                    {patient.first_name} {patient.last_name}
                  </td>
                  <td>{calculateAge(patient.date_of_birth)}</td>
                  <td>{patient.gender}</td>
                  <td>
                    {patient.phone && (
                      <div className="contact-item">
                        <i className="fas fa-phone"></i>
                        <span>{formatPhone(patient.phone)}</span>
                      </div>
                    )}
                    {patient.email && (
                      <div className="contact-item">
                        <i className="fas fa-envelope"></i>
                        <span>{patient.email}</span>
                      </div>
                    )}
                  </td>
                  <td>
                    {new Date(patient.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}