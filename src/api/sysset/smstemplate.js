import request from '@/utils/request'

// 查询短信模板信息列表
export function listSmsTemplate(query) {
  return request({
    url: '/sysset/smstemplate/list',
    method: 'get',
    params: query
  })
}

// 查询短信模板详细
export function getSmsTemplate(smstemplateId) {
  return request({
    url: '/sysset/smstemplate/' + smstemplateId,
    method: 'get'
  })
}

// 新增短信模板信息
export function addSmsTemplate(data) {
  return request({
    url: '/sysset/smstemplate/create',
    method: 'post',
    data: data
  })
}

// 修改短信模板信息
export function updateSmsTemplate(id,data) {
  return request({
    url: '/sysset/smstemplate/update/' + id,
    method: 'put',
    data: data
  })
}

// 删除短信模板信息
export function delSmsTemplate(id) {
  return request({
    url: '/sysset/smstemplate/deleteByIds/' + id,
    method: 'delete'
  })
}

// 导出短信模板信息
export function exportSmsTemplate(query) {
  return request({
    url: '/sysset/smstemplate/export',
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

// 短信模板状态修改
export function changeSmsTemplateStatus(smstemplateId, status) {
  const params = {
    status
  }
  return request({
    url: '/sysset/smstemplate/update/status/' + smstemplateId,
    method: 'put',
    params: params
  })
}
