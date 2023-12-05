/* eslint-disable @typescript-eslint/no-explicit-any */
import { MAP_ACCESS_TOKEN } from "../shared/Constants";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { calculateBearing, getRandomNumber } from "../shared/Utils";
// import MapboxDirections from "@mapbox/mapbox-gl-directions";
// import geoJson from "../JSONData/city.json";

mapboxgl.accessToken = MAP_ACCESS_TOKEN;
const DELHI_CORDINATE = {
  lat: 28.7041,
  lng: 77.1025,
};

const AGRA_CORDINATE = {
  lat: 27.1767,
  lng: 78.0081,
};

const RANDOM_SPEED = {
  min: 100,
  max: 150,
};

const MapComponent = () => {
  const mapContainerRef = useRef<any>(null);

  const [lng, setLng] = useState<any>(DELHI_CORDINATE.lng);
  const [lat, setLat] = useState<any>(DELHI_CORDINATE.lat);
  const [zoom, setZoom] = useState<any>(14);

  const [currentSpeed, setCurrentSpeed] = useState<number>(50);
  const [speedController, setSpeedController] = useState<number>(0);
  const [thresholdSpeed] = useState<number>(120);

  const sourceCoordinates: any = [DELHI_CORDINATE.lng, DELHI_CORDINATE.lat];
  const destinationCoordinates: any = [AGRA_CORDINATE.lng, AGRA_CORDINATE.lat];

  const showMessage = () => {
    if (currentSpeed > thresholdSpeed) {
      return <div className=" text-red-950 text-lg font-bold">Warning ...</div>;
    }
    return (
      <div className="text-green-950 text-lg font-bold">
        Weldone. You are nice driver...
      </div>
    );
  };

  const moveMarker = (sourceMarker: mapboxgl.Marker) => {
    // let currentSpeed = 10; // in meters per second
    let currentLng = DELHI_CORDINATE.lng;
    let currentLat = DELHI_CORDINATE.lat;
    const bearing = calculateBearing(
      [DELHI_CORDINATE.lng, DELHI_CORDINATE.lat],
      [AGRA_CORDINATE.lng, AGRA_CORDINATE.lat]
    ); // Example bearing in degrees

    console.log(bearing, "bearning");

    setInterval(() => {
      // Update marker position based on speed

      const newLng =
        currentLng +
        (currentSpeed / 111320) * Math.cos((bearing * Math.PI) / 180);
      const newLat =
        currentLat +
        (currentSpeed / 111320) * Math.sin((bearing * Math.PI) / 180);

      // Update source marker on the map
      sourceMarker.setLngLat([newLng, newLat]);

      // Update current coordinates for the next iteration
      currentLng = newLng;
      currentLat = newLat;
      // currentSpeed += 10;
      const randomNumber = getRandomNumber(RANDOM_SPEED.min, RANDOM_SPEED.max);
      setSpeedController(randomNumber);
      // console.log("currentSpeed", randomNumber);
    }, 3000); // Update every second (adjust as needed)
  };

  useEffect(() => {
    setCurrentSpeed(speedController);
  }, [speedController]);

  useEffect(() => {
    // const directions = new MapboxDirections({
    //   accessToken: "YOUR-MAPBOX-ACCESS-TOKEN",
    //   unit: "metric",
    //   profile: "mapbox/cycling",
    // });

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    // Add source marker
    const sourceMarker = new mapboxgl.Marker()
      .setLngLat(sourceCoordinates)
      .addTo(map);

    // Add destination marker
    new mapboxgl.Marker().setLngLat(destinationCoordinates).addTo(map);

    moveMarker(sourceMarker);
    // geoJson.features.map((feature: any) =>
    //   new mapboxgl.Marker().setLngLat(feature.geometry.coordinates).addTo(map)
    // );

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    // map.addControl(directions, "top-left");

    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-[90vw] min-h-screen m-auto">
      <div className="sidebarStyle">
        <div className="text-center text-2xl py-4">
          Zoom: {zoom} | Speed: {currentSpeed} | Threshold Speed:{" "}
          {thresholdSpeed}
        </div>
        <div className="text-center">{showMessage()}</div>
      </div>
      <div
        className="map-container"
        ref={mapContainerRef}
        style={{ width: "100vh", height: "80vh", margin: "auto" }}
      />
    </div>
  );
};

export default MapComponent;
