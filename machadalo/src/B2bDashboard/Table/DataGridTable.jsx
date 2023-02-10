import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const DataGridTable = (props) => {
  const TableData = props?.row;
  const columns = props?.columns;
  console.log(props, '11111111111');
  return (
    <>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={TableData}
          getRowId={(row, index) => (row.campaign_id ? row.campaign_id : row._id)}
          columns={columns}
          pageSize={20}
          rowsPerPageOptions={[5]}
          // checkboxSelection
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
        />
      </div>
    </>
  );
};

export default DataGridTable;
