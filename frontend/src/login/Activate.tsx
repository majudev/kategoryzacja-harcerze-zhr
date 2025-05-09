import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import translate from "../translator";

const API_ROOT = process.env.REACT_APP_API_URL;

const ActivateUser = () => {
  const { activationkey } = useParams();
  const navigate = useNavigate();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    activateUser();
  }, []);

  const activateUser = async () => {
    try {
      await axios.post(`${API_ROOT}/auth/activate/${activationkey}`);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Nie udało się aktywować konta");
    }
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center angled-bg">
      <div className="card shadow p-4" style={{ width: "350px", zIndex: 1, position: "relative" }}>
        {success && <div className="alert alert-success">Udało się! Teraz możesz się zalogować.</div>}
        {error && <div className="alert alert-danger">{translate(error)}</div>}
      </div>
    </div>
  );
};

export default ActivateUser;
