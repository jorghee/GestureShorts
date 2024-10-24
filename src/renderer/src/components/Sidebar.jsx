import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import { Grid, Typography, TextField } from "@mui/material";
import RowRadioButtonsGroup from "./RadioForm.jsx";

const Sidebar = ({ config, setConfig }) => {
  const [smoothing, setSmoothing] = React.useState(config.smoothingTechnique);

  const handleGestureChange = (event) => {
    const gesture = gestureVerboseToValue(event.target.value);
    setConfig({ ...config, gesture: event.target.value });
  };
  const handleHandChange = (event) => {
    setConfig({ ...config, hand: event.target.value });
  };
  const handleSmoothingChange = (event) => {
    setConfig({ ...config, smoothing: event.target.value });
  };
  const handleSmoothingValueChange = (event, type) => {
    if (type === "exponential") {
      setConfig({ ...config, smoothness: event.target.value });
    } else {
      setConfig({ ...config, bufferSize: event.target.value });
    }
  };
  const getGestureVerbose = (gesture) => {
    switch (gesture) {
      case "index-thumb-pinch":
        return "Index Thumb Pinch";
      case "index-finger-point":
        return "Index Finger Point";
      case "thumb-point":
        return "Thumb Point";
      case "fist":
        return "Fist";
      default:
        return "Unknown";
    }
  };
  const gestureVerboseToValue = (gesture) => {
    switch (gesture) {
      case "Index Thumb Pinch":
        return "index-thumb-pinch";
      case "Index Finger Point":
        return "index-finger-point";
      case "Thumb Point":
        return "thumb-point";
      case "Fist":
        return "fist";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="sidebar">
      <h3>Settings</h3>
      <p>Edit gestures, main hand and smoothing method here</p>

      <div className="settings">
        <Grid container spacing={2}>
          <Grid item xs={10} md={10}>
            <RowRadioButtonsGroup
              name={"Hand"}
              labels={["Left", "Right"]}
              active={"Right"}
            />
          </Grid>
          <Grid item xs={10} md={10}>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Gesture</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={getGestureVerbose(config.clickGesture)}
                  label="Gesture"
                  onChange={handleGestureChange}
                >
                  <MenuItem value={"Index Thumb Pinch"}>
                    Index Thumb Pinch
                  </MenuItem>
                  <MenuItem value={"Index Finger Point"}>
                    Index Finger Point
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={10} md={10}>
            <Divider />
            <Typography>Smoothing</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Method</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={smoothing}
                  label="Method"
                  onChange={handleSmoothingChange}
                >
                  <MenuItem value={"exponential"}>Exponential</MenuItem>
                  <MenuItem value={"moving-average"}>Moving Average</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={6} md={6}>
            <TextField
              id="outlined-number"
              label={smoothing === "exponential" ? "Alpha" : "Buffer Size"}
              type="number"
              InputLabelProps={{
                shrink: true
              }}
              onChange={(event) => handleSmoothingValueChange(event, smoothing)}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Sidebar;
