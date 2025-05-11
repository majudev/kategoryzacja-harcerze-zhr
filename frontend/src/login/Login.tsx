import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import translate from "../translator";
import GoogleButton from "react-google-button";
import React from "react";

const API_ROOT = process.env.REACT_APP_API_URL;

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Login = ({reloadHook} : {reloadHook : React.Dispatch<React.SetStateAction<boolean>>}) => {
  const navigate = useNavigate();

  const query = useQuery();

  const [form, setForm] = useState({ email: "", password: "", captcha: "" });
  const [captchaSvg, setCaptchaSvg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    reloadHook(true); // Reload hook - if we got redirected here, probably there was a reason
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
      await axios.post(`${API_ROOT}/auth/login`, form);
      navigate('/welcome');
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      loadCaptcha();
    } finally {
      setLoading(false);
      reloadHook(true);
    }
  };

  function translateError(code: string, text: string): string {
    if(code === "401"){
      if(text === "invalid OAuth2 code provided") return "Otrzymano błędny kod OAuth2";
      if(text === "authentication failed") return "Logowanie nieudane. Czy na pewno wybrałeś swoje konto @zhr.pl? Konta osobiste nie pozwalają się zalogować w ten sposób. Jeśli nie miałeś możliwości wyboru konta, otwórz w nowej karcie GMaila, zaloguj się na konto @zhr.pl i spróbuj zalogować się ponownie. Powinien pojawić się ekran wyboru konta.";
    }else if(code === "500"){
      if(text === "google provided unsupported reply") return "Google zwróciło dziwną odpowiedź, nie wiem co dalej zrobić. Skontaktuj się z administracją.";
    }
    return "Wystąpił błąd. Kod odpowiedzi: " + code + ". Wiadomość: " + text;
  }

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center angled-bg">
      <div className="card shadow p-4" style={{ width: "350px", zIndex: 1, position: "relative" }}>
        <h3 className="text-center mb-3">Zaloguj się</h3>
        {error && <div className="alert alert-danger">{translate(error)}</div>}
        {
          (query.get("status") === "error" ) ? <div className="alert alert-danger">{translateError(query.get("code") as string, query.get("message") as string)}</div> : <></>
        }
        {form.email.endsWith("@zhr.pl") && <div className="alert alert-danger">Dla maili @zhr.pl użyj przycisku poniżej ;)</div>}
        <div className="mt-3 d-flex justify-content-center">
            <GoogleButton label='Logowanie przez ZHR.pl' onClick={() => { window.location.href = process.env.REACT_APP_API_URL + '/auth/google'; }} />
        </div>
        <hr className="my-3"/>
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
            <label className="form-label">Kod z obrazka</label>
            <div dangerouslySetInnerHTML={{ __html: captchaSvg }} className="mb-2 border p-2 bg-white text-center" />
            <input type="text" name="captcha" className="form-control" value={form.captcha} onChange={handleChange} required />
            <button type="button" className="btn btn-link p-0 mt-1" onClick={loadCaptcha}>Wylosuj inny kod</button>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading || form.email.endsWith("@zhr.pl")}>
            {loading ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>
        <p className="mt-3 text-center">
          Nie masz konta? <Link to="/register">Zarejestruj się</Link>
        </p>
        <p className="mt-1 text-center">
          Zapomniałeś hasła? <Link to="/passwordreset">Zresetuj hasło</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
