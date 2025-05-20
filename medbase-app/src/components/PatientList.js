import { useEffect, useState } from "react";
import { queryDB } from "../db";

export default function PatientList({ refresh }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const result = await queryDB("SELECT * FROM patients ORDER BY created_at DESC");
        setPatients(result.rows);
      } catch (err) {
        console.error("Error fetching patients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [refresh]);

  if (loading) return <div>Loading patients...</div>;

  return (
    <div className="patient-list">
      <h2>Registered Patients</h2>
      {patients.length === 0 ? (
        <p>No patients registered yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.first_name} {patient.last_name}</td>
                <td>{new Date(patient.date_of_birth).toLocaleDateString()}</td>
                <td>{patient.gender}</td>
                <td>
                  {patient.phone && <div>Phone: {patient.phone}</div>}
                  {patient.email && <div>Email: {patient.email}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}