import React from 'react';
import { Link } from 'react-router-dom';

const getBtobCampaignSummaryColumn = () => {
  return [
    {
      dataField: 'Unknown',
      text: 'Unknown(Others)',
      formatter: (cell, row) => {
        const { booking_sub_status } = row;
        let unknown = row['Unknown'] || 0;
        let phone_number_issue,
          contact_person_issue = 0;
        if (booking_sub_status) {
          phone_number_issue =
            booking_sub_status['Phone Number Issue'] &&
            booking_sub_status['Phone Number Issue'].count;
          contact_person_issue =
            booking_sub_status['Contact Person Issue'] &&
            booking_sub_status['Contact Person Issue'].count;
        }
        return (
          <div>
            {unknown}
            {booking_sub_status && (
              <div style={{ color: 'green' }}>
                <p>{phone_number_issue > 0 && `Phone Number Issue : ${phone_number_issue}`}</p>
                <p>
                  {contact_person_issue > 0 && `Contact Person Issue : ${contact_person_issue}`}
                </p>
              </div>
            )}
          </div>
        );
      },
    },
    {
      dataField: 'New Entity',
      text: 'New Entity',
      formatter: (cell, row) => {
        const { booking_sub_status } = row;
        let new_entity = row['New Entity'] || 0;
        let wikimapia,
          google,
          acres,
          magic_brick,
          first_time_assigned,
          others = 0;
        if (booking_sub_status) {
          wikimapia = booking_sub_status['Wikimapia'] && booking_sub_status['Wikimapia'].count;
          google = booking_sub_status['Google'] && booking_sub_status['Google'].count;
          acres = booking_sub_status['99Acres'] && booking_sub_status['99Acres'].count;
          magic_brick =
            booking_sub_status['Magic Brick'] && booking_sub_status['Magic Brick'].count;
          first_time_assigned =
            booking_sub_status['First Time Assigned'] &&
            booking_sub_status['First Time Assigned'].count;
          others =
            booking_sub_status['Others(specify)'] && booking_sub_status['Others(specify)'].count;
        }
        return (
          <div>
            {new_entity}
            {booking_sub_status && (
              <div style={{ color: 'green' }}>
                <p>{wikimapia > 0 && `Wikimapia : ${wikimapia}`}</p>
                <p>{google > 0 && `Google : ${google}`}</p>
                <p>{acres > 0 && `99 Acres : ${acres}`}</p>
                <p>{magic_brick > 0 && `Magic Brick : ${magic_brick}`}</p>
                <p>{first_time_assigned > 0 && `First Time Assigned : ${first_time_assigned}`}</p>
                <p>{others > 0 && `Others : ${others}`}</p>
              </div>
            )}
          </div>
        );
      },
    },
    {
      dataField: 'Not Initiated',
      text: 'Not Initiated',
    },

    {
      dataField: 'Decision Pending',
      text: 'Decision Pending',
      formatter: (cell, row) => {
        const { booking_sub_status } = row;
        let decision_pending = row['Decision Pending'] || 0;
        let visit_required,
          call_required,
          negotiation_required,
          not_available,
          postponed,
          specific_occasion_only,
          others = 0;
        if (booking_sub_status) {
          visit_required =
            booking_sub_status['Visit Required'] && booking_sub_status['Visit Required'].count;
          call_required =
            booking_sub_status['Call Required'] && booking_sub_status['Call Required'].count;
          negotiation_required =
            booking_sub_status['Negotiation Required'] &&
            booking_sub_status['Negotiation Required'].count;
          not_available =
            booking_sub_status['Not Available'] && booking_sub_status['Not Available'].count;
          postponed = booking_sub_status['Postponed'] && booking_sub_status['Postponed'].count;
          specific_occasion_only =
            booking_sub_status['Specific Occasion Only'] &&
            booking_sub_status['Specific Occasion Only'].count;
          others =
            booking_sub_status['Others(specify)'] && booking_sub_status['Others(specify)'].count;
        }
        return (
          <div>
            {decision_pending}
            {booking_sub_status && (
              <div style={{ color: 'green' }}>
                <p>{visit_required > 0 && `Visit Required : ${visit_required}`}</p>
                <p>{call_required > 0 && `Call Required : ${call_required}`}</p>
                <p>
                  {negotiation_required > 0 && `Negotiation Required : ${negotiation_required}`}
                </p>
                <p>{not_available > 0 && `Not Available : ${not_available}`}</p>
                <p>{postponed > 0 && `Postponed : ${postponed}`}</p>
                <p>
                  {specific_occasion_only > 0 &&
                    `Specific Occasion Only: ${specific_occasion_only}`}
                </p>
                <p>{others > 0 && `Others : ${others}`}</p>
              </div>
            )}
          </div>
        );
      },
    },
    {
      dataField: 'Rejected',
      text: 'Rejected',
      formatter: (cell, row) => {
        const { booking_sub_status } = row;
        let rejected = row['Rejected'] || 0;
        let less_occupancy,
          less_children,
          under_builder,
          very_expensive,
          client_rejected,
          rejected_by_society,
          others = 0;
        if (booking_sub_status) {
          less_occupancy =
            booking_sub_status['Less occupancy'] && booking_sub_status['Less occupancy'].count;
          less_children =
            booking_sub_status['Less Children'] && booking_sub_status['Less Children'].count;
          under_builder =
            booking_sub_status['Under Builder'] && booking_sub_status['Under Builder'].count;
          very_expensive =
            booking_sub_status['Very Expensive'] && booking_sub_status['Very Expensive'].count;
          client_rejected =
            booking_sub_status['Client Rejected'] && booking_sub_status['Client Rejected'].count;
          rejected_by_society =
            booking_sub_status['Rejected by Society'] &&
            booking_sub_status['Rejected by Society'].count;
          others =
            booking_sub_status['Others(specify)'] && booking_sub_status['Others(specify)'].count;
        }
        return (
          <div>
            {rejected}{' '}
            {booking_sub_status && (
              <div style={{ color: 'green' }}>
                <p>{less_occupancy > 0 && `Less Occupancy : ${less_occupancy}`}</p>
                <p>{less_children > 0 && `Less Children : ${less_children}`}</p>
                <p>{under_builder > 0 && `Under Builder : ${under_builder}`}</p>
                <p>{very_expensive > 0 && `Very Expensive : ${very_expensive}`}</p>
                <p>{client_rejected > 0 && `Client Rejected : ${client_rejected}`}</p>
                <p>{rejected_by_society > 0 && `Rejected By Society : ${rejected_by_society}`}</p>
                <p>{others > 0 && `Others : ${others}`}</p>
              </div>
            )}
          </div>
        );
      },
    },

    {
      dataField: 'Meeting Fixed',
      text: 'Meeting Fixed',
      formatter: (cell, row) => {
        const { booking_sub_status } = row;
        let meeting_fixed = row['Meeting Fixed'] || 0;
        let meeting_with_agm,
          meeting_with_secratory,
          meeting_with_chairman,
          meeting_with_treasurer,
          meeting_with_other = 0;
        if (booking_sub_status) {
          meeting_with_agm =
            booking_sub_status['Meeting with AGM'] && booking_sub_status['Meeting with AGM'].count;
          meeting_with_secratory =
            booking_sub_status['Meeting with Secretory'] &&
            booking_sub_status['Meeting with Secretory'].count;
          meeting_with_chairman =
            booking_sub_status['Meeting with Chairman'] &&
            booking_sub_status['Meeting with Chairman'].count;
          meeting_with_treasurer =
            booking_sub_status['Meeting with Treasurer'] &&
            booking_sub_status['Meeting with Treasurer'].count;
          meeting_with_other =
            booking_sub_status['Meeting with Other'] &&
            booking_sub_status['Meeting with Other'].count;
        }
        return (
          <div>
            {meeting_fixed}{' '}
            {booking_sub_status && (
              <div style={{ color: 'green' }}>
                <p>{meeting_with_agm > 0 && `Meeting with AGM : ${meeting_with_agm}`}</p>
                <p>
                  {meeting_with_secratory > 0 &&
                    `Meeting with Secretory : ${meeting_with_secratory}`}
                </p>
                <p>
                  {meeting_with_chairman > 0 && `Meeting with Chairman : ${meeting_with_chairman}`}
                </p>
                <p>
                  {meeting_with_treasurer > 0 &&
                    `Meeting with Treasurer : ${meeting_with_treasurer}`}
                </p>
                <p>{meeting_with_other > 0 && `Meeting with Other : ${meeting_with_other}`}</p>
              </div>
            )}
          </div>
        );
      },
    },

    {
      dataField: 'completed',
      text: 'Meeting Completed',
    },
  ];
};

export default getBtobCampaignSummaryColumn;
