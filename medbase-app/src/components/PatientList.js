import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { queryDB } from '../db';
import './PatientList.css';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const result = await queryDB('SELECT * FROM patients ORDER BY created_at DESC');
      setPatients(result.rows);
    } catch (err) {
      setError('Failed to load patients');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    
    try {
      await queryDB('DELETE FROM patients WHERE id = $1', [id]);
      fetchPatients();
      if (selectedPatient?.id === id) setSelectedPatient(null);
    } catch (err) {
      alert('Failed to delete patient');
      console.error(err);
    }
  };

  const handleEdit = (patient, e) => {
    e.stopPropagation();
    navigate('/register', { state: { patient } });
  };

  const handleRowClick = (patient) => {
    setSelectedPatient(selectedPatient?.id === patient.id ? null : patient);
  };

  if (loading) return <div className="loading">Loading patients...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="patient-database">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <>
              <tr 
                key={patient.id} 
                onClick={() => handleRowClick(patient)}
                className={selectedPatient?.id === patient.id ? 'selected' : ''}
              >
                <td>{patient.id}</td>
                <td>{patient.first_name} {patient.last_name}</td>
                <td>{new Date(patient.date_of_birth).toLocaleDateString()}</td>
                <td>{patient.gender}</td>
                <td>
                  {patient.phone && <div><i className="fas fa-phone"></i> {patient.phone}</div>}
                  {patient.email && <div><i className="fas fa-envelope"></i> {patient.email}</div>}
                </td>
                <td className="actions">
                  <button 
                    className="edit-btn"
                    onClick={(e) => handleEdit(patient, e)}
                  >
                    <i className="fas fa-edit"></i> 
                  </button>
                  &nbsp;
                  <button 
                    className="delete-btn"
                    onClick={(e) => handleDelete(patient.id, e)}
                  >
                    <i className="fas fa-trash-alt"></i> 
                  </button>
                </td>
              </tr>
              {selectedPatient?.id === patient.id && (
                <tr className="details-row">
                  <td colSpan="6">
                    <div className="patient-details">
                      <h3>Patient Details</h3>
                      <div className="details-grid">
                        <div>
                          <strong>ID:</strong> {patient.id}
                        </div>
                        <div>
                          <strong>Full Name:</strong> {patient.first_name} {patient.last_name}
                        </div>
                        <div>
                          <strong>Date of Birth:</strong> {new Date(patient.date_of_birth).toLocaleDateString()}
                        </div>
                        <div>
                          <strong>Gender:</strong> {patient.gender}
                        </div>
                        {patient.address && (
                          <div>
                            <strong>Address:</strong> {patient.address}
                          </div>
                        )}
                        <div>
                          <strong>Phone:</strong> {patient.phone || 'N/A'}
                        </div>
                        <div>
                          <strong>Email:</strong> {patient.email || 'N/A'}
                        </div>
                        <div>
                          <strong>Registered On:</strong> {new Date(patient.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}