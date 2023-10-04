import React, { useState } from "react";

function InputBeamLength({ beam, onChange, updateScale, actualBeamLength, showInfoBorder }) {

    const [inputValue, setInputValue] = useState(beam.length);
    const [isinputVisible, setisInputVisible] = useState(false);
  
    return (
   
      <div className='d-flex' style={{ width: actualBeamLength, height: "20px" }}>
        <div>
          <div className='strikethrough'>|</div>
        </div>
  
        <div className="dimensionline border-dark" style={{ width: "100%", marginTop: "11px", borderTop: "1px solid" }}></div>
  
        {!isinputVisible ? (
          <div onClick={() => setisInputVisible(true)} id="tour-beamLength" className='inputPointer' style={{ fontSize: "15px", border: !showInfoBorder && "none" }}>
            {inputValue + beam.unit}
          </div>
        ) : (
          <div className="input-group input-group-sm" style={{ maxWidth: "180px" }} >
            <input
              type="number"
              autoFocus={true}
              inputMode="numeric"
              min={1}
              className="form-control "
              aria-label={`Enter beam length for Beam ${beam.id}`}
              value={inputValue}
              onChange={(e) => {
                e.stopPropagation()
                if ((e.nativeEvent.data === "-" || e.nativeEvent.data === "+")) {
                  e.target.value = inputValue
                }
                setInputValue(e.target.value);
                const newValue = (e.target.value.length === 0 ? 1 : parseFloat(e.target.value));
                const scale = newValue / parseFloat(actualBeamLength)
                console.log("Check on Length Change", {
                  "scale": scale,
                  "newValue": newValue,
                  "check": e.target.value.length === 0 ? 1 : parseFloat(e.target.value),
                })
  
                const newLength = e.target.value.length === 0 || newValue === 0 ? beam.length : newValue
                const newScale = e.target.value.length === 0 || newValue === 0 ? beam.scale : scale
  
                updateScale(beam.id, newScale, newLength)
                onChange(beam.id, "scale", newScale);
                onChange(beam.id, "length", newLength);
              }}
              onBlur={(e) => {
                setisInputVisible(false)
                setInputValue(e.target.value.length === 0 || parseFloat(e.target.value) === 0 ? 1 : e.target.value);
              }}
            />
          </div>
        )}
  
        <div className="dimensionline border-dark" style={{ width: "100%", marginTop: "11px", borderTop: "1px solid" }}></div>
        <div>
          <div className='strikethrough'>|</div>
        </div>
      </div>
  

    )
  }
  export default InputBeamLength