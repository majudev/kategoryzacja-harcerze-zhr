import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import translate from "../translator";

const API_ROOT = process.env.REACT_APP_API_URL;

const WelcomeStep2 = ({setStep, districts, district, setDistrict} : {setStep: React.Dispatch<React.SetStateAction<any>>; districts: Array<{id: number; name: string;}>; district: string; setDistrict: React.Dispatch<React.SetStateAction<string>>}) => {
  const [loading, setLoading] = useState(false);

  const [teams, setTeams] = useState<Array<{id: number; name: string; shadow: boolean;}>>([]);
  const [error, setError] = useState("");

  //const [district, setDistrict] = useState("none");
  const [team, setTeam] = useState("none");
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    if(!isNaN(parseInt(district))) loadTeams();
  }, [district]);

  const loadTeams = async () => {
    try {
      const res = await axios.get(`${API_ROOT}/teams/by-district-id/${district}`);

      setTeams(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not fetch teams list");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.get(`${API_ROOT}/teams/ask-access/${team}`);
      //navigate('/');
      setStep("userack");
    } catch (err: any) {
      setError(err.response?.data?.message || "Nie udało się poprosić o dostęp");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h3 className="text-center mb-3">Wybierz swoją drużynę</h3>
      {error && <div className="alert alert-danger">{translate(error)}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Spróbujemy znaleźć Twoją drużynę w systemie. Wybierz swoją Chorągiew z listy poniżej:</label>
          <select className="form-control" value={district} onChange={(e) => {setDistrict(e.target.value)}} required>
            <option value="none" disabled>Wybierz Chorągiew...</option>
            {
              districts.map((district) => {
                return <option value={district.id}>{district.name}</option>;
              })
            }
          </select>
        </div>

        {district !== "none" && <>
          <div className="mb-3">
            <label className="form-label">Wybierz swoją jednostkę z listy rozwijanej poniżej:</label>
            <select className="form-control" value={team} onChange={(e) => {setTeam(e.target.value); setTeamName(e.target.innerText)}} required>
              <option value="none" disabled>Wybierz jednostkę...</option>
              {
                teams.map((team) => {
                  return <option value={team.id} disabled={team.shadow}>{team.name}</option>;
                })
              }
            </select>
          </div>

          <div className="d-flex justify-content-between flex-column">
            {team !== "none" && <button type="submit" className="btn btn-primary m-1" disabled={loading}>Daj mi dostęp do {teamName}</button>}
            <button className="btn btn-primary mb-1" onClick={() => setStep("3")} disabled={loading}>Mojej jednostki nie ma na liście</button>
            <small><i>Jeżeli Twoja jednostka znajduje się na liście, ale nie można w nią kliknąć - skontaktuj się z koordynatorem kategoryzacji w Twojej Chorągwi. <b>Nie klikaj</b> w przycisk "Mojej jednostki nie ma na liście".</i></small>
          </div>
        </>}
      </form>
    </>
  );
};

export default WelcomeStep2;
