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


