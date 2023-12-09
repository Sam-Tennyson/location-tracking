import { useEffect } from "react";

const MarkerMovement = ({ routeData, moveDelay }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      moveMarkers();
    }, moveDelay);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const moveMarkers = () => {
    routeData?.forEach((coordinates, index) => {
      const [lng, lat] = coordinates;
      // console.log(lng, lat, index);

      // setViewport((prevViewport) => ({
      //   ...prevViewport,
      //   longitude: lng,
      //   latitude: lat,
      // transitionInterpolator: new FlyToInterpolator(),
      // transitionDuration: 1000,
      // }));

      // Uncomment the next line to set a delay between each marker animation
      setTimeout(() => {}, index * 1000);
    });
  };

  // console.log(routeData);

  return null; // This component doesn't render anything
};

export default MarkerMovement;
