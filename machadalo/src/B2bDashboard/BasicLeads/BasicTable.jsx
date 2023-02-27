import * as React from 'react';
import DataGridTable from '../Table/DataGridTable';
import { Checkbox, Button, Box } from '@mui/material';
import PaginationConstant from '../Pagination';
import ClientStatusDropdown from '../common/ClientStatus';
import ViewCommentModal from '../modals/ViewComment';
import { useRecoilState } from 'recoil';
import { leadDecisionPendingListAtom, errorAtom } from '../API/_state';
import AcceptDeclineLeads from './AcceptDecline';
import { decisionPendingActions } from '../API/_actions';

export default function BasicTable(props) {
  const [ListData, setListData] = useRecoilState(leadDecisionPendingListAtom);
  const [error, setError] = useRecoilState(errorAtom);
  const LeadBasicApi = decisionPendingActions();
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState([]);
  const params = props.data;

  const handleChange = async (event, value) => {
    setPage(value);
    params.page = value - 1;
    await LeadBasicApi.LeadDecisionPendingList(params);
  };

  const multiSelectLeads = (lead, e) => {
    let obj = { requirement_id: lead?.requirement_id, _id: lead?._id };
    if (e.target.checked) {
      setSelected([...selected, obj]);
    } else {
      setSelected((selected) =>
        selected.filter((item) => item.requirement_id !== lead.requirement_id)
      );
    }
  };
  const allAcceptDecline = async (status) => {
    let updateStatus = selected.map((v) => ({ ...v, client_status: status }));
    let newList = [];
    let RemoveIds = [];
    updateStatus.map((item) => {
      RemoveIds.push(item._id);
    });
    setError(true);
    setSelected(updateStatus);
    await LeadBasicApi.AcceptDeclineLeads(updateStatus);
    if (status == 'Accept' && error == false) {
      newList = ListData.lead.filter((data) => {
        return !RemoveIds.includes(data._id);
      });
      setListData({ ...ListData, lead: newList });
    } else {
      newList = ListData.lead.map((data) => {
        if (RemoveIds.includes(data._id)) {
          return { ...data, client_status: 'Decline' };
        } else return data;
      });
      setListData({ ...ListData, lead: newList });
    }
  };

  const headCells = [
    {
      field: 'checkbox',
      headerName: 'Select',
      width: 65,
      sortable: false,
      headerClassName: 'super-app-theme--header',
      cellClassName: 'select-box-cell',
      headerAlign: 'left',
      renderCell: (params) => (
        <>
          <Checkbox
            onChange={(e) => {
              multiSelectLeads(params.row, e);
            }}
          />
        </>
      ),
    },
    {
      field: 'entity_name',
      headerName: 'Entity Name',
      width: 140,
      headerAlign: 'left',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
    },
    {
      field: 'entity_type',
      sortable: false,
      headerClassName: 'super-app-theme--header',
      description: 'Type Of Entity',
      headerName: 'TOE',
      width: 40,
    },
    {
      field: 'primary_count',
      numeric: true,
      headerClassName: 'super-app-theme--header',
      headerName: 'PC',
      description: 'Primary Count',
      width: 40,
    },
    {
      field: 'city',
      numeric: true,
      sortable: false,
      headerClassName: 'super-app-theme--header',
      headerName: 'City',
      width: 100,
    },
    {
      field: 'area',
      numeric: true,
      headerClassName: 'super-app-theme--header',
      headerName: 'Area',
      width: 100,
    },
    {
      field: 'lead_timestamp',
      headerName: 'Lead Stamp',
      headerClassName: 'super-app-theme--header',
      width: 140,
    },
    {
      field: 'CurrentStatus',
      numeric: true,
      sortable: false,
      headerName: 'Current Status',
      headerAlign: 'center',
      width: 150,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <>
          <ClientStatusDropdown data={params.row} checkTable="leadBasicTable" />
        </>
      ),
    },
    {
      field: 'phone_number',
      numeric: true,
      headerClassName: 'super-app-theme--header',
      headerName: 'Phone Number',
      sortable: false,
      width: 120,
    },
    {
      field: 'ClientComment',
      headerName: 'Client Comment',
      width: 125,
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell center-div',
      sortable: false,
      renderCell: (params) => (
        <>
          <ViewCommentModal data={params.row} />
        </>
      ),
    },
    {
      field: 'Action',
      headerName: 'Action',
      width: 200,
      sortable: false,
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      cellClassName: 'super-app-theme--cell',
      renderCell: (params) => (
        <>
          <AcceptDeclineLeads data={params.row} />
        </>
      ),
    },
  ];
  return (
    <>
      {ListData.length > 0 && (
        <DataGridTable
          row={ListData.lead}
          columns={headCells}
          styles={{ height: 400, width: '100%' }}
          classNames="data-b2b-table"
        />
      )}
      <Box className="d-flex align-items-center justify-content-between">
        <Box>
          <Button
            variant="contained"
            size="small"
            className="theme-btn width-btn text-small mt-2 mb-2"
            style={{ marginLeft: 5 }}
            onClick={(e) => {
              allAcceptDecline('Accept');
            }}
            disabled={selected.length < 1}
          >
            Accept All
          </Button>
          <Button
            variant="contained"
            size="small"
            className="theme-btn width-btn text-small mt-2 mb-2"
            style={{ marginLeft: 5 }}
            onClick={(e) => {
              allAcceptDecline('Decline');
            }}
            disabled={selected.length < 1}
          >
            Decline All
          </Button>
        </Box>
        <PaginationConstant
          pageSize={20}
          totalItems={ListData.length}
          pageNo={page}
          onPageChange={handleChange}
        />
      </Box>
      <Box></Box>
    </>
  );
}
