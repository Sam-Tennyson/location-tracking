const RangeInputComponent = (props) => {
  const { sliderValue, handleSliderChange, min, max } = props;
  // State to hold the value of the range input

  return (
    <div className="flex items-center">
      <input
        type="range"
        id="rangeInput"
        name="rangeInput"
        min={min ?? "0"}
        max={max ?? "100"}
        value={sliderValue}
        onChange={handleSliderChange}
      />
    </div>
  );
};

export default RangeInputComponent;
