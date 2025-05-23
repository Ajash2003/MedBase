import { useState, useEffect } from 'react';
import { queryDB } from '../db';

export default function PatientForm({ patient }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (patient) {
      // Format the date for the date input (YYYY-MM-DD)
      const formattedDate = patient.date_of_birth 
        ? new Date(patient.date_of_birth).toISOString().split('T')[0]
        : '';
      
      setFormData({
        firstName: patient.first_name,
        lastName: patient.last_name,
        dateOfBirth: formattedDate,
        gender: patient.gender,
        address: patient.address || '',
        phone: patient.phone || '',
        email: patient.email || ''
      });
    } else {
      // Clear form when switching to new patient mode
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        phone: '',
        email: ''
      });
      setErrors({});
    }
  }, [patient]);

  const validatePhone = (phone) => {
    if (phone && !/^\d{10}$/.test(phone)) {
      return '';
    }
    return '';
  };

  const validateDate = (date) => {
    if (!date) return 'Date of birth is required';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'phone') {
      setErrors(prev => ({
        ...prev,
        phone: validatePhone(value)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const phoneError = validatePhone(formData.phone);
    const dateError = validateDate(formData.dateOfBirth);
    
    if (phoneError || dateError) {
      setErrors({
        phone: phoneError,
        dateOfBirth: dateError
      });
      return;
    }

    setLoading(true);
    
    try {
      if (patient) {
        // Update existing patient
        await queryDB(
          `UPDATE patients SET 
            first_name = $1, 
            last_name = $2, 
            date_of_birth = $3, 
            gender = $4, 
            address = $5, 
            phone = $6, 
            email = $7 
           WHERE id = $8`,
          [
            formData.firstName,
            formData.lastName,
            formData.dateOfBirth,
            formData.gender,
            formData.address,
            formData.phone,
            formData.email,
            patient.id
          ]
        );
        alert('Patient updated successfully!');
      } else {
        // Create new patient
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
        alert('Patient registered successfully!');
        // Clear form after successful registration
        setFormData({
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          gender: '',
          address: '',
          phone: '',
          email: ''
        });
      }
    } catch (err) {
      alert(patient ? 'Failed to update patient' : 'Failed to register patient');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Date of Birth *</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
          </div>
          
          <div className="form-group">
            <label>Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                e.target.value = value;
                handleChange(e);
              }}
              pattern="\d{10}"
              title="Please enter exactly 10 digits (no spaces or dashes)"
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <button type="submit" disabled={loading || errors.phone || errors.dateOfBirth}>
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Processing...
            </>
          ) : (
            <>
              <i className="fas fa-save"></i> {patient ? 'Update Patient' : 'Register Patient'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}