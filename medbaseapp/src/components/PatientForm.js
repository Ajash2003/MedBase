import { useState, useEffect } from 'react';
import { queryDB } from '../db';
import { useNavigate } from 'react-router-dom';


export default function PatientForm({ patient, onSuccess }) { 
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


  useEffect(() => {
    if (patient) {
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
        email: patient.email || '',
        department: patient.department
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        phone: '',
        email: '',
        department: ''
      });
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
      console.log('Updating patient with data:', formData);
      
      await queryDB(
        `UPDATE patients SET 
          first_name = $1, 
          last_name = $2, 
          date_of_birth = $3, 
          gender = $4, 
          address = $5, 
          phone = $6, 
          email = $7,
          department = $8
         WHERE id = $9`,
        [
          formData.firstName,
          formData.lastName,
          formData.dateOfBirth,
          formData.gender,
          formData.address,
          formData.phone,
          formData.email,
          formData.department,
          patient.id
        ]
      );
      alert('Patient updated successfully!');
    } else {
      console.log('Inserting new patient with data:', formData);
      
      await queryDB(
        `INSERT INTO patients 
          (first_name, last_name, date_of_birth, gender, address, phone, email, department)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          formData.firstName,
          formData.lastName,
          formData.dateOfBirth,
          formData.gender,
          formData.address,
          formData.phone,
          formData.email,
          formData.department
        ]
      );
      alert('Patient registered successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        phone: '',
        email: '',
        department: ''
      });
    }
  } catch (err) {
    console.error('Form submission error:', err);
    alert(`Operation failed: ${err.message}`);
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

          <div className="form-group">
            <label>Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              <option value="Cardiology">Cardiology</option>
              <option value="General Medicine">General Medicine</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Neurology">Neurology</option>
              <option value="Psychiatry">Psychiatry</option>
              <option value="Pulmonology">Pulmonology</option>
              <option value="ENT">ENT</option>
              <option value="Gastroenterology">Gastroenterology</option>
              <option value="General Surgery">General Surgery</option>
              <option value="Gynaecology">Gynaecology</option>
              <option value="Dentistry">Dentistry</option>
              <option value="Paediatrics">Paediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Ophthalmology">Ophthalmology</option>
            </select>
          </div>
        </div>
        
        <button type="submit" disabled={loading || errors.phone || errors.dateOfBirth}
        onClick={() => navigate('/register', { state: null })}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Processing...
            </>
          ) : (
            <>
              <i className="fas fa-save"></i> {patient ? 'Update Patient Details' : 'Register Patient'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}