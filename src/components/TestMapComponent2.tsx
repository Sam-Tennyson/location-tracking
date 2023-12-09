/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import ReactMapGL from "react-map-gl";
import {
  BARIELY,
  DELHI_CORDINATE,
  MAP_ACCESS_TOKEN,
  NANITAL,
} from "../shared/Constants";
import DrawPath from "./DrawPath";

const paths = {
  delhiToNoida: [
    { lat: 28.6139, lng: 77.209 }, // Delhi
    { lat: 28.5355, lng: 77.391 }, // Noida
  ],
  punjabToJaipur: [
    { lat: 31.1471, lng: 75.3412 }, // Punjab
    { lat: 26.9124, lng: 75.7873 }, // Jaipur
  ],
  nanitalToBariely: [
    { lat: NANITAL.lat, lng: NANITAL.lng }, // Delhi
    { lat: BARIELY.lat, lng: BARIELY.lng }, // Noida
  ],
};

const TestMapComponent2 = () => {
  const [viewport, setViewport] = useState({
    latitude: DELHI_CORDINATE.lat,
    longitude: DELHI_CORDINATE.lng,
    zoom: 6,
  });

  return (
    <>
      <ReactMapGL
        {...viewport}
        onMove={(evt) => setViewport(evt.viewState)}
        mapboxAccessToken={MAP_ACCESS_TOKEN}
        mapStyle={"mapbox://styles/mapbox/streets-v11"}
        style={{ width: "100%", height: "70vh", margin: "auto" }}
      >
        <DrawPath id={"DTN"} path={paths.delhiToNoida} color="#FFFF00" />

        <DrawPath id={"PTJ"} path={paths.punjabToJaipur} color="#FFFF00" />

        <DrawPath id={"NTB"} path={paths.nanitalToBariely} color="#FFFF00" />
      </ReactMapGL>
    </>
  );
};

export default TestMapComponent2;
