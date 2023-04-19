import * as React from "react";
import { useTheme } from "@mui/material/styles";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from "recharts";
import Title from "./Title";
import { Typography, Box } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function Chart({ data }) {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Graphs</Title>
      {data?.length === 0 ? (
        <Box alignSelf="center">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexwrap: "wrap",
              marginTop: 50,
            }}
          >
            <InfoOutlinedIcon color="primary" sx={{ fontSize: 50 }} />

            <Typography margin={2}>
              You need first to run the Apriori algorithm
            </Typography>
          </div>
        </Box>
      ) : (
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{
              top: 16,
              right: 16,
              bottom: 0,
              left: 24,
            }}
          >
            <XAxis
              dataKey="iteration"
              stroke={theme.palette.text.secondary}
              style={theme.typography.body2}
            >
              <Label
                position="center"
                style={{
                  textAnchor: "middle",
                  fill: theme.palette.text.primary,
                  ...theme.typography.body1,
                }}
              >
                Iterations
              </Label>
            </XAxis>

            <YAxis
              stroke={theme.palette.text.secondary}
              style={theme.typography.body2}
            >
              <Label
                angle={270}
                position="left"
                style={{
                  textAnchor: "middle",
                  fill: theme.palette.text.primary,
                  ...theme.typography.body1,
                }}
              >
                Number of frequent itemsets
              </Label>
            </YAxis>
            <Bar
              isAnimationActive={false}
              type="monotone"
              dataKey="nbItemset"
              fill="#1976D2"
              dot={false}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </React.Fragment>
  );
}
