import request from '@/utils/request'

// 查询考勤规则信息列表
export function listAttenceRule(query) {
  return request({
    url: '/sysset/attencerule/list',
    method: 'get',
    params: query
  })
}

// 查询考勤规则详细
export function getAttenceRule(attenceruleId) {
  return request({
    url: '/sysset/attencerule/' + attenceruleId,
    method: 'get'
  })
}

// 新增考勤规则信息
export function addAttenceRule(data) {
  return request({
    url: '/sysset/attencerule/create',
    method: 'post',
    data: data
  })
}

// 修改考勤规则信息
export function updateAttenceRule(id,data) {
  return request({
    url: '/sysset/attencerule/update/' + id,
    method: 'put',
    data: data
  })
}

// 删除考勤规则信息
export function delAttenceRule(id) {
  return request({
    url: '/sysset/attencerule/deleteByIds/' + id,
    method: 'delete'
  })
}

// 导出考勤规则信息
export function exportAttenceRule(query) {
  return request({
    url: '/sysset/attencerule/export',
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

// 考勤规则状态修改
export function changeAttenceRuleStatus(attenceruleId, status) {
  const params = {
    status
  }
  return request({
    url: '/sysset/attencerule/update/status/' + attenceruleId,
    method: 'put',
    params: params
  })
}

// 查询所有有效考勤规则列表
export function listAllAttenceRule() {
  return request({
    url: '/sysset/attencerule/listAll',
    method: 'get'
  })
}
