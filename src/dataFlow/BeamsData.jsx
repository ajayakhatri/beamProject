import React, { useState, useEffect } from "react";
import axios from "./axios.jsx";

const BeamsData = () => {
  let [beams, setBeams] = useState([]);
  useEffect(() => {
    getBeam();
  }, []);


  const getBeam = async () => {
    try {
      const res = await axios.get("/get-beams");
      const jsonData = res.data
      // console.log(jsonData.length);
      setBeams(jsonData);
    } catch (error) {
      console.log(error.message);
    }
  };


  const beamDict = () => {
    return beams.map((beam) => {
      return (
        <div key={beam.id} className="mb-1">
          <header>beam no: {beam.id}</header>
          <li>elasticity: {beam.elasticity}</li>
          <li>inertia: {beam.inertia}</li>
          <li>length: {beam.length}</li>
          <li>nodes: {beam.nodes}</li>
        </div>
      );
    });
  };
  return (
    <div>{beamDict()}</div>

  );
};

export default BeamsData;
