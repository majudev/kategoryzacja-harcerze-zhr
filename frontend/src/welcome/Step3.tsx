import { useState, useEffect } from "react";
import axios from "axios";
import translate from "../translator";

const API_ROOT = process.env.REACT_APP_API_URL;

const WelcomeStep3 = ({setStep, userId, district, districts} : {setStep: React.Dispatch<React.SetStateAction<any>>; userId: number; district: string; districts: Array<{id: number; name: string;}>}) => {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  //const [district, setDistrict] = useState("none");
  const [teamName, setTeamName] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_ROOT}/teams/`, {name: teamName, districtId: parseInt(district)});
      
      const permissionJoints = response.data.owners.filter((entry: {id: number}) => {return entry.id === userId;});
      if(!(permissionJoints.length > 0 && permissionJoints[0].teamAccepted)){
        setStep("userack");
      }else{
        setStep("end");
      }
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data?.message || "Nie udało się utworzyć jednostki");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h3 className="text-center mb-3">Dodaj swoją drużynę</h3>
      {error && <div className="alert alert-danger">{translate(error)}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Wybierz swoją Chorągiew z listy poniżej:</label>
          <select className="form-control" value={district} /*onChange={(e) => {setDistrict(e.target.value)}}*/ required disabled>
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
            <label className="form-label">Wpisz nazwę swojej jednostki:</label>
            <input className="form-control" value={teamName} onChange={(e) => {setTeamName(e.target.value)}} placeholder='31 Krakowska Drużyna Harcerzy "Włócznia" im. JKM Władysława Warneńczyka' required />
          </div>

          <button type="submit" className="btn btn-primary m-1" disabled={loading}>Dodaj {teamName} do systemu</button>
        </>}
      </form>
    </>
  );
};

export default WelcomeStep3;
