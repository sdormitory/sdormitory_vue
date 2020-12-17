import request from '@/utils/request'

// 查询请假列表
export function listSdLeave(query) {
  return request({
    url: '/smartdor/sdleave/list',
    method: 'get',
    params: query
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/smartdor/sdleave/importTemplate',
    responseType:'blob',
    method: 'get'
  })
}

// 查询请假详细
export function getSdLeave(sdleaveId) {
  return request({
    url: '/smartdor/sdleave/' + sdleaveId,
    method: 'get'
  })
}


// 导出请假信息
export function exportSdLeave(query) {
  return request({
    url: '/smartdor/sdleave/export',
    method: 'get',
    params: query
  })
}

// 获取字典选择框列表
export function optionselect() {
  return request({
    url: '/basedata/dict/optionselect',
    method: 'get'
  })
}

// 审核请假信息
export function approveStatus(sdleaveId, status) {
  const params = {
    status
  }
  return request({
    url: '/smartdor/sdleave/update/approvestatus/' + sdleaveId,
    method: 'put',
    params: params
  })
}

// 驳回请假信息
export function reject(id,data) {
  return request({
    url: '/smartdor/sdleave/reject/' + id,
    method: 'put',
    data: data
  })
}
