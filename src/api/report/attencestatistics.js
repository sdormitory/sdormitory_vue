import request from '@/utils/request'

// 查询正常出勤率统计列表
export function listAttenceStatistics(query) {
  return request({
    url: '/report/attencestatistics/list',
    method: 'get',
    params: query
  })
}