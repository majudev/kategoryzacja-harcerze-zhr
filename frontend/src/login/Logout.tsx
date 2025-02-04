import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import translate from "../translator";

const API_ROOT = process.env.REACT_APP_API_URL;

const Logout = ({reloadHook} : {reloadHook : React.Dispatch<React.SetStateAction<boolean>>}) => {
  const navigate = useNavigate();

  const [error, setError] = useState("");

  useEffect(() => {
    deactivateUser();
  }, []);

  const deactivateUser = async () => {
    try {
      await axios.get(`${API_ROOT}/auth/logout`);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || "Nie udało się wylogować");
    }
    reloadHook(true);
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center angled-bg">
      <div className="card shadow p-4" style={{ width: "350px", zIndex: 1, position: "relative" }}>
        {error && <div className="alert alert-danger">{translate(error)}</div>}

      </div>
    </div>
  );
};

export default Logout;
