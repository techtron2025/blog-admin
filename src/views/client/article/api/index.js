import _http from '@/utils/http'

export default {
    labelList(params, loading, headers) {
        return _http('post', {url: '/api/admin/label/list', apiName: '标签列表'}, params, loading, headers)
    },
    classifyList(params, loading, headers) {
        return _http('post', {url: '/api/admin/classify/list', apiName: '分类列表'}, params, loading, headers)
    },
    articleList(params, loading, headers) {
        return _http('post', {url: '/blog/list', apiName: '博文列表'}, params, loading, headers)
    },
    articleAdd(params, loading, headers) {
        return _http('post', {url: '/blog/add', apiName: '新增博文'}, params, loading, headers)
    },
    articleEdit(params, loading, headers) {
        return _http('post', {url: '/api/admin/article/edit', apiName: '修改博文'}, params, loading, headers)
    },
    articleDetail(params, loading, headers) {
        return _http('post', {url: '/blog/detail', apiName: '博文详情'}, params, loading, headers)
    },
    articleDel(params, loading, headers) {
        return _http('post', {url: '/blog/delete', apiName: '删除博文'}, params, loading, headers)
    },
    upload(params, loading, headers) {
        return _http('post', {url: '/api/common/upload/single', apiName: '图片上传'}, params, loading, headers)
    },
}
