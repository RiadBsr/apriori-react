import * as React from "react";
import { useState } from "react";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";
import Title from "./Title";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Papa from "papaparse";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import Apriori from "../Functions/Apriori";

function preventDefault(event) {
  event.preventDefault();
}
const Input = styled(MuiInput)`
  width: 47px;
`;
export default function RunApiori({ history, setHistory }) {
  const [isInterval, setIsInterval] = useState(false);
  const handleSwitchChange = (event) => {
    setIsInterval(!isInterval);
  };
  const [minSupport, setMinSupport] = useState(0.2);
  const handleSliderChange = (event, newValue) => {
    setMinSupport(newValue);
  };
  const handleInputChange = (event) => {
    setMinSupport(event.target.value === "" ? "" : Number(event.target.value));
  };
  const handleBlur = () => {
    if (minSupport < 0) {
      setMinSupport(0);
    } else if (minSupport > 1) {
      setMinSupport(1);
    }
  };
  const [minSuppInterval, setMinSuppInterval] = useState([0.2, 0.7]);
  const handleIntervalChange = (event, newValue) => {
    setMinSuppInterval(newValue);
  };
  const [data, setData] = useState([]);
  const [dataName, setDataName] = useState("");
  const handleUpload = (event) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        setData(results?.data);
      },
    });
    setDataName(event.target.files[0]?.name);
  };
  const clearFile = () => {
    setDataName("");
    setData([]);
  };

  const runAlgorithm = () => {
    const settings = {
      isInterval,
      minSupport,
      minSuppInterval,
      dataName,
    };
    Apriori(data, settings, history, setHistory);
  };

  return (
    <React.Fragment>
      <Title>Apriori Settings</Title>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch checked={isInterval} onChange={handleSwitchChange} />
          }
          label="Interval"
        />
      </FormGroup>
      {isInterval ? (
        <Box>
          <Typography id="input-slider" gutterBottom>
            Min Supports Range
          </Typography>
          <Slider
            getAriaLabel={() => "Temperature range"}
            value={minSuppInterval}
            onChange={handleIntervalChange}
            valueLabelDisplay="auto"
            min={0}
            max={1}
            step={0.01}
          />
        </Box>
      ) : (
        <Box sx={{ width: 230 }}>
          <Typography id="input-slider" gutterBottom>
            Min Support
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <Slider
                value={typeof minSupport === "number" ? minSupport : 0}
                onChange={handleSliderChange}
                min={0}
                max={1}
                step={0.01}
                aria-labelledby="input-slider"
              />
            </Grid>
            <Grid item>
              <Input
                value={minSupport}
                size="small"
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{
                  step: 0.01,
                  min: 0,
                  max: 1,
                  type: "number",
                  "aria-labelledby": "input-slider",
                }}
              />
            </Grid>
          </Grid>
        </Box>
      )}
      {data.length === 0 ? (
        <Button
          variant="outlined"
          component="label"
          startIcon={<UploadFileIcon />}
        >
          Upload Data
          <input type="file" accept=".csv" onChange={handleUpload} hidden />
        </Button>
      ) : (
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Typography>{dataName}</Typography>
          </Grid>
          <Grid item>
            <IconButton color="inherit" onClick={clearFile}>
              <ClearIcon />
            </IconButton>
          </Grid>
        </Grid>
      )}
      <Box marginTop={1} alignSelf="center">
        <Button
          variant="contained"
          startIcon={<RocketLaunchIcon />}
          disabled={data.length === 0}
          onClick={runAlgorithm}
        >
          Run Apriori
        </Button>
      </Box>
      <Box margin={1}>
        <Link color="primary" href="#" onClick={preventDefault}>
          View data
        </Link>
      </Box>
    </React.Fragment>
  );
}
