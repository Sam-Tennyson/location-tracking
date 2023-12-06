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
import {
  DELHI_CORDINATE,
  JAIPUR_CORDINATE,
  MAP_ACCESS_TOKEN,
} from "../shared/Constants";
import { calculateDistance } from "../shared/Utils";
import Timer from "./Timer";

const TestMapComponent = () => {
  const [time] = useState<number>(2000); // 10 sec
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);
  const [thresholdSpeed] = useState<number>(60);
  const [start, setStart] = useState<any>([
    DELHI_CORDINATE.lng,
    DELHI_CORDINATE.lat,
  ]);
  const [end] = useState<any>([JAIPUR_CORDINATE.lng, JAIPUR_CORDINATE.lat]);
  const [movingMarker, setMovingMarker] = useState<any>([
    DELHI_CORDINATE.lng,
    DELHI_CORDINATE.lat,
  ]);
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 8,
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

  const showMessage = () => {
    if (currentSpeed > thresholdSpeed) {
      return <div className=" text-red-600 text-lg font-bold">Warning ...</div>;
    }
    return (
      <div className="text-green-600 text-lg font-bold">
        Weldone. You are nice driver...
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      // const response = await fetch(
      //   "https://docs.mapbox.com/mapbox-gl-js/assets/hike.geojson"
      // );
      // const data = await response.json();
      // const coordinates = data.features[0].geometry.coordinates;

      const profile = `mapbox/driving`;
      const path_coordinates = `${start[0]},${start[1]};${end[0]},${end[1]}`;
      const URL = `https://api.mapbox.com/directions/v5/${profile}/${path_coordinates}?steps=true&geometries=geojson&access_token=${MAP_ACCESS_TOKEN}`;
      const response = await fetch(URL);
      const data = await response.json();
      const coordinates = data?.routes[0]?.geometry.coordinates;

      setTraceData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [...coordinates],
            },
          },
        ],
      });

      setViewport({
        ...viewport,
        latitude: coordinates?.[0]?.[1],
        longitude: coordinates?.[0]?.[0],
      });

      let i = 0;
      const timer = setInterval(() => {
        if (i < coordinates.length) {
          if (i > 0) {
            const point1 = {
              lat: coordinates?.[i - 1]?.[1],
              lng: coordinates?.[i - 1]?.[0],
            };
            const point2 = {
              lat: coordinates?.[i]?.[1],
              lng: coordinates?.[i]?.[0],
            };
            const distance = calculateDistance(point1, point2);
            const timeInHr = time / 3600;
            const speed = distance / timeInHr;
            console.log(distance, speed);
            setCurrentSpeed(speed);
          }
          const newCoordinates = [
            ...(traceData?.features?.[0]?.geometry?.coordinates ?? []),
          ];
          newCoordinates.push(coordinates?.[i]);
          setMovingMarker(coordinates?.[i]);

          setViewport({
            ...viewport,
            latitude: coordinates?.[i]?.[1],
            longitude: coordinates?.[i]?.[0],
          });
          i++;
        } else {
          setCurrentSpeed(0);
          window.clearInterval(timer);
        }
      }, time);
    };

    fetchData();
  }, []); // empty dependency array ensures this effect runs once on mount

  return (
    <>
      <div className="text-center text-2xl py-4">
        Speed: {currentSpeed} km/hr | Threshold Speed: {thresholdSpeed}
        <div>{showMessage()}</div>
        {/* <div>
          <Timer timeout={10} initialSeconds={0} />
        </div> */}
      </div>

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
        <Marker longitude={start?.[0]} latitude={start?.[1]} />
        <Marker longitude={end?.[0]} latitude={end?.[1]} />
      </ReactMapGl>
    </>
  );
};

export default TestMapComponent;
