import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';
import { useFetchWrapper } from '../_helpers/fetch-wrapper';
import {
  currentCampaign,
  campaignLeads,
  viewLeadFilters,
  errorAtom,
  campaignCitylist,
} from '../_state';
import { Apis } from '../request';
import { useAlertActions } from '../_actions/alert.actions';
import dayjs from 'dayjs';

const LeadDetailActions = () => {
  const fetchWrapper = useFetchWrapper();
  const setCurrentCampaign = useSetRecoilState(currentCampaign);
  const [viewLeads, setViewLeads] = useRecoilState(campaignLeads);
  const [error, setError] = useRecoilState(errorAtom);
  const filters = useRecoilValue(viewLeadFilters);
  const setCampaignCitylist = useSetRecoilState(campaignCitylist);
  const alertActions = useAlertActions();

  const CurrentCampaignList = (data) => {
    let parmas = '?lead_type=' + data?.lead_type + '&supplier_code=' + data?.supplier_type;
    // '?lead_type=Leads&user_type=undefined&tabname=undefined&supplier_code=all'
    return fetchWrapper.get(`${Apis.currentCampaign}/${parmas}`).then((res) => {
      const { data } = res;
      setCurrentCampaign(data);
    });
  };

  const campaignViewLeads = (data) => {
    let params =
      '?campaign_id=' +
      data?.campaign_id +
      '&lead_type=' +
      data?.lead_type +
      '&supplier_code=' +
      data?.supplier_type +
      '&next_page=' +
      data.next_page;
    if (data?.start_date && data?.end_date) {
      params +=
        '&start_date=' +
        dayjs(data.start_date).format('DD-MM-YYYY') +
        '&end_date=' +
        dayjs(data.end_date).format('DD-MM-YYYY');
    }
    if (data?.start_acceptance_date && data?.end_acceptance_date) {
      params +=
        '&start_acceptance_date=' +
        dayjs(data.start_acceptance_date).format('DD-MM-YYYY') +
        '&end_acceptance_date=' +
        dayjs(data.end_acceptance_date).format('DD-MM-YYYY');
    }
    if (data?.start_update_date && data?.end_update_date) {
      params +=
        '&start_update_date=' +
        dayjs(data.start_update_date).format('DD-MM-YYYY') +
        '&end_update_date=' +
        dayjs(data.end_update_date).format('DD-MM-YYYY');
    }
    if (data?.city) {
      params += '&city=' + data.city;
    }
    if (data?.client_status) {
      params += '&client_status=' + data.client_status;
    }
    if (data?.search) {
      params += '&search=' + data.search;
    }

    return fetchWrapper.get(`${Apis.campaignViewLeads}/${params}`).then((res) => {
      setViewLeads(res.data);
    });
  };

  const sendEmails = (data) => {
    let params =
      '?emails=' +
      data?.emails +
      '&campaign_id=' +
      data?.campaign_id +
      '&Client_Status=' +
      data?.status +
      '&tabname=' +
      filters?.tabname;
    '&supplier_code=' + filters?.supplier_type;
    '&lead_type=' + filters?.lead_type;
    return fetchWrapper.get(`${Apis.sendEmails}/${params}`).then((res) => {
      if (res.status) {
        alertActions.success(res.data);
        setError(false);
      } else {
        alertActions.error('something went wrong');
      }
    });
  };

  const detailUpdateClientStatus = (data) => {
    let update = data;
    return fetchWrapper.post(`${Apis.updateClientStatus}/`, { data: data }).then((res) => {
      if (res.status) {
        alertActions.success(res.data);
      } else {
        alertActions.error(res.data);
      }
    });
  };

  const getCampaignCityList = (data) => {
    let param = '?campaign_id=' + data.campaign_id;
    return fetchWrapper.get(`${Apis.getCampaignCityList}/${param}`).then((res) => {
      if (res.status) {
        setCampaignCitylist(res.data);
      } else {
        alertActions.error(res.data);
      }
    });
  };

  return {
    CurrentCampaignList,
    campaignViewLeads,
    sendEmails,
    detailUpdateClientStatus,
    getCampaignCityList,
  };
};
export { LeadDetailActions };
