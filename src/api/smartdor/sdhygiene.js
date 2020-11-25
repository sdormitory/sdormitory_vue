import request from '@/utils/request'

// 查询卫生信息列表
export function listSdHygiene(query) {
  return request({
    url: '/smartdor/sdhygiene/list',
    method: 'get',
    params: query
  })
}

// 查询卫生详细
export function getSdHygiene(bclassId) {
  return request({
    url: '/smartdor/sdhygiene/' + bclassId,
    method: 'get'
  })
}

// 新增卫生信息
export function addSdHygiene(data) {
  return request({
    url: '/smartdor/sdhygiene/create',
    method: 'post',
    data: data
  })
}

// 修改卫生信息
export function updateSdHygiene(id,data) {
  return request({
    url: '/smartdor/sdhygiene/update/' + id,
    method: 'put',
    data: data
  })
}

// 删除卫生信息
export function delSdHygiene(id) {
  return request({
    url: '/smartdor/sdhygiene/deleteByIds/' + id,
    method: 'delete'
  })
}

// 导出卫生信息
export function exportSdHygiene(query) {
  return request({
    url: '/smartdor/sdhygiene/export',
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
