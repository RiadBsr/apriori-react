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
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import HistoryIcon from "@mui/icons-material/History";
import Tooltip from "@mui/material/Tooltip";

function preventDefault(event) {
  event.preventDefault();
}

export default function Executions({
  data,
  setHistory,
  setExecutionId,
  setAssociationRules,
}) {
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
          <Tooltip title="Clear History" placement="left">
            <IconButton color="inherit" onClick={clearHistory}>
              <RestartAltIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      {data?.length === 0 ? (
        <Box alignSelf="center">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexwrap: "wrap",
            }}
          >
            <HistoryIcon color="primary" sx={{ fontSize: 50 }} />

            <Typography margin={2}>No execution yet recorded</Typography>
          </div>
        </Box>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Dataset Name</TableCell>
              <TableCell>Execution Time</TableCell>
              <TableCell>Frequent Itemsets</TableCell>
              <TableCell>Min Support</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.settings?.dataName}</TableCell>
                <TableCell>{row.execTime}</TableCell>
                <TableCell>{row.itemsets?.length}</TableCell>
                <TableCell>
                  {row.settings?.isInterval
                    ? `[ ${row.settings?.minSuppInterval[0]} - ${
                        row.settings?.minSuppInterval[1]
                      } ]  ${row.settings?.minSupport.toFixed(2)}`
                    : row.settings?.minSupport}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      setExecutionId(row.id);
                      setAssociationRules(row.associationRules);
                    }}
                  >
                    View
                  </Button>
                </TableCell>
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
