import request from '@/utils/request'

// 查询班级信息列表
export function listBClass(query) {
  return request({
    url: '/basedata/bclass/list',
    method: 'get',
    params: query
  })
}

// 查询班级详细
export function getBClass(bclassId) {
  return request({
    url: '/basedata/bclass/' + bclassId,
    method: 'get'
  })
}

// 新增班级信息
export function addBClass(data) {
  return request({
    url: '/basedata/bclass/create',
    method: 'post',
    data: data
  })
}

// 修改班级信息
export function updateBClass(id,data) {
  return request({
    url: '/basedata/bclass/update/' + id,
    method: 'put',
    data: data
  })
}

// 删除班级信息
export function delBClass(id) {
  return request({
    url: '/basedata/bclass/deleteByIds/' + id,
    method: 'delete'
  })
}

// 导出班级信息
export function exportBClass(query) {
  return request({
    url: '/basedata/bclass/export',
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

// 班级状态修改
export function changeBClassStatus(bclassId, status) {
  const params = {
    status
  }
  return request({
    url: '/basedata/bclass/update/status/' + bclassId,
    method: 'put',
    params: params
  })
}

// 查询所有有效班级列表
export function listAllBClass() {
  return request({
    url: '/basedata/bclass/listAll',
    method: 'get'
  })
}
