import request from '@/utils/request'

// 查询学员信息列表
export function listBStudent(query) {
  return request({
    url: '/basedata/bstudent/list',
    method: 'get',
    params: query
  })
}

// 查询学员详细
export function getBStudent(bstudentId) {
  return request({
    url: '/basedata/bstudent/' + bstudentId,
    method: 'get'
  })
}

//根据学号查询学员详细
export function getBStudentByNo(bstudentNo) {
  return request({
    url: '/basedata/bstudent/getStuByNo/'+bstudentNo,
    method: 'get'
  })
}

// 新增学员信息
export function addBStudent(data) {
   that.$refs.uploadxls.submit() // 提交时触发了before-upload函数
  return request({
    url: '/basedata/bstudent/create',
    method: 'post',
    data: data
  })
}

// 修改学员信息
export function updateBStudent(id,data) {
  return request({
    url: '/basedata/bstudent/update/' + id,
    method: 'put',
    data: data
  })
}

// 删除学员信息
export function delBStudent(id) {
  return request({
    url: '/basedata/bstudent/deleteByIds/' + id,
    method: 'delete'
  })
}

// 导出学员信息
export function exportBStudent(query) {
  return request({
    url: '/basedata/bstudent/export',
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

// 学员状态修改
export function changeBStudentStatus(bstudentId, status) {
  const params = {
    status
  }
  return request({
    url: '/basedata/bstudent/update/status/' + bstudentId,
    method: 'put',
    params: params
  })
}
