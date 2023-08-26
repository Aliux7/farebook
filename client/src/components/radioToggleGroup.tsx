import React, { useState } from "react";
import "../styles/RadioButton.css";

const RadioToggleGroup = ({editBackgroundStory}) => {
  const [selectedOption, setSelectedOption] = useState("red");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    editBackgroundStory(event.target.value);
  };

  return (
    <div>
      <input
        id="red"
        type="radio"
        value="red"
        checked={selectedOption === "red"}
        onChange={handleOptionChange}
      />
      <label htmlFor="red" style={{backgroundColor:'red', marginRight: '15px'}}></label>
      <input
        id="blue"
        type="radio"
        value="blue"
        checked={selectedOption === "blue"}
        onChange={handleOptionChange}
      />
      <label htmlFor="blue" style={{backgroundColor:'blue', marginRight: '15px'}}></label>
      <input
        id="orange"
        type="radio"
        value="orange"
        checked={selectedOption === "orange"}
        onChange={handleOptionChange}
      />
      <label htmlFor="orange" style={{backgroundColor:'orange', marginRight: '15px'}}></label>
      <input
        id="purple"
        type="radio"
        value="purple"
        checked={selectedOption === "purple"}
        onChange={handleOptionChange}
      />
      <label htmlFor="purple" style={{backgroundColor:'purple', marginRight: '15px'}}></label>
      <input
        id="yellow"
        type="radio"
        value="yellow"
        checked={selectedOption === "yellow"}
        onChange={handleOptionChange}
      />
      <label htmlFor="yellow" style={{backgroundColor:'yellow', marginRight: '15px'}}></label>
      <input
        id="green"
        type="radio"
        value="green"
        checked={selectedOption === "green"}
        onChange={handleOptionChange}
      />
      <label htmlFor="green" style={{backgroundColor:'green', marginRight: '15px'}}></label>
      <input
        id="black"
        type="radio"
        value="black"
        checked={selectedOption === "black"}
        onChange={handleOptionChange}
      />
      <label htmlFor="black" style={{backgroundColor:'black', marginRight: '15px'}}></label>
    </div>
  );
};


export default RadioToggleGroup;
