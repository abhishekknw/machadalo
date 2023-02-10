import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import BasicTable from '../Table/BasicTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as API from '../API/types';
import Pagination from '../../components/Pagination';

const LeadDecisionPending = () => {
  const [leadType, setLeadType] = useState('Leads');
  let [search, setSearch] = useState('');
  // const [data, setData] = useState([]);

  const LeadDecisionPendingData = async () => {
    let resp = await API.getDecisionPendingList(leadType, search);
    setData(resp.data.data.lead);
  };
  const handleChange = (event) => {
    setLeadType(event.target.value);
    setSearch('');
    LeadDecisionPendingData();
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
    LeadDecisionPendingData();
  };
  useEffect(() => {
    // LeadDecisionPendingData();
  }, []);
  const handlePageChange = (page) => {
    alert(page.selected + 1);
  };
  return (
    <>
      <Box sx={{ minWidth: 120 }}>
        <FormControl sx={{ m: 1, minWidth: 100 }}>
          <InputLabel id="demo-simple-select-label">Lead Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={leadType}
            label="Lead Type"
            onChange={handleChange}
          >
            <MenuItem value={'Leads'}>Leads</MenuItem>
            <MenuItem value={'Survey'}>Survey</MenuItem>
            <MenuItem value={'Survey Leads'}>Survey Leads</MenuItem>
            <MenuItem value={'FeedBack'}>FeedBack</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField
            id="input-with-sx"
            label="Search"
            variant="standard"
            value={search}
            onChange={(e) => handleSearch(e)}
          />
        </Box>
      </Box>
      <BasicTable />
      {/* <div className="list__footer">
        <Pagination pageSize={5} totalItems={data.length} handlePageClick={handlePageChange} />
      </div> */}
    </>
  );
};

export default LeadDecisionPending;
