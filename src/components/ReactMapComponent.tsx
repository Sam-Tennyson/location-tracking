/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ReactMapGl, {
  CircleLayer,
  FullscreenControl,
  GeolocateControl,
  Layer,
  LineLayer,
  Marker,
  NavigationControl,
  Source,
} from "react-map-gl";
import {
  JAIPUR_CORDINATE,
  DELHI_CORDINATE,
  MAP_ACCESS_TOKEN,
} from "../shared/Constants";
import { calculateBearing, getRandomNumber } from "../shared/Utils";

const RANDOM_SPEED = {
  min: 100,
  max: 150,
};

const ReactMapComponent = () => {
  const [start, setStart] = useState<any>([
    DELHI_CORDINATE.lng,
    DELHI_CORDINATE.lat,
  ]);
  const [end] = useState<any>([JAIPUR_CORDINATE.lng, JAIPUR_CORDINATE.lat]);
  const [coords, setCoords] = useState<any>([]);

  const [currentSpeed, setCurrentSpeed] = useState<number>(50);
  const [speedController, setSpeedController] = useState<number>(0);
  const [thresholdSpeed] = useState<number>(120);

  const [viewState, setViewState] = useState({
    longitude: DELHI_CORDINATE.lng,
    latitude: DELHI_CORDINATE.lat,
    zoom: 7,
  });

  const getRoutes = async () => {
    const profile = `mapbox/driving`;
    const coordinates = `${start[0]},${start[1]};${end[0]},${end[1]}`;
    const URL = `https://api.mapbox.com/directions/v5/${profile}/${coordinates}?steps=true&geometries=geojson&access_token=${MAP_ACCESS_TOKEN}`;
    const response = await fetch(URL);
    const data = await response.json();
    const dataCoords = data?.routes[0]?.geometry.coordinates;
    setCoords(dataCoords);
  };

  const geojson: any = {
    type: "FeatureCollection",
    features: [
      {
        type: "feature",
        geometry: {
          type: "LineString",
          coordinates: [...coords],
        },
      },
    ],
  };

  const endPoint: any = {
    type: "FeatureCollection",
    features: [
      {
        type: "feature",
        geometry: {
          type: "Point",
          coordinates: [...end],
        },
      },
    ],
  };

  const lineStyle: LineLayer = {
    id: "route-source",
    type: "line",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "blue",
      "line-width": 4,
      "line-opacity": 0.75,
    },
  };

  const layerEndpoint: CircleLayer = {
    id: "router-destination",
    type: "circle",
    paint: {
      "circle-radius": 10,
      "circle-color": "#f30",
    },
  };

  useEffect(() => {
    let currentLng = DELHI_CORDINATE.lng;
    let currentLat = DELHI_CORDINATE.lat;
    const bearing = calculateBearing(start, end);

    const intervalId = setInterval(() => {
      const newLng =
        currentLng +
        (currentSpeed / 111320) * Math.cos((bearing * Math.PI) / 180);
      const newLat =
        currentLat +
        (currentSpeed / 111320) * Math.sin((bearing * Math.PI) / 180);

      setStart([newLng, newLat]);

      currentLng = newLng;
      currentLat = newLat;
      const randomNumber = getRandomNumber(RANDOM_SPEED.min, RANDOM_SPEED.max);
      setSpeedController(randomNumber);
      // Code to run at regular intervals
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

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

  // const handleClick = (e: { lngLat: { lng: number; lat: number } }) => {
  //   const { lngLat } = e;
  //   const { lng, lat } = lngLat;
  //   setEnd([lng, lat]);
  // };

  useEffect(() => {
    setCurrentSpeed(speedController);
  }, [speedController]);

  useEffect(() => {
    getRoutes();
  }, [end, start]);

  return (
    <>
      <div className="w-[90vw] min-h-screen m-auto">
        <div className="text-center text-2xl py-4">
          Zoom: {viewState.zoom} | Speed: {currentSpeed} | Threshold Speed:{" "}
          {thresholdSpeed}
          <div>{showMessage()}</div>
        </div>
        <ReactMapGl
          {...viewState}
          // onClick={handleClick}
          onMove={(evt) => setViewState(evt.viewState)}
          mapboxAccessToken={MAP_ACCESS_TOKEN}
          mapStyle={"mapbox://styles/mapbox/streets-v11"}
          style={{ width: "100%", height: "80vh", margin: "auto" }}
        >
          <Source id="route-source" type="geojson" data={geojson}>
            <Layer {...lineStyle} />
          </Source>
          <Source id="route-destination" type="geojson" data={endPoint}>
            <Layer {...layerEndpoint} />
          </Source>
          <GeolocateControl />
          <FullscreenControl />
          <NavigationControl />
          <Marker longitude={start[0]} latitude={start[1]}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/744/744465.png"
              alt="Marker"
              style={{ width: "40px", height: "40px" }}
            />
          </Marker>
        </ReactMapGl>
      </div>
    </>
  );
};

export default ReactMapComponent;
