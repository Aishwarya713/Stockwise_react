import React from "react";
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Chip
} from "@material-ui/core";
import useStyles from "../../styles";

const states = {
  sent: "success",
  pending: "warning",
  declined: "secondary",
};

export default function TableComponent({ data }) {
  return (
    <Table className="mb-0">
      <TableHead>
        <TableRow>
        <TableCell key={"Name"}>{"Name"}</TableCell>
        <TableCell key={"Symbol"}>{"Symbol"}</TableCell>
        <TableCell key={"Change"}>{"Change"}</TableCell>
        <TableCell key={"Price"}>{"Price"}</TableCell>
        <TableCell key={"Changes Percentage"}>{"Changes Percentage"}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        { data && data.map(({ name, symbol, change, price , changesPercentage}, index) => (
          <TableRow key={index}>
            <TableCell className="pl-3 fw-normal">{name}</TableCell>
            <TableCell>{symbol}</TableCell>
            <TableCell>{change}</TableCell>
            <TableCell>{price}</TableCell>
            <TableCell>{changesPercentage}</TableCell>
            {/* <TableCell>
              <Chip label={status} classes={{root: classes[states[status.toLowerCase()]]}}/>
            </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
