
import React, { useState, useEffect } from "react"
import ForceItem from "./components/ForceItem";
import './index.css';


function App() {
  const [forces, setForces] = useState([])

  const fetchForceData = () => {
    fetch('https://data.police.uk/api/forces')
      .then(response => {
        return response.json()
      })
      .then(data => {
        setForces(data)
      })
  }

  useEffect(() => {
    fetchForceData()
  }, [])

  return (
    <div className="container">
      <h1>List of Police Forces in the UK</h1>
      <p>You can browse Stop & Search data by force by selecting the force below.</p>
      <p>There are <b>{forces.length}</b> forces in total across the UK.</p>
      <div>
        {forces.length > 0 && (
          <ul>
            {forces.map(force => (
              <ForceItem id={force.id} name={force.name}></ForceItem>
            ))}
          </ul>
        )}
      </div>
    </div>
  );



}

export default App;
