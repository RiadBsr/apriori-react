import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

// Generate Execution Data
function createData(id, date, dataName, execTime, nbItemsets) {
  return { id, date, dataName, execTime, nbItemsets };
}

const rows = [
  createData(
    0,
    "16 Mar, 2019",
    "Elvis Presley",
    "Tupelo, MS",
    "VISA ⠀•••• 3719"
  ),
  createData(
    1,
    "16 Mar, 2019",
    "Paul McCartney",
    "London, UK",
    "VISA ⠀•••• 2574"
  ),
  createData(2, "16 Mar, 2019", "Tom Scholz", "Boston, MA", "MC ⠀•••• 1253"),
  createData(
    3,
    "16 Mar, 2019",
    "Michael Jackson",
    "Gary, IN",
    "AMEX ⠀•••• 2000"
  ),
  createData(
    4,
    "15 Mar, 2019",
    "Bruce Springsteen",
    "Long Branch, NJ",
    "VISA ⠀•••• 5919"
  ),
];

function preventDefault(event) {
  event.preventDefault();
}

export default function Executions({ data, setHistory }) {
  const clearHistory = () => {
    setHistory([]);
  };
  return (
    <React.Fragment>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Title>Recent Executions</Title>
        </Grid>
        <Grid item>
          <IconButton color="inherit" onClick={clearHistory}>
            <RestartAltIcon />
          </IconButton>
        </Grid>
      </Grid>
      {data.length === 0 ? (
        <Typography>No execution yet recorded</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Dataset Name</TableCell>
              <TableCell>Execution Time</TableCell>
              <TableCell>Frequent Itemsets</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.dataName}</TableCell>
                <TableCell>{row.execTime}</TableCell>
                <TableCell>{row.nbItemsets}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more executions
      </Link>
    </React.Fragment>
  );
}
