import { useEffect, useState } from "react";
import { initDB } from "./db";
import PatientForm from "./components/PatientForm";
import PatientList from "./components/PatientList";
import SqlQuery from "./components/SqlQuery";
import "./App.css";

export default function App() {
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    initDB().catch(console.error);
    
    // Listen for database updates from other tabs
    const handleDatabaseUpdate = () => {
      setRefresh((prev) => prev + 1);
    };
    
    window.addEventListener("databaseUpdate", handleDatabaseUpdate);
    
    return () => {
      window.removeEventListener("databaseUpdate", handleDatabaseUpdate);
    };
  }, []);

  const handlePatientAdded = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <div className="app">
      <header>
        {/* <img src="Desktop/MedBase/medbase-app/public/MedBase.png" alt=""></img> */}
        <h1>MedBase</h1>
      </header>
      <main>
        <div className="left-panel">
          <PatientForm onPatientAdded={handlePatientAdded} />
        </div>
        <div className="right-panel">
          <PatientList refresh={refresh} />
          <SqlQuery onQueryExecuted={() => setRefresh((prev) => prev + 1)} />
        </div>
      </main>
    </div>
  );
}