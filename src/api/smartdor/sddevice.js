import request from '@/utils/request'

// 查询设备信息列表
export function listSdDevice(query) {
  return request({
    url: '/smartdor/sddevice/list',
    method: 'get',
    params: query
  })
}

// 查询设备详细
export function getSdDevice(deviceId) {
  return request({
    url: '/smartdor/sddevice/info/' + deviceId,
    method: 'get',
  })
}

// 通过IP地址获取设备详细信息
export function getSdDeviceInfo() {
  return request({
    url: '/smartdor/sddevice/getinfo',
    method: 'get',
  })
}

// 新增设备信息
export function addSdDevice(data) {
  return request({
    url: '/smartdor/sddevice/create',
    method: 'post',
    data: data
  })
}

// 修改设备信息
export function updateSdDevice(id,data) {
  return request({
    url: '/smartdor/sddevice/update/' + id,
    method: 'put',
    data: data
  })
}

// 设备状态修改
export function changeSdDeviceStatus(sdDeviceId, status) {
  const params = {
    status
  }
  return request({
    url: '/smartdor/sddevice/update/status/' + sdDeviceId,
    method: 'put',
    params: params
  })
}


