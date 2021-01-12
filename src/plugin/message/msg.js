import { Message } from "element-ui"

export default {
    install(Vue, options) {
        Vue.prototype.msgSuccess = function (text) {
            Message({
                message: text,
                type: 'success',
                duration: 5 * 1000
            })
        }
        Vue.prototype.msgError = function (text) {
            Message({
                message: text,
                type: 'error',
                duration: 5 * 1000
            })
        },
        Vue.prototype.msgInfo = function (text) {
            Message({
                message: text,
                type: 'info',
                duration: 5 * 1000
            })
        }
    },
}