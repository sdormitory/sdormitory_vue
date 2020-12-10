import request from '@/utils/request'

// 查询考勤信息列表
export function listsdattence(query) {
  return request({
    url: '/smartdor/sdAttence/list',
    method: 'get',
    params: query
  })
}



// 删除考勤信息
export function delSdattence(id) {
  return request({
    url: '/smartdor/sdAttence/deleteByIds/' + id,
    method: 'delete'
  })
}

// 查询缺勤学生信息列表
export function getListAbsenceStudent(query) {
  return request({
    url: '/smartdor/sdAttence/listAbsenceStudent',
    method: 'get',
    params: query
  })
}

// 查询宿舍考勤信息列表
export function getListAbsenceDormitory(query) {
  return request({
    url: '/smartdor/sdAttence/listAbsenceDormitory',
    method: 'get',
    params: query
  })
}


