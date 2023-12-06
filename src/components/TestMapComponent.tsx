/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
// import MapGL, { Source, Layer } from "react-map-gl";
import ReactMapGl, {
  FullscreenControl,
  GeolocateControl,
  Layer,
  Marker,
  NavigationControl,
  // LineLayer,
  // Marker,
  // NavigationControl,
  Source,
} from "react-map-gl";
import { DELHI_CORDINATE, MAP_ACCESS_TOKEN } from "../shared/Constants";

const TestMapComponent = () => {
  const [movingMarker, setMovingMarker] = useState<any>([
    DELHI_CORDINATE.lng,
    DELHI_CORDINATE.lat,
  ]);
  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    latitude: 0,
    longitude: 0,
    zoom: 14,
  });

  const [traceData, setTraceData] = useState({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [],
        },
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://docs.mapbox.com/mapbox-gl-js/assets/hike.geojson"
      );
      const data = await response.json();
      console.log(data);

      const coordinates = data.features[0].geometry.coordinates;
      setTraceData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [coordinates?.[0]],
            },
          },
        ],
      });

      setViewport({
        ...viewport,
        latitude: coordinates[0][1],
        longitude: coordinates[0][0],
        zoom: 14,
        // pitch: 30,
      });

      let i = 0;
      const timer = setInterval(() => {
        if (i < coordinates.length) {
          setTraceData((prevData) => {
            const newCoordinates = [
              ...prevData.features[0].geometry.coordinates,
            ];
            console.log(coordinates[i]);
            setMovingMarker(coordinates[i]);
            newCoordinates.push(coordinates[i]);
            return {
              ...prevData,
              features: [
                {
                  ...prevData.features[0],
                  geometry: {
                    ...prevData.features[0].geometry,
                    coordinates: newCoordinates,
                  },
                },
              ],
            };
          });
          setViewport({
            ...viewport,
            latitude: coordinates[i][1],
            longitude: coordinates[i][0],
          });
          i++;
        } else {
          window.clearInterval(timer);
        }
      }, 10);
    };

    fetchData();
  }, []); // empty dependency array ensures this effect runs once on mount

  return (
    <ReactMapGl
      {...viewport}
      onMove={(evt) => setViewport(evt.viewState)}
      mapboxAccessToken={MAP_ACCESS_TOKEN}
      mapStyle={"mapbox://styles/mapbox/streets-v11"}
      style={{ width: "100%", height: "80vh", margin: "auto" }}
    >
      <Source type="geojson" data={traceData}>
        <Layer
          id="trace"
          type="line"
          paint={{
            "line-color": "yellow",
            "line-opacity": 0.75,
            "line-width": 5,
          }}
        />
      </Source>
      <GeolocateControl
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
      />
      <FullscreenControl />
      <NavigationControl />
      <Marker longitude={movingMarker?.[0]} latitude={movingMarker?.[1]}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/744/744465.png"
          alt="Marker"
          style={{ width: "40px", height: "40px" }}
        />
      </Marker>
    </ReactMapGl>
  );
};

export default TestMapComponent;
