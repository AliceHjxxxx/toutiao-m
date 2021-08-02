// postcss配置文件

module.exports = {
    // 配置要使用的postcss插件
    plugins: {
        // 配置使用autoprefixer插件，作用：生成浏览器css样式规则前缀
        // VueCLI内部已经配置了autoprefixer插件
        //  所以又配置了一次，所以产生了冲突
        // autoprefixer: {
        //     browsers: ["Android >= 4.0", "iOS >= 8"]
        // },
        // 作用把px转为rem
        "postcss-pxtorem": {
            // lib-flexible的REM适配方案：把一行分为10份，每份就是十个
            // 所以rootValue应该设置为你的设计稿宽度的十分之一
            // 我们的设计稿是750，所以应该是750、10=75
            // 但是vant建议设置为37.5为什么？因为vant是基于375写的
            // 所以必须设置为37.5，唯一的缺点就是使用我们设计稿的尺寸都必须/2
            // 有没有更好的办法，解决兼容性问题？
            // 通过查阅文本，我们发现rootvalue支持两种类型：
            // 数字：固定的数值
            // 函数：可以动态处理返回
            // postCss-pxtorem会对每个CSS文件的时候都会来调用这个函数  它会把被处理的css文件相关信息通过参数传递给该
            rootValue({ file }) {
                console.log("处理的css文件：", file)
                return file.indexOf("vant") !== -1 ? 37.5 : 75
            },
            // 配置要转换的CSS属性
            // 表示所有，若改成head则只改变head标签的部分为rem
            propList: ["*"],
            // 配置不要转换的样式资源
            exclude: "github-markdown"
        }
    }
}