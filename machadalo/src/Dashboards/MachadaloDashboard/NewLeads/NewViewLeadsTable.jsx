import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import CommonTable from '../../Table/CommonTable';
import {
  LeadByCampaignsAtom,
  ClientStatusAtom,
  NewLeadTabFilterAtom,
} from '../../_states/Machadalo/newLeads';
import { showHideModalAtom } from '../../_states/Constant';
import { useRecoilValue, useRecoilState } from 'recoil';
import { newLeadActions } from '../../_actions/Machadalo/newLead.actions';
import Button from 'react-bootstrap/Button';
import dayjs from 'dayjs';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { BsSortDown, BsSearch, BsSortUp, BsChevronDown, BsChevronUp } from 'react-icons/bs';
import DateFilter from '../../common/date-range-filter/dateFilter';
import CommentModal from '../../common/Modals/CommentModal';

export default function NewViewLeadsTable({ Data }) {
  const CampaignData = Data;
  const LeadsByCampaign = useRecoilValue(LeadByCampaignsAtom);
  const clientStatuslist = useRecoilValue(ClientStatusAtom);
  const [filters, setFilters] = useRecoilState(NewLeadTabFilterAtom);
  const NewLeadAction = newLeadActions();
  const [paginationData, setPaginationData] = useState({
    pageNo: 1,
  });
  const [showHideModal, setshowHideModal] = useRecoilState(showHideModalAtom);
  const [selectedId, setSelectedId] = React.useState('');

  const handlePageChange = async (value) => {
    setFilters({ ...filters, leadSearch: '' });
    setPaginationData({
      pageNo: value.selected + 1,
    });
    let params = { ...filters, next_page: value.selected + 1 };
    params.leadSearch = '';
    await NewLeadAction.getLeadByCampaignId(params);
  };
  const openCommentModal = async (row) => {
    setshowHideModal({
      ...showHideModal,
      comment: { show: true, tableName: 'LeadDetail', data: row[0] },
    });
    let params = {
      comment_type: 'all',
      _id: row[0]._id,
      requirement_id: row[0].requirement_id,
    };
    await NewLeadAction.getCommentListByIds(params);
  };
  const onSearch = async (e) => {
    let data = { ...filters, leadSearch: e.target.value, next_page: 0 };
    setFilters({ ...filters, leadSearch: e.target.value });
    if (e.target.value != '' && e.target.value.length > 2) {
      await NewLeadAction.getLeadByCampaignId(data);
    }
    if (!e.target.value || e.target.value === '') {
      let data = { ...filters, leadSearch: '', next_page: 0 };
      await NewLeadAction.getLeadByCampaignId(data);
    }
  };
  const handleSelect = async (status, row) => {
    let object = [
      {
        macchadalo_client_status: status,
        _id: row[0]?._id,
        requirement_id: row[0]?.requirement_id,
      },
    ];
    await NewLeadAction.updateClientStatus(object);
  };

  const AcceptDeclineLeads = async (data, status) => {
    let obj = [{ client_status: status, requirement_id: data?.requirement_id, _id: data?._id }];
    await NewLeadAction.acceptDeclineLeads(obj);
  };

  async function showHideRow(id) {
    setSelectedId(id === selectedId ? '' : id);
    await NewLeadAction.getSupplierLeadsById(id);
  }
  return (
    <>
      <div className="text-center">
        <h4 className="table-head">{CampaignData?.name?.toUpperCase()}</h4>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <div></div>

        <div className="searchbox">
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Search"
              aria-label="Search"
              value={filters.leadSearch}
              onChange={(e) => {
                onSearch(e);
              }}
            />
            <InputGroup.Text>
              <BsSearch />
            </InputGroup.Text>
          </InputGroup>
        </div>
      </div>
      {/* <DateFilter onDateChange={getDates} /> */}
      <Table striped bordered hover className="leads-table basic-leads">
        <thead className="leads-tbody">
          <tr>
            <th>S.No.</th>
            {LeadsByCampaign?.header &&
              Object.keys(LeadsByCampaign?.header)?.map((key) => {
                return <th key={key}>{LeadsByCampaign?.header[key]}</th>;
              })}
            <th>Current Status</th>
            <th>Comment</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {LeadsByCampaign?.values.map((row, index) => {
            return (
              <tr key={index}>
                <td>
                  {index + 1}
                  <span
                    onClick={(e) => {
                      showHideRow(row[0]?.supplier_id);
                    }}
                  >
                    {selectedId === row[0]?._id ? <BsChevronUp /> : <BsChevronDown />}
                  </span>
                </td>
                {row.map((data, index) => (index != 0 ? <td key={index}>{data?.value}</td> : null))}
                <td className="lead-dropdown">
                  <Dropdown className="table-dropdown-status">
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {row[0]?.macchadalo_client_status}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {clientStatuslist &&
                        clientStatuslist.map((item, index) => {
                          return (
                            <Dropdown.Item
                              key={index}
                              eventKey={item.status_name}
                              onClick={(e) => {
                                handleSelect(item.status_name, row);
                              }}
                              active={item.status_name == row[0]?.macchadalo_client_status}
                            >
                              {item.status_name}
                            </Dropdown.Item>
                          );
                        })}
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
                <td>
                  <Button
                    variant="outline-dark"
                    className="lead-btn"
                    onClick={(e) => {
                      openCommentModal(row);
                    }}
                  >
                    Comment
                  </Button>
                </td>
                <td className="lead-btn-main">
                  <Button
                    variant="outline-dark"
                    className="lead-btn"
                    onClick={(e) => AcceptDeclineLeads(row[0], 'Accept')}
                  >
                    Accept
                  </Button>
                  <br />
                  <Button
                    variant="outline-dark"
                    className="lead-btn"
                    onClick={(e) => AcceptDeclineLeads(row[0], 'Decline')}
                    disabled={row[0]?.client_status === 'Decline'}
                  >
                    Decline
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      {console.log(LeadsByCampaign)}
      {/* <Paginations
        pageSize={20}
        totalItems={LeadsByCampaign.length}
        pageNo={paginationData.pageNo}
        onPageChange={handlePageChange}
      /> */}
      <ReactPagination
        pageNo={paginationData.pageNo}
        pageSize={20}
        totalItems={LeadsByCampaign.length}
        onPageChange={handlePageChange}
      />
      <CommentModal />
    </>
  );
}
