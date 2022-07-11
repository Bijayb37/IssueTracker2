import React from "react"
import "../styles/testTable.css"
import { useTable, usePagination } from "react-table"
import Table from "react-bootstrap/Table"

function TestTable({ columns, data, numColumns }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    { columns, data, initialState: { pageSize: numColumns ? numColumns : 10 } },
    usePagination
  )
  return (
    <div>
      <Table hover {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </Table>
      <div className="pagination">
        <p>Rows Per Page</p>
        <select
          className="rowOption"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[5, 10, 20].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
          <p>Page {pageIndex + 1} of {pageOptions.length}</p>
          &nbsp;
          <button
          id="previous page"
            className="btn page-btn"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          &nbsp;
          <button
            className="btn page-btn"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
          &nbsp;
      </div>
    </div>
  )
}

export default TestTable
