/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import ReactMapGL, { FullscreenControl, NavigationControl } from "react-map-gl";
import {
  BARIELY,
  DELHI_CORDINATE,
  GWALIOW,
  INDORE,
  JAIPUR_CORDINATE,
  LUCKNOW,
  MAP_ACCESS_TOKEN,
  MP,
  NANITAL,
  PRAYAGRAJ,
  PUNJAB,
  RAJASTAN,
  SURAT,
} from "../shared/Constants";
import DrawPath from "./DrawPath";
import RangeInputComponent from "./RangeInputComponent";
import { showMarkerSpeedWithConstants } from "../shared/Utils";
import orangePin from "../assets/orangepin.png";
import greenPin from "../assets/greenpin.png";
import redPin from "../assets/redpin.png";

const GREEN_SPEED = 200;
const ORANGE_SPEED = 200;
const RED_SPEED = 250;

const vehile_list = [
  {
    id: 1,
    speed: RED_SPEED,
    color: "red",
    imgURL: redPin,
    message: "Warning 😶",
  },
  {
    id: 2,
    speed: ORANGE_SPEED,
    color: "orange",
    imgURL: orangePin,
    message: "Approaching limit! 😐 ",
  },
  {
    id: 3,
    speed: GREEN_SPEED,
    color: "green",
    imgURL: greenPin,
    message: "Safe driving 😃 ",
  },
];

const TestMapComponent2 = () => {
  const [thresholdSpeed, setThresholdSpeed] = useState<number | string>(60);
  const [selectedPath, setSelectedPath] = useState<any>({
    index: -1,
    pathId: null,
  });

  const [routesData, setRoutesData] = useState<any>([
    {
      pathId: 1,
      defaultTime: 3000,
      vehicleSpeed: showMarkerSpeedWithConstants(3000),
      isSelected: false,
      coordinatesStateEnd: [
        { lat: DELHI_CORDINATE.lat, lng: DELHI_CORDINATE.lng }, // Delhi
        { lat: JAIPUR_CORDINATE.lat, lng: JAIPUR_CORDINATE.lng }, // Noida
      ],
    },
    {
      pathId: 2,
      defaultTime: 3000,
      vehicleSpeed: showMarkerSpeedWithConstants(3000),
      isSelected: false,
      coordinatesStateEnd: [
        { lat: LUCKNOW.lat, lng: LUCKNOW.lng }, // Punjab
        { lat: GWALIOW.lat, lng: GWALIOW.lng }, // Jaipur
      ],
    },
    {
      pathId: 3,
      defaultTime: 3000,
      vehicleSpeed: showMarkerSpeedWithConstants(3000),
      isSelected: false,
      coordinatesStateEnd: [
        { lat: NANITAL.lat, lng: NANITAL.lng }, // Nanital
        { lat: BARIELY.lat, lng: BARIELY.lng }, // Bariely
      ],
    },
    {
      pathId: 4,
      defaultTime: 3000,
      vehicleSpeed: showMarkerSpeedWithConstants(3000),
      isSelected: false,
      coordinatesStateEnd: [
        { lat: PUNJAB.lat, lng: PUNJAB.lng }, // Nanital
        { lat: RAJASTAN.lat, lng: RAJASTAN.lng }, // Bariely
      ],
    },
    {
      pathId: 5,
      defaultTime: 3000,
      vehicleSpeed: showMarkerSpeedWithConstants(3000),
      isSelected: false,
      coordinatesStateEnd: [
        { lat: SURAT.lat, lng: SURAT.lng }, // Nanital
        { lat: INDORE.lat, lng: INDORE.lng }, // Bariely
      ],
    },
    {
      pathId: 6,
      defaultTime: 3000,
      vehicleSpeed: showMarkerSpeedWithConstants(3000),
      isSelected: false,
      coordinatesStateEnd: [
        { lat: PRAYAGRAJ.lat, lng: PRAYAGRAJ.lng }, // Nanital
        { lat: MP.lat, lng: MP.lng }, // Bariely
      ],
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
    findRoutes.vehicleSpeed = showMarkerSpeedWithConstants(
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

  return (
    <>
      <div className="w-[90vw] min-h-screen m-auto">
        <div className="flex md:flex-row flex-col md:justify-between md:items-start  items-center gap-2 my-2">
          <ul className="flex items-center justify-between gap-12">
            {vehile_list.map((vehicle) => (
              <li
                key={vehicle.id}
                className="flex flex-col justify-center items-center gap-2 flex-wrap"
              >
                <img
                  alt="Marker"
                  src={vehicle?.imgURL}
                  style={{ width: "30px", height: "30px" }}
                />
                <p className=" text-sm  text-center">{vehicle.message}</p>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2">
            <div className="gap-2">
              <label className="font-bold">Threshold Speed (in km/hr):</label>{" "}
              {thresholdSpeed}
              <RangeInputComponent
                sliderValue={thresholdSpeed}
                handleSliderChange={handleSliderChange}
                max={500}
              />
            </div>
          </div>
        </div>
        <div className="border-[1px] border-gray-500" />
        <div className="flex justify-between items-center gap-2 my-2">
          <div className="flex justify-start items-center flex-wrap gap-2">
            <label className="font-bold">Select Path:</label>
            <select
              className="px-3 py-2"
              onChange={(e) =>
                handlePathSelection(routesData[parseInt(e.target.value)])
              }
            >
              <option value={-1}>None</option>
              {routesData.map((pathData, index) => (
                <option
                  key={`${index}_path`}
                  value={index}
                  className="px-3 py-1"
                >
                  Vehicle {pathData?.pathId}
                </option>
              ))}
            </select>
          </div>
          {selectedPath?.index !== -1 && (
            <div className="gap-2">
              <label className="font-bold">Speed (in km/hr):</label>{" "}
              {Number(
                showMarkerSpeedWithConstants(
                  routesData?.[selectedPath?.index]?.defaultTime
                )
              )?.toFixed()}
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
          <FullscreenControl />
          <NavigationControl />
        </ReactMapGL>
      </div>
    </>
  );
};

export default TestMapComponent2;
