import React from "react";
import Title from "./Title";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

function Rules({ rules }) {
  return (
    <React.Fragment>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Title>Association Rules</Title>
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
        {rules.map((rule, index) => (
          <ListItem key={`item-${index}`}>
            <ListItemText
              primary={
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {rule.antecedent.join(" + ")}
                    <ArrowRightAltIcon sx={{ marginLeft: 1, marginRight: 1 }} />
                    {rule.consequent.join(" + ")}
                  </Box>
                  <Grid item style={{ textAlign: "right" }}>
                    Confidence: {rule.confidence}
                  </Grid>
                </Grid>
              }
            />
          </ListItem>
        ))}
      </List>
    </React.Fragment>
  );
}

export default Rules;
