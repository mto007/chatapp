import React from "react";
import { Table } from "react-bootstrap";

export default function Participants({ participantList }) {
  const participants =
    participantList !== undefined
      ? participantList.map((participant, index) => (
          <tr key={index}>
            <td>{participant} </td>
          </tr>
        ))
      : null;
  return (
    <Table className="table">
      <tbody>{participants}</tbody>
    </Table>
  );
}
