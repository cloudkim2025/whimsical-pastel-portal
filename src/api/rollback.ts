// rollback.ts

import axios from 'axios';

export const rollbackAPI = {
  getRefundFailures: (page: number, size: number) =>
    axios.get('/admin/refund/fail', { params: { page, size } }),

  getCancelFailures: (page: number, size: number) =>
    axios.get('/admin/cancel/fail', { params: { page, size } }),

  getVerificationFailures: (page: number, size: number) =>
    axios.get('/admin/verify/fail', { params: { page, size } }),

  forceRefund: (id: number) =>
    axios.post(`/admin/force/refund/${id}`),

  forceCancel: (purchaseId: number) =>
    axios.post(`/admin/force/cancel/${purchaseId}`),

  retryVerification: (id: number) =>
    axios.post(`/admin/retry/verify/${id}`),
};
