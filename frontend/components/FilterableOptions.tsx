import React, { useState } from 'react';

export default function FilterableOptions ({ allOptions }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState(allOptions);

  const handleOptionChange = (option) => {
    const updatedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((item) => item !== option)
      : [...selectedOptions, option];

    setSelectedOptions(updatedOptions);

    if (updatedOptions.length === 0) {
      setFilteredOptions(allOptions);
    } else {
      const newFilteredOptions = allOptions.filter((item) =>
        updatedOptions.includes(item)
      );
      setFilteredOptions(newFilteredOptions);
    }
  };

  return (
    <div>
      <h2>Filter By:</h2>
      <div>
        {allOptions.map((option) => (
          <label key={option}>
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => handleOptionChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
      <ul>
        {filteredOptions.map((option) => (
          <li key={option}>{option}</li>
        ))}
      </ul>
    </div>
  );
};