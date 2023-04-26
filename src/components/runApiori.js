import * as React from "react";
import { useState, useEffect } from "react";
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
import LoadingButton from "@mui/lab/LoadingButton";
import Papa from "papaparse";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import Apriori from "../Functions/Apriori";
import Paper from "@mui/material/Paper";

// function preventDefault(event) {
//   event.preventDefault();
// }
const Input = styled(MuiInput)`
  width: 47px;
`;
export default function RunApiori({
  history,
  setHistory,
  setExecutionId,
  viewData,
  setViewData,
  data,
  setData,
  setOpenCollapse,
  setAssociationRules,
}) {
  const [loading, setLoading] = useState(false);
  const [isInterval, setIsInterval] = useState(false);
  const handleSwitchChange = (event) => {
    setIsInterval(!isInterval);
  };
  const [minSupport, setMinSupport] = useState(0.02);
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

  const [confidence, setConfidence] = useState(0.2);

  const [dataName, setDataName] = useState("");
  const [withHeader, setWithHeader] = useState(false);
  const handleUpload = (event) => {
    Papa.parse(event.target.files[0], {
      skipEmptyLines: true,
      complete: function (results) {
        const data = results?.data;
        if (withHeader) {
          const header = data.shift();
          const formattedData = data.map((row) =>
            row.map((value, index) => `${header[index]}: ${value}`)
          );
          setData(formattedData);
          console.log(formattedData);
        } else {
          setData(data);
          console.log(data);
        }
      },
    });
    setDataName(event.target.files[0]?.name);
    setOpenCollapse(true);
    setViewData(true);
  };
  const clearFile = () => {
    setDataName("");
    setData([]);
    setViewData(false);
  };

  function linspace(start, stop, num) {
    const step = (stop - start) / (num - 1);
    return Array(num)
      .fill()
      .map((_, i) => start + i * step);
  }
  async function runAlgorithm() {
    setLoading(true);

    if (isInterval) {
      let executions = [];
      let id = history.length === 0 ? 0 : history[history.length - 1].id + 1;
      for (let minSupp of linspace(
        minSuppInterval[0],
        minSuppInterval[1],
        10
      )) {
        let settings = {
          isInterval,
          minSupport: minSupp,
          minSuppInterval,
          confidence,
          dataName,
        };
        let start = Date.now();
        let startDate = new Date(start);
        let { progress, frequentItems, frequentItemCounts, associationRules } =
          await Apriori(data, minSupp);
        let end = Date.now();
        let execId = id;
        id = id + 1;
        executions.push({
          id: execId,
          date:
            startDate.getDate() +
            "/" +
            (startDate.getMonth() + 1) +
            "/" +
            startDate.getFullYear() +
            " @ " +
            startDate.getHours() +
            ":" +
            startDate.getMinutes() +
            ":" +
            startDate.getSeconds(),
          execTime: `${end - start} ms`,
          itemsets: frequentItems,
          associationRules,
          settings: settings,
          progressData: {
            iteration: progress,
            nbItemset: frequentItemCounts,
          },
        });
        setAssociationRules(associationRules);
      }
      setHistory([...history, ...executions]);
      const execId =
        history.length === 0 ? 0 : history[history.length - 1].id + 1;
      setExecutionId(execId);
    } else {
      let settings = {
        isInterval,
        minSupport,
        minSuppInterval,
        dataName,
      };
      const start = Date.now();
      const startDate = new Date(start);

      const { progress, frequentItems, frequentItemCounts, associationRules } =
        await Apriori(data, settings.minSupport);
      const end = Date.now();
      const execId =
        history.length === 0 ? 0 : history[history.length - 1].id + 1;
      setHistory([
        ...history,
        {
          id: execId,
          date:
            startDate.getDate() +
            "/" +
            (startDate.getMonth() + 1) +
            "/" +
            startDate.getFullYear() +
            " @ " +
            startDate.getHours() +
            ":" +
            startDate.getMinutes() +
            ":" +
            startDate.getSeconds(),
          execTime: `${end - start} ms`,
          itemsets: frequentItems,
          associationRules,
          settings: settings,
          progressData: {
            iteration: progress,
            nbItemset: frequentItemCounts,
          },
        },
      ]);
      setExecutionId(execId);
      setAssociationRules(associationRules);
    }

    setLoading(false);
  }

  useEffect(() => {
    console.log(history);
  }, [history]);

  return (
    <React.Fragment>
      <Title>Apriori Settings</Title>

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
        <Box>
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
      <Box>
        <Typography id="input-slider" gutterBottom>
          Confidence
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Slider
              value={typeof confidence === "number" ? confidence : 0}
              onChange={(event, newValue) => {
                setConfidence(newValue);
              }}
              min={0}
              max={1}
              step={0.01}
              aria-labelledby="input-slider"
            />
          </Grid>
          <Grid item>
            <Input
              value={confidence}
              size="small"
              onChange={(event) => {
                setConfidence(
                  event.target.value === "" ? "" : Number(event.target.value)
                );
              }}
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
      <FormGroup>
        <Grid container>
          <Grid item xs={5}>
            <FormControlLabel
              control={
                <Switch checked={isInterval} onChange={handleSwitchChange} />
              }
              label="Range"
            />
          </Grid>
          <Grid item xs={7}>
            <FormControlLabel
              control={
                <Switch
                  checked={withHeader}
                  onChange={() => setWithHeader(!withHeader)}
                />
              }
              label="Data with header"
            />
          </Grid>
        </Grid>
      </FormGroup>
      <Box marginTop={2} alignSelf="center">
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
          <Paper elevation={5}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item zeroMinWidth>
                <Typography noWrap marginLeft={2}>
                  {dataName}
                </Typography>
              </Grid>
              <Grid item style={{ textAlign: "right" }}>
                <IconButton color="inherit" onClick={clearFile}>
                  <ClearIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>
      <Box marginTop={2} alignSelf="center">
        <LoadingButton
          variant="contained"
          startIcon={<RocketLaunchIcon />}
          disabled={data.length === 0}
          onClick={runAlgorithm}
          loading={loading}
        >
          Run Apriori
        </LoadingButton>
      </Box>
      <Box margin={1}>
        {viewData ? (
          <Button color="primary" onClick={() => setViewData(false)}>
            Hide data
          </Button>
        ) : (
          <Button
            color="primary"
            href="#"
            onClick={() => {
              setOpenCollapse(true);
              setViewData(true);
            }}
            disabled={data.length === 0}
          >
            Show data
          </Button>
        )}
      </Box>
    </React.Fragment>
  );
}
