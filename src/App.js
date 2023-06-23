import "./styles.css";
import React from "react";
// Getting local JSON file
import Students from "./Students";
export default function App() {
  return (
    <>
      <div>
        <table border="2">
          <tbody>
            <tr>
              <th>Name</th>
              <th>Department</th>
            </tr>

            {Students.students.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
