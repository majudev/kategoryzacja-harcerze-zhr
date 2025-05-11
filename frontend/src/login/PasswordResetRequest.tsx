import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import translate from "../translator";
import GoogleButton from "react-google-button";
import React from "react";

const API_ROOT = process.env.REACT_APP_API_URL;

const PasswordResetRequest = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", captcha: "" });
  const [captchaSvg, setCaptchaSvg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${API_ROOT}/auth/passwordreset/request`, form);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Nie udało się poprosić o kod resetu hasła");
      loadCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center angled-bg">
      <div className="card shadow p-4" style={{ width: "350px", zIndex: 1, position: "relative" }}>
        {success ? 
          <div className="alert alert-success">Udało się! Kliknij w link z maila aby zresetować swoje hasło.</div>
        : <>
          <h3 className="text-center mb-3">Zresetuj hasło</h3>
          {error && <div className="alert alert-danger">{translate(error)}</div>}
          
          {form.email.endsWith("@zhr.pl") && <div className="alert alert-danger">Dla maili @zhr.pl - przejdź na stronę logowania i użyj specjalnego przycisku ;)</div>}
          
          <hr className="my-3"/>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="text" name="email" className="form-control" value={form.email} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Kod z obrazka</label>
              <div dangerouslySetInnerHTML={{ __html: captchaSvg }} className="mb-2 border p-2 bg-white text-center" />
              <input type="text" name="captcha" className="form-control" value={form.captcha} onChange={handleChange} required />
              <button type="button" className="btn btn-link p-0 mt-1" onClick={loadCaptcha}>Wylosuj inny kod</button>
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading || form.email.endsWith("@zhr.pl")}>
              {loading ? "Wysyłanie..." : "Zresetuj hasło"}
            </button>
          </form>
          <p className="mt-3 text-center">
            Masz konto? <Link to="/login">Zaloguj się</Link>
          </p>
          <p className="mt-1 text-center">
            Nie masz konta? <Link to="/register">Zarejestruj się</Link>
          </p>
        </>}
      </div>
    </div>
  );
};

export default PasswordResetRequest;
