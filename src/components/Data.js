import React from "react";
import Title from "./Title";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

function Data({ data }) {
  return (
    <React.Fragment>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Title>Data Preview</Title>
        </Grid>
        <Grid item>
          <Typography>
            showing <b>10/{data.length}</b>
          </Typography>
        </Grid>
      </Grid>
      <List
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: "background.paper",
          position: "relative",
          overflow: "auto",
          "& ul": { padding: 0 },
        }}
      >
        {data.slice(0, 10).map((item, index) => (
          <ListItem key={`item-${index}-${item}`}>
            <ListItemText
              primary={`Transaction ${index + 1}`}
              secondary={
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {item.join(" + ")}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </React.Fragment>
  );
}

export default Data;
