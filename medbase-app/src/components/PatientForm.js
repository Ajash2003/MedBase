import { useState } from "react";
import { queryDB } from "../db";

export default function PatientForm({ onPatientAdded }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await queryDB(
        `INSERT INTO patients (first_name, last_name, date_of_birth, gender, address, phone, email)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          formData.firstName,
          formData.lastName,
          formData.dateOfBirth,
          formData.gender,
          formData.address,
          formData.phone,
          formData.email,
        ]
      );
      onPatientAdded();
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        phone: "",
        email: "",
      });
      alert("Patient registered successfully!");
    } catch (err) {
      console.error("Error registering patient:", err);
      alert("Failed to register patient");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="patient-form">
      <h2>Register New Patient</h2>
      <div className="form-group">
        <label>
          First Name:
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Last Name:
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Date of Birth:
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Gender:
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </label>
      </div>
      <div className="form-group">
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Phone:
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
      </div>
      <button type="submit">Register Patient</button>
    </form>
  );
}