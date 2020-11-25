import request from '@/utils/request'

// 查询卫生扣分信息列表
export function listHygieneDeduct(query) {
  return request({
    url: '/sysset/hygienededuct/list',
    method: 'get',
    params: query
  })
}

// 查询卫生扣分详细
export function getHygieneDeduct(hygienedeductId) {
  return request({
    url: '/sysset/hygienededuct/' + hygienedeductId,
    method: 'get'
  })
}

// 新增卫生扣分信息
export function addHygieneDeduct(data) {
  return request({
    url: '/sysset/hygienededuct/create',
    method: 'post',
    data: data
  })
}

// 修改卫生扣分信息
export function updateHygieneDeduct(id,data) {
  return request({
    url: '/sysset/hygienededuct/update/' + id,
    method: 'put',
    data: data
  })
}

// 删除卫生扣分信息
export function delHygieneDeduct(id) {
  return request({
    url: '/sysset/hygienededuct/deleteByIds/' + id,
    method: 'delete'
  })
}

// 导出卫生扣分信息
export function exportHygieneDeduct(query) {
  return request({
    url: '/sysset/hygienededuct/export',
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

// 卫生扣分状态修改
export function changeHygieneDeductStatus(hygienedeductId, status) {
  const params = {
    status
  }
  return request({
    url: '/sysset/hygienededuct/update/status/' + hygienedeductId,
    method: 'put',
    params: params
  })
}

// 查询所有有效卫生扣分项列表
export function listAllHygieneDeduct() {
  return request({
    url: '/sysset/hygienededuct/listAll',
    method: 'get'
  })
}
