import request from '@/utils/request'

// 特殊情况调用开闸接口
export function AIOpen(query) {
  return request({
    url: '/smartdor/aidevice/aiopen',
    method: 'get',
    params: query
  })
}
