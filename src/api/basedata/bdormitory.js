import request from '@/utils/request'

// 查询宿舍信息列表
export function listBDormitory(query) {
  return request({
    url: '/basedata/bdormitory/list',
    method: 'get',
    params: query
  })
}

// 查询宿舍详细
export function getBDormitory(bdormitoryId) {
  return request({
    url: '/basedata/bdormitory/' + bdormitoryId,
    method: 'get'
  })
}

// 新增宿舍信息
export function addBDormitory(data) {
  return request({
    url: '/basedata/bdormitory/create',
    method: 'post',
    data: data
  })
}

// 修改宿舍信息
export function updateBDormitory(id,data) {
  return request({
    url: '/basedata/bdormitory/update/' + id,
    method: 'put',
    data: data
  })
}

// 删除宿舍信息
export function delBDormitory(id) {
  return request({
    url: '/basedata/bdormitory/deleteByIds/' + id,
    method: 'delete'
  })
}

// 导出宿舍信息
export function exportBDormitory(query) {
  return request({
    url: '/basedata/bdormitory/export',
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

// 宿舍状态修改
export function changeBDormitoryStatus(bdormitoryId, status) {
  const params = {
    status
  }
  return request({
    url: '/basedata/bdormitory/update/status/' + bdormitoryId,
    method: 'put',
    params: params
  })
}

// 查询所有宿舍列表
export function listAllBDormitory() {
  return request({
    url: '/basedata/bdormitory/listAll',
    method: 'get'
  })
}

// 根据宿舍栋号和楼层查询宿舍信息
export function getBDormitoryListByCol(buildingNo,storey) {
  const params = {
    buildingNo,
    storey
  }
  return request({
    url: '/basedata/bdormitory/getBDormitoryListByCol',
    method: 'get',
    params: params
  })
}
