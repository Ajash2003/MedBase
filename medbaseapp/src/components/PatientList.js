import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { queryDB, onDBChange } from '../db';
import './PatientList.css';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
    
    const unsubscribe = onDBChange(({ operation, data }) => {
      if (operation === 'DELETE') {
        setPatients(prev => prev.filter(p => p.id !== data.id));
      } else if (operation === 'INSERT' || operation === 'UPDATE') {
        fetchPatients(); 
      }
    });

    return () => unsubscribe();
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
      await queryDB('DELETE FROM patients WHERE id = $1', [id], true);
      setPatients(prev => prev.filter(p => p.id !== id));
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

  const filteredPatients = patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.first_name.toLowerCase().includes(searchLower) ||
      patient.last_name.toLowerCase().includes(searchLower) ||
      patient.phone?.includes(searchTerm) ||
      patient.email?.toLowerCase().includes(searchLower) ||
      patient.id.toString().includes(searchTerm)
    );
  });

  if (loading) return <div className="loading">Loading patients...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="patient-database">
      <div className="search-container">
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredPatients.length > 0 ? (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Contact</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map(patient => (
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
                    <td>{patient.department || '-'}</td>
                  </tr>
                  {selectedPatient?.id === patient.id && (
                    <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
                      <div className="patient-details-card" onClick={e => e.stopPropagation()}>
                        <button 
                          className="close-btn"
                          onClick={() => setSelectedPatient(null)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                
                        <div className="card-header">
                          <h2>
                            <i className="fas fa-user"></i> Patient Details
                          </h2>
                        </div>
                
                        <div className="card-body">
                          <div className="detail-row">
                            <span className="detail-label">Full Name:</span>
                            <span className="detail-value">
                              {selectedPatient.first_name} {selectedPatient.last_name}
                            </span>
                          </div>

                          <div className="detail-row">
                            <span className="detail-label">Date of Birth:</span>
                            <span className="detail-value">
                              {new Date(selectedPatient.date_of_birth).toLocaleDateString()}
                            </span>
                          </div>
                  
                          <div className="detail-row">
                            <span className="detail-label">Age:</span>
                            <span className="detail-value">
                              {Math.floor((new Date() - new Date(selectedPatient.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000))} years
                            </span>
                          </div>
                  
                          <div className="detail-row">
                            <span className="detail-label">Gender:</span>
                            <span className="detail-value">
                              {selectedPatient.gender}
                            </span>
                          </div>
                  
                          {selectedPatient.address && (
                            <div className="detail-row">
                              <span className="detail-label">Address:</span>
                              <span className="detail-value">
                                {selectedPatient.address}
                              </span>
                            </div>
                          )}
                  
                          <div className="detail-row">
                            <span className="detail-label">Phone:</span>
                            <span className="detail-value">
                              {selectedPatient.phone || 'Not provided'}
                            </span>
                          </div>
                  
                          <div className="detail-row">
                            <span className="detail-label">Email:</span>
                            <span className="detail-value">
                              {selectedPatient.email || 'Not provided'}
                            </span>
                          </div>
                  
                          <div className="detail-row">
                            <span className="detail-label">Department:</span>
                            <span className="detail-value">
                              {selectedPatient.department || 'Not specified'}
                            </span>
                          </div>
                          
                          <div className="detail-row">
                            <span className="detail-label">Registered On:</span>
                            <span className="detail-value">
                              {new Date(selectedPatient.created_at).toLocaleString()}
                            </span>
                          </div>
                          <br></br>
                          <div className="action-buttons">
                            <button 
                              className="edit-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(selectedPatient, e);
                              }}
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
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="no-results">
          No patients found matching your search
        </div>
      )}
    </div>
  );
}