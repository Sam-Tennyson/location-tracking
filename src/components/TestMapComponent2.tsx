/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import ReactMapGL from "react-map-gl";
import {
  AGRA_CORDINATE,
  BARIELY,
  DELHI_CORDINATE,
  ETAWAH,
  GWALIOW,
  JAIPUR_CORDINATE,
  LUCKNOW,
  MAP_ACCESS_TOKEN,
  NANITAL,
} from "../shared/Constants";
import DrawPath from "./DrawPath";
import RangeInputComponent from "./RangeInputComponent";
import { showMarkerSpeedWithConstants } from "../shared/Utils";

const TestMapComponent2 = () => {
  const [thresholdSpeed, setThresholdSpeed] = useState<number | string>(150);
  const [selectedPath, setSelectedPath] = useState<any>({
    index: -1,
    pathId: null,
  });

  const [routesData, setRoutesData] = useState<any>([
    {
      pathId: 1,
      coordinatesStateEnd: [
        { lat: DELHI_CORDINATE.lat, lng: DELHI_CORDINATE.lng }, // Delhi
        { lat: JAIPUR_CORDINATE.lat, lng: JAIPUR_CORDINATE.lng }, // Noida
      ],
      defaultTime: 3000,
      vehicleStatus: showMarkerSpeedWithConstants(3000),
    },
    {
      pathId: 2,
      coordinatesStateEnd: [
        { lat: LUCKNOW.lat, lng: LUCKNOW.lng }, // Punjab
        { lat: GWALIOW.lat, lng: GWALIOW.lng }, // Jaipur
      ],
      defaultTime: 3000,
      vehicleStatus: showMarkerSpeedWithConstants(3000),
    },
    {
      pathId: 3,
      coordinatesStateEnd: [
        { lat: NANITAL.lat, lng: NANITAL.lng }, // Nanital
        { lat: BARIELY.lat, lng: BARIELY.lng }, // Bariely
      ],
      defaultTime: 3000,
      vehicleStatus: showMarkerSpeedWithConstants(3000),
    },
    {
      pathId: 4,
      coordinatesStateEnd: [
        { lat: ETAWAH.lat, lng: ETAWAH.lng }, // Nanital
        { lat: AGRA_CORDINATE.lat, lng: AGRA_CORDINATE.lng }, // Bariely
      ],
      defaultTime: 3000,
      vehicleStatus: showMarkerSpeedWithConstants(3000),
    },
  ]);

  const [viewport, setViewport] = useState({
    latitude: DELHI_CORDINATE.lat,
    longitude: DELHI_CORDINATE.lng,
    zoom: 6,
  });

  const handlePathSelection = (selectedData) => {
    const isLargeNumber = (path) => path?.pathId === selectedData?.pathId;
    const index = routesData?.findIndex(isLargeNumber);
    setSelectedPath({ index, pathId: routesData?.[index]?.pathId });
  };

  const handleSpeedSliderChange = (e) => {
    const { value } = e.target;
    const t1 = showMarkerSpeedWithConstants(value);
    const findRoutes = routesData?.find(
      (route) => route?.pathId === selectedPath?.pathId
    );
    findRoutes.defaultTime = t1;
    findRoutes.vehicleStatus = showMarkerSpeedWithConstants(
      findRoutes.defaultTime
    );
    setRoutesData((prev) => {
      prev.splice(selectedPath?.index, 1, findRoutes);
      return [...prev];
    });
  };

  const handleSliderChange = (e) => {
    const { value } = e.target;
    if (!isNaN(Number(value))) setThresholdSpeed(value);
  };

  console.log(routesData);

  return (
    <>
      {selectedPath?.index !== -1 && (
        <div>
          <label className="font-bold">Speed (in km/sec):</label>{" "}
          {Number(
            showMarkerSpeedWithConstants(
              routesData?.[selectedPath?.index]?.defaultTime
            )
          )?.toFixed(7)}
          <RangeInputComponent
            sliderValue={showMarkerSpeedWithConstants(
              routesData?.[selectedPath?.index]?.defaultTime
            )}
            handleSliderChange={handleSpeedSliderChange}
            min={20}
            max={500}
          />
        </div>
      )}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <label className="font-bold">Threshold Speed (in km/sec):</label>{" "}
        <RangeInputComponent
          sliderValue={thresholdSpeed}
          handleSliderChange={handleSliderChange}
          max={500}
        />
        {thresholdSpeed}
      </div>
      <div className="flex justify-start items-center flex-wrap gap-2">
        <label className="font-bold">Select Path:</label>
        <select
          className="px-3 py-2"
          onChange={(e) => {
            console.log(routesData[parseInt(e.target.value)]);

            handlePathSelection(routesData[parseInt(e.target.value)]);
          }}
        >
          <option value={-1}>None</option>
          {routesData.map((pathData, index) => (
            <option key={`${index}_path`} value={index} className="px-3 py-1">
              Path {pathData?.pathId}
            </option>
          ))}
        </select>
      </div>
      <ReactMapGL
        {...viewport}
        onMove={(evt) => setViewport(evt.viewState)}
        mapboxAccessToken={MAP_ACCESS_TOKEN}
        mapStyle={"mapbox://styles/mapbox/streets-v11"}
        style={{ width: "100%", height: "70vh", margin: "auto" }}
      >
        {routesData?.map((route, index) => {
          // console.log(route);
          return (
            <DrawPath
              id={`${index}_route`}
              key={`${index}_route`}
              path={route?.coordinatesStateEnd}
              routeData={route}
              color="#FFFF00"
              thresholdSpeed={thresholdSpeed}
            />
          );
        })}
      </ReactMapGL>
    </>
  );
};

export default TestMapComponent2;
