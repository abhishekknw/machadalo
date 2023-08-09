import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { useFetchWrapper } from '../../_helpers/fetch-wrapper';
import { Apis, Labels } from '../../app.constants';
import { useAlertActions } from '../alert.actions';
import { CampaignInventoryAtom, HeaderDataListAtom, OrganisationListAtom, UserMinimalListAtom } from '../../_states';
import { errorAtom } from '../../_states/alert';

const BookinPlanActions = () => {
    const fetchWrapper = useFetchWrapper();
    const alertActions = useAlertActions();
    const setCampaignInventory = useSetRecoilState(CampaignInventoryAtom);
    const setHeaderDataList = useSetRecoilState(HeaderDataListAtom);
    const setOrganisationList = useSetRecoilState(OrganisationListAtom);
    const setUserMinimalList = useSetRecoilState(UserMinimalListAtom);


    const getCampaignInventories = (data) => {
        let params = 'page=' + (data.pageNo + 1) + "&supplier_type_code=" + data.supplierCode;
        return fetchWrapper.get(`v0/ui/website/HDFHDF0789/campaign-inventories/?${params}`).then((res) => {
            setCampaignInventory(res.data)
        });
    };

    const getHeaderData = (data) => {
        // let params = "?next_page=" + data.pageNo + '&search=' + data.search;
        return fetchWrapper.get(`${Apis.Get_Header_Data}`).then((res) => {
            setHeaderDataList(res.data);
            return res.data.ALL;
        });
    };
    const getRelationShipData = (data) => {
        let params = "supplier_id=" + data.object_id + "&supplier_code=" + data.supplier_code + "&campaign_id=" + data.proposal;
        return fetchWrapper.get(`${Apis.Get_Relationship_Data}${params}`).then((res) => {
            return res.data;
        });
    };

    const getContactDetailsData = (data) => {
        let params = "supplier_id=" + data?.object_id;
        return fetchWrapper.get(`${Apis.Get_Contact_Details}${params}`).then((res) => {
            return res.data;
        });
    };

    const getCommetByShortlistedId = (data, type) => {
        let params = `shortlisted_spaces_id=${data?.id}&related_to=${type === "externalComments" ? "EXTERNAL" : "INTERNAL"}`
        return fetchWrapper.get(`v0/ui/website/${data?.proposal}/comment/?${params}`).then((res) => {
            return res.data.general;
        });
    }
    const postCommentByShortlistedId = (data) => {
        return fetchWrapper.post(`v0/ui/website/HDFHDF0789/comment/`, data).then((res) => {
            if (res.status) {
                alertActions.success(res.data);
            }
            else {
                alertActions.error(res.data);
            }
        });
    }

    const getOrganisationList = (id) => {
        return fetchWrapper.get(`${Apis.Get_Organisation_List}`).then((res) => {
            if (res.status) {
                let newList = res.data.map(item => ({ ...item, label: item?.name, value: item?.organisation_id }));
                setOrganisationList(newList);
            }
            else {
                alertActions.error(Labels.Error);
            }
        });
    }
    const postBrandAssignment = (data) => {
        return fetchWrapper.post(`${Apis.Post_Brand_Assignment}`, data).then((res) => {
            if (res.status) {
                alertActions.success("Assigned successfully");
            }
            else {
                alertActions.error(Labels.Error);
            }
        });
    }

    const getUserMinimalList = () => {
        return fetchWrapper.get(`${Apis.Get_User_Minimal_List}`).then((res) => {
            if (res.status) {
                let newList = res.data.map(item => ({ ...item, label: item?.username, value: item?.id }));
                setUserMinimalList(newList)
            }
            else {
                alertActions.error(Labels.Error);
            }
        });
    }

    return {
        getCampaignInventories,
        getHeaderData,
        getRelationShipData,
        getContactDetailsData,
        getCommetByShortlistedId,
        postCommentByShortlistedId,
        getOrganisationList,
        getUserMinimalList,
        postBrandAssignment,
    };
}
export { BookinPlanActions };