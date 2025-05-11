import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import translate from "../translator";

const API_ROOT = process.env.REACT_APP_API_URL;

const PasswordReset = () => {
  const { passwordResetKey } = useParams();
  const [form, setForm] = useState({ password: "", repeatpassword: "", passwordResetKey: passwordResetKey });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(`${API_ROOT}/auth/passwordreset`, form);
      setSuccess("Hasło zostało zresetowane!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const interror = (form.password.length < 8) ? "Hasło jest zbyt krótkie"
                  : (form.password !== form.repeatpassword) ? "Hasła nie pasują do siebie"
                  : "";

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center angled-bg">
      <div className="card shadow p-4" style={{ width: "350px", zIndex: 1, position: "relative" }}>
        {success ? <div className="alert alert-success">
          {success} Teraz <Link to="/login">Zaloguj się</Link>.
        </div>
        :<>
          <h3 className="text-center mb-3">Zresetuj swoje hasło</h3>
          {error && <div className="alert alert-danger">{translate(error)}</div>}
          {interror && <div className="alert alert-danger">{interror}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Hasło</label>
              <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Powtórz hasło</label>
              <input type="password" name="repeatpassword" className="form-control" value={form.repeatpassword} onChange={handleChange} required />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading || interror !== ""}>
              {loading ? "Wysyłanie..." : "Zmień moje hasło"}
            </button>
          </form>
        </>}
      </div>
    </div>
  );
};

export default PasswordReset;
