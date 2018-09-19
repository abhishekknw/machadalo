import request from 'superagent';

import * as types from './types';

import config from './../config';

export function postChecklistTemplateStart() {
  return {
    type: types.POST_CHECKLIST_TEMPLATE_START
  };
}

export function postChecklistTemplateSuccess() {
  return {
    type: types.POST_CHECKLIST_TEMPLATE_SUCCESS
  };
}

export function postChecklistTemplateFail() {
  return {
    type: types.POST_CHECKLIST_TEMPLATE_FAIL
  };
}

export function postChecklistTemplate({ campaignId, data }) {
  return (dispatch, getState) => {
    dispatch(postChecklistTemplateStart());

    const { auth } = getState();

    request
      .post(`${config.API_URL}/v0/ui/checklists/BYJMAC1394/create`)
      .set('Authorization', `JWT ${auth.token}`)
      .send(data)
      .then(resp => {
        dispatch(postChecklistTemplateSuccess());
      })
      .catch(ex => {
        console.log('Failed to create checklist template', ex);

        dispatch(postChecklistTemplateFail());
      });
  };
}

export function getSupplierChecklistsStart() {
  return {
    type: types.GET_SUPPLIER_CHECKLISTS_START
  };
}

export function getSupplierChecklistsSuccess({ checklists }) {
  return {
    type: types.GET_SUPPLIER_CHECKLISTS_SUCCESS,
    checklists
  };
}

export function getSupplierChecklistsFail() {
  return {
    type: types.GET_SUPPLIER_CHECKLISTS_FAIL
  };
}

export function getSupplierChecklists({ campaignId, supplierId }) {
  return (dispatch, getState) => {
    dispatch(getSupplierChecklistsStart());

    const { auth } = getState();

    request
      .get(
        `${
          config.API_URL
        }/v0/ui/checklists/${campaignId}/list_supplier_checklists/${supplierId}`
      )
      .set('Authorization', `JWT ${auth.token}`)
      .then(resp => {
        dispatch(getSupplierChecklistsSuccess({ checklists: resp.body.data }));
      })
      .catch(ex => {
        console.log('Failed to fetch supplier checklists', ex);

        dispatch(getSupplierChecklistsFail());
      });
  };
}
