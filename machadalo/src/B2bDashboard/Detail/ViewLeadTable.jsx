import React, { useState } from 'react';
import { Button } from '@mui/material';
import DataGridTable from '../Table/DataGridTable';
import TuneIcon from '@mui/icons-material/Tune';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import { campaignLeads } from '../API/_state';
import { useRecoilValue } from 'recoil';
import FilterModal from '../modals/FilterModal';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
const ViewLeadDetail = (props) => {
  // const headCells = [
  //   {
  //     field: 'checkbox',
  //     headerName: 'Select',
  //     width: 50,
  //     renderCell: (params) => <>1</>,
  //   },
  //   {
  //     field: 'entity_name',
  //     headerName: 'Supplier Name',
  //     width: 200,
  //   },
  //   {
  //     field: 'entity_name',
  //     numeric: true,
  //     description: 'Type Of Entity',
  //     headerName: 'TOE',
  //     width: 60,
  //   },
  //   {
  //     field: 'entity_type',
  //     numeric: true,
  //     headerName: 'Supplier Type',
  //     width: 60,
  //   },
  //   {
  //     field: 'area',
  //     numeric: true,
  //     headerName: 'Area',
  //   },
  //   {
  //     field: 'city',
  //     numeric: true,
  //     headerName: 'City',
  //   },
  //   {
  //     field: 'primary_count',
  //     headerName: 'Flat Count',
  //     numeric: true,
  //     width: 100,
  //   },
  //   {
  //     field: 'supplier_secondary_count',
  //     headerName: 'Tower Count',
  //     numeric: true,
  //     width: 100,
  //   },
  //   {
  //     field: 'lead_timestamp',
  //     numeric: true,
  //     sortable: true,
  //     headerName: 'Lead Time Stamp',
  //   },
  //   {
  //     field: 'CurrentStatus',
  //     numeric: true,
  //     sortable: false,
  //     headerName: 'Current Status',
  //     width: 250,
  //     renderCell: (params) => (
  //       <>
  //         <select className="select-b2b">
  //           <option>Leads Verified By Machadalo</option>
  //           <option>Leads Verified By Machadalo</option>
  //           <option>Leads Verified By Machadalo</option>
  //           <option>Leads Verified By Machadalo</option>
  //           <option>Leads Verified By Machadalo</option>
  //           <option>Leads Verified By Machadalo</option>
  //           <option>Leads Verified By Machadalo</option>
  //         </select>
  //       </>
  //     ),
  //   },
  //   {
  //     field: 'ClientComment',
  //     headerName: 'Client Comment',
  //     width: 140,
  //     sortable: false,
  //     renderCell: (params) => (
  //       <strong>
  //         <Button variant="contained" size="small"
  //           className='theme-btn'>
  //           View Comment
  //         </Button>
  //       </strong>
  //     ),
  //   },
  //   {
  //     field: 'Action',
  //     headerName: 'Action',
  //     width: 150,
  //     sortable: false,
  //     renderCell: (params) => (
  //       <strong>
  //         <Button variant="contained" size="small"
  //           className='theme-btn'>
  //           Lead Details
  //         </Button>
  //       </strong>
  //     ),
  //   },
  // ];
  function createData(index, suppliername, suppliertype, area, city, flatcount, leadtimestamp, towercount, currentstatus, clientcomment, leaddetail) {
    return { index, suppliername, suppliertype, area, city, flatcount, leadtimestamp, towercount, currentstatus, clientcomment, leaddetail };
  }

  const rows = [
    // createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    
    createData(1, 'CPWD Colony 2','RS', 'Prayagraj', 'Allahabad', 300, '2022-12-23  09:09:34', 5, 'Last Verified by', 'View/ Add', 'Lead Detail'),
  ];
  
  const viewLeads = useRecoilValue(campaignLeads);
  console.log(viewLeads, 'viewLeads');

  return (
    <>
      <FilterModal />
       <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Index</TableCell>
            <TableCell>Supplier Name</TableCell>
            <TableCell>Supplier Type</TableCell>
            <TableCell>Area</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Flat Count</TableCell>
            <TableCell>Lead Time Stamp</TableCell>
            <TableCell>Tower count</TableCell>
            <TableCell>Current Status</TableCell>
            <TableCell>Client Comment </TableCell>
            <TableCell>Lead Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.index}
              </TableCell>
              <TableCell>{row.suppliername}</TableCell>
              <TableCell>{row.suppliertype}</TableCell>
              <TableCell>{row.area}</TableCell>
              <TableCell>{row.city}</TableCell> 
              <TableCell>{row.flatcount}</TableCell>
              <TableCell>{row.leadtimestamp}</TableCell>
              <TableCell>{row.towercount}</TableCell>
              <TableCell>{row.currentstatus}</TableCell> 
              <TableCell>{row.clientcomment}</TableCell>
              <TableCell>{row.leaddetail}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
};

export default ViewLeadDetail;
