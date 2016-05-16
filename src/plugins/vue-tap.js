(function() {
    var vueTap = {}
    vueTap.install = function(Vue) {
        Vue.directive('tap', {
            isFn : true,
            acceptStatement : true,
            update : function(fn) {
                var that = this
                    that.tapObj = {}
                if(typeof fn !== 'function') {
                    return console.error('The param of directive "v-tap" must be a function!')
                }
                that.handler = function(e) { //This directive.handler
                    e.tapObj = that.tapObj
                    fn.call(that,e)
                };
                if(that.isPC()) {
                    that.el.addEventListener('click',function(e) {
                        fn.call(that,e)
                    },false)
                } else {
                    this.el.addEventListener('touchstart',function(e) {
                        fn.call(that,e)
                    },false)

                    // this.el.addEventListener('touchstart',function(e) {
                    //     if(that.modifiers.prevent)
                    //         e.preventDefault()
                    //     if(that.modifiers.stop)
                    //         e.stopPropagation()
                    //     that.touchstart(e,that)
                    // },false)
                    // this.el.addEventListener('touchend',function(e) {
                    //     that.touchend(e,that,fn)
                    // },false)
                }
            },
            isTap : function() {
                var tapObj = this.tapObj;
                return this.time < 150 && Math.abs(tapObj.distanceX) < 2 && Math.abs(tapObj.distanceY) < 2
            },
            isPC : function() {
                var uaInfo = navigator.userAgent;
                var agents = ["Android", "iPhone", "Windows Phone", "iPad", "iPod"];
                var flag = true;
                for (var i = 0; i < agents.length; i++) {
                    if (uaInfo.indexOf(agents[i]) > 0) { 
                        flag = false
                        break
                    }
                }
                return flag
            },
            touchstart : function(e,that) {
                e.preventDefault()
                var touches = e.touches[0]
                var tapObj = that.tapObj
                tapObj.pageX = touches.pageX
                tapObj.pageY = touches.pageY
                tapObj.clientX = touches.clientX
                tapObj.clientY = touches.clientY
                that.time = +new Date()
            },
            touchend : function(e,that) {
                var touches = e.changedTouches[0]
                var tapObj = that.tapObj
                that.time = +new Date() - that.time
                tapObj.distanceX = tapObj.pageX - touches.pageX
                tapObj.distanceY = tapObj.pageY - touches.pageY
                if (that.isTap(tapObj)){
                    that.handler(e)
                }
            }
        })
    }

    if (typeof exports == "object") {
        module.exports = vueTap
    } else if (typeof define == "function" && define.amd) {
        define([], function(){ return vueTap })
    } else if (window.Vue) {
        window.vueTap = vueTap
        Vue.use(vueTap)
    }
})()