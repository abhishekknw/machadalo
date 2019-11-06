import React from 'react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import CampaignBadge from '../../CampaignBadge';

const getCampaignColumn = () => {
  return [
    {
      dataField: 'status',
      text: 'Booking Status',
      row: 0,
      rowSpan: 2,
      formatter: (cell, row) => {
        let status = get(row, 'status');
        let variant =
          status === 'completed' ? 'success' : status === 'confirmed booking' ? 'info' : 'danger';
        return <CampaignBadge variant={variant}>{status}</CampaignBadge>;
      },
    },
    {
      dataField: 'permission_box_count',
      text: 'Permission Box Count',
      row: 0,
      rowSpan: 2,
    },
    {
      dataField: 'comments_count',
      text: 'Comments Count',
      row: 0,
      rowSpan: 2,
    },
    {
      dataField: 'receipt_count',
      text: 'Receipt Count',
      row: 0,
      rowSpan: 2,
    },
    {
      dataField: 'supplier_count',
      text: 'Supplier Count',
      row: 0,
      rowSpan: 2,
    },
    {
      dataField: 'payment_method',
      text: 'Payment Method',
      row: 0,
      rowSpan: 2,
    },
    {
      dataField: 'comments_count',
      text: 'Comments Count',
      row: 0,
      rowSpan: 2,
    },
    {
      dataField: 'supplier',
      text: 'Suppliers',
      row: 0,
      rowSpan: 2,
      formatter: (cell, row) => {
        const { campaign_id, status, supplier_count } = row;
        const isSuppliers = supplier_count > 0 ? true : false;
        return (
          <div>
            {isSuppliers ? (
              <Link
                to={{
                  pathname: `operations-dashboard/${campaign_id}/${status}/supplier`,
                  state: {
                    suppliers: cell,
                    campaign_id,
                    status,
                  },
                }}
              >
                View Suppliers
              </Link>
            ) : (
              'No Suppliers'
            )}
          </div>
        );
      },
    },
  ];
};

export default getCampaignColumn;
