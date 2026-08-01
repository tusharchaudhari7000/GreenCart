import "./Register.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  registerUser,
  getSecurityQuestions,
  getCities,
  getAreasByCity
} from "../../services/authService";


export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roleId, setRoleId] = useState("");
  const [aadhaarNo, setAadhaarNo] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [errors, setErrors] = useState({});

  const [cities, setCities] = useState([
    { cityId: 1, cityName: "Pune" },
    { cityId: 2, cityName: "Mumbai" },
    { cityId: 3, cityName: "Nagpur" },
    { cityId: 4, cityName: "Nashik" },
    { cityId: 5, cityName: "Bangalore" },
    { cityId: 6, cityName: "Delhi" }
  ]);
  const [areas, setAreas] = useState([]);
  const [cityId, setCityId] = useState("");
  const [areaId, setAreaId] = useState("");

  //Hooks
  const navigate = useNavigate();



  useEffect(() => {
    getSecurityQuestions()
      .then(res => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setQuestions(res.data);
        }
      })
      .catch(() => toast.error("Failed to load security questions"));
  }, []);


  useEffect(() => {
    getCities()
      .then(res => {
        console.log("Cities response:", res);
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setCities(res.data.map(c => ({
            cityId: c.cityId || c.id,
            cityName: c.cityName || c.name
          })));
        }
      })
      .catch(err => console.log("Using default cities list:", err));
  }, []);


  useEffect(() => {
    if (cityId) {
      getAreasByCity(cityId)
        .then(res => {
          console.log("Areas response for cityId", cityId, ":", res);
          if (res && res.data && Array.isArray(res.data)) {
            setAreas(res.data.map(a => ({
              areaId: a.areaId || a.id,
              areaName: a.areaName || a.name
            })));
          }
        })
        .catch(err => console.log("Failed to load areas:", err));
    } else {
      setAreas([]);
      setAreaId("");
    }
  }, [cityId]);



  const handleSubmit = (e) => {

    e.preventDefault();

    let newErrors = {};

    if (!username || username.length < 5 || username.length > 20) {
      newErrors.username = "Username must be 5–20 characters";
    }

    if (!password || password.length < 8 || password.length > 16) {
      newErrors.password = "Password must be 8–16 characters";
    }

    if (!firstName || !/^[A-Za-z]{2,30}$/.test(firstName)) {
      newErrors.firstName = "First name must contain only alphabets (2–30 chars)";
    }

    if (!lastName || !/^[A-Za-z]{2,30}$/.test(lastName)) {
      newErrors.lastName = "Last name must contain only alphabets (2–30 chars)";
    }

    if (!roleId) {
      newErrors.roleId = "Please select a role";
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      newErrors.phone = "Phone must be 10 digits and not start with 0";
    }

    if (!cityId) {
      newErrors.city = "Please select a city";
    }

    if (!areaId) {
      newErrors.area = "Please select an area";
    }

    if (!questionId) {
      newErrors.questionId = "Please select a security question";
    }

    if (!answer || answer.trim().length < 2) {
      newErrors.answer = "Answer must be at least 2 characters";
    }

    if (roleId === "2" && !aadhaarNo) {
      newErrors.aadhaarNo = "Aadhaar number is required for Farmer";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Register payload →", {
      username,
      roleId: Number(roleId),
      questionId: Number(questionId),
      answer
    });

    setErrors({});

    registerUser({
      username,
      password,
      firstName,
      lastName,
      roleId: Number(roleId),
      aadhaarNo: roleId === "2" ? aadhaarNo : null,
      email,
      phone,
      areaId: Number(areaId),
      questionId: Number(questionId),
      answer: answer.trim()
    })
      .then(res => {
        if (res.status === 200) {
          toast.success("Registration successful");
          navigate("/login");
        }
      })
      .catch(err => {
        if (err.response?.status === 409) {
          toast.error("Username already exists");
        } else {
          toast.error("Registration failed");
        }
      });


  };

  // ===== UI =====
  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <div className="register-header">
          <div className="header-icon">🌳</div>
          <h1 className="header-title">Join GreenCart</h1>
          <p className="header-subtitle">Create your account to start your green journey</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Row 1: Username, Password, First Name */}
          <div className="form-group">
            <label>Username*</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
            />
            {errors.username && <p className="error-text">{errors.username}</p>}
          </div>

          <div className="form-group">
            <label>Password*</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label>First Name*</label>
            <input
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Enter first name"
            />
            {errors.firstName && <p className="error-text">{errors.firstName}</p>}
          </div>

          {/* Row 2: Last Name, Email, Phone */}
          <div className="form-group">
            <label>Last Name*</label>
            <input
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Enter last name"
            />
            {errors.lastName && <p className="error-text">{errors.lastName}</p>}
          </div>

          <div className="form-group">
            <label>Email*</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter email"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Phone*</label>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>

          {/* Row 3: Role, City, Area */}
          <div className="form-group">
            <label>Role*</label>
            <select value={roleId} onChange={e => setRoleId(e.target.value)}>
              <option value="">Select Role</option>
              <option value="2">Farmer</option>
              <option value="3">Buyer</option>
            </select>
            {errors.roleId && <p className="error-text">{errors.roleId}</p>}
          </div>

          <div className="form-group">
            <label>City*</label>
            <select value={cityId} onChange={e => setCityId(e.target.value)}>
              <option value="">Select City</option>
              {cities.map(c => (
                <option key={c.cityId} value={c.cityId}>{c.cityName}</option>
              ))}
            </select>
            {errors.city && <p className="error-text">{errors.city}</p>}
          </div>

          <div className="form-group">
            <label>Area*</label>
            <select value={areaId} onChange={e => setAreaId(e.target.value)} disabled={!cityId}>
              <option value="">Select Area</option>
              {areas.map(a => (
                <option key={a.areaId} value={a.areaId}>{a.areaName}</option>
              ))}
            </select>
            {errors.area && <p className="error-text">{errors.area}</p>}
          </div>

          <div className="form-group">
            <label>
              Aadhaar Number
              {roleId !== "2" && <span className="optional-label">(Optional)</span>}
            </label>
            <input
              value={aadhaarNo}
              onChange={e => setAadhaarNo(e.target.value)}
              maxLength={12}
              placeholder={roleId === "2" ? "Enter Aadhaar number" : "Not required for Buyer"}
              disabled={roleId !== "2"}
            />
            {errors.aadhaarNo && <p className="error-text">{errors.aadhaarNo}</p>}
          </div>


          <div className="form-group">
            <label>Security Question*</label>
            <select value={questionId} onChange={e => setQuestionId(e.target.value)}>
              <option value="">Select Question</option>
              {questions.map(q => (
                <option key={q.question_id} value={q.question_id}>{q.question}</option>
              ))}
            </select>
            {errors.questionId && <p className="error-text">{errors.questionId}</p>}
          </div>

          <div className="form-group">
            <label>Answer*</label>
            <input
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Enter answer"
            />
            {errors.answer && <p className="error-text">{errors.answer}</p>}
          </div>

          {/* Buttons */}
          <div className="button-group">
            <button type="button" className="cancel-btn" onClick={() => window.history.back()}>
              Cancel
            </button>
            <button type="submit" className="register-btn">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}