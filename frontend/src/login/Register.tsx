import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import translate from "../translator";

const API_ROOT = process.env.REACT_APP_API_URL;

const Register = () => {
  const [form, setForm] = useState({ email: "", password: "", repeatpassword: "", captcha: "" });
  const [captchaSvg, setCaptchaSvg] = useState("");
  const [loading, setLoading] = useState(false);
  const [interror, setInterror] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadCaptcha();
  }, []);

  const loadCaptcha = async () => {
    try {
      const res = await axios.get(`${API_ROOT}/auth/captcha`);
      setCaptchaSvg(res.data);
    } catch (err) {
      console.error("Failed to load captcha", err);
    }
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if(form.password.length < 8) setInterror("Hasło jest zbyt krótkie");
    else if(form.password !== form.repeatpassword) setInterror("Hasła nie pasują do siebie");
    else setInterror("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post(`${API_ROOT}/auth/register`, form);
      setSuccess("Udało się zarejestrować! Sprawdź skrzynkę email aby aktywować konto.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      loadCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center angled-bg">
      <div className="card shadow p-4" style={{ width: "350px", zIndex: 1, position: "relative" }}>
        <h3 className="text-center mb-3">Stwórz nowe konto</h3>
        {error && <div className="alert alert-danger">{translate(error)}</div>}
        {interror && <div className="alert alert-danger">{interror}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        {form.email.endsWith("@zhr.pl") && <div className="alert alert-danger">Konta @zhr.pl logują się przez specjalny przycisk - nie musisz tworzyć konta. Przycisk znajduje się <Link to="/login">na stronie logowania</Link>.</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="text" name="email" className="form-control" value={form.email} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Hasło</label>
            <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Powtórz hasło</label>
            <input type="password" name="repeatpassword" className="form-control" value={form.repeatpassword} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Kod z obrazka</label>
            <div dangerouslySetInnerHTML={{ __html: captchaSvg }} className="mb-2 border p-2 bg-white text-center" />
            <input type="text" name="captcha" className="form-control" value={form.captcha} onChange={handleChange} required />
            <button type="button" className="btn btn-link p-0 mt-1" onClick={loadCaptcha}>Wylosuj inny kod</button>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading || interror !== "" || form.email.endsWith("@zhr.pl")}>
            {loading ? "Rejestrowanie..." : "Zarejestruj"}
          </button>
        </form>
        <p className="mt-3 text-center">
          Masz już konto? <Link to="/login">Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
