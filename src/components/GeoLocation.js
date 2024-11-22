import React, { useState } from "react";
import { Form } from "react-bootstrap";
import PlacesAutocomplete, {
  geocodeByAddress,
} from "react-places-autocomplete";

const AutocompleteInput = ({
  value,
  onChange,
  onSelect,
  editMode,
  placeholder,
}) => {
  const [address, setAddress] = useState(value);

  const handleChange = (newAddress) => {
    setAddress(newAddress);
  };

  const handleSelect = async (newAddress) => {
    setAddress(newAddress);

    try {
      const results = await geocodeByAddress(newAddress);
      const selectedPlace = results[0];

      const cityComponent = selectedPlace.address_components.find((component) =>
        component.types.includes("administrative_area_level_2")
      );
      const suburbComponent = selectedPlace.address_components.find(
        (component) => component.types.includes("locality")
      );

      const stateComponent = selectedPlace.address_components.find(
        (component) => component.types.includes("administrative_area_level_1")
      );
      const postalCodeComponent = selectedPlace.address_components.find(
        (component) => component.types.includes("postal_code")
      );

      const city = cityComponent ? cityComponent.long_name : "";
      const suburb = suburbComponent ? suburbComponent.long_name : "";

      const state = stateComponent ? stateComponent.long_name : "";
      const postalCode = postalCodeComponent
        ? postalCodeComponent.long_name
        : "";

      onSelect(newAddress, suburb, city, state, postalCode);
    } catch (error) {
      console.error("Error fetching details from Google Places API", error);
    }
  };

  const searchOptions = {
    componentRestrictions: { country: ["au"] }, 
  };
  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
      searchOptions={searchOptions}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <Form.Control
            as="textarea"
            rows={3}
            // style={{ width: "100%" }}
            value={address}
            {...getInputProps({
              placeholder: placeholder || "Search Places ...",
              className: "location-search-input",
            })}
            disabled={editMode}
          />
          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion) => {
              const className = suggestion.active
                ? "suggestion-item--active"
                : "suggestion-item";
              const style = suggestion.active
                ? { backgroundColor: "#fafafa", cursor: "pointer" }
                : { backgroundColor: "#ffffff", cursor: "pointer" };
              return (
                <div
                  key={suggestion.placeId}
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default AutocompleteInput;