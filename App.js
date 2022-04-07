// const { effect ,reactive } = require("@vue/reactivity");

// const {effectWatch,reactive} = require("./core/reactivity/index.js");

import {effectWatch,reactive} from './core/reactivity/index.js';
import {h} from './core/h.js';
 
//vue3

//a 发生变更了,我想让b 自动更新
//声明一个响应式对象
//ref ->number  单值类型
let a = reactive({
    value:1,
});
let b;
effectWatch(()=>{
    b  = a.value +10;
    console.log(b);
})

//a响应式对象的值发生改变之后
a.value = 10;


//vue3

export default {
    render(context){
        //构建 view = b
        
        //1. effectWatch(() => {
            //view ->每次我都需要重新的创建

            // reset
            // document.body.innerHTML = '';
            // const div = document.createElement("div");
            // div.innerText = context.state.count;

            //root
            // document.body.append(div);
        // });

        // 2.封装
            // const div = document.createElement("div");
            // div.innerText = context.state.count;
            // return div;

            //3.h();
            //要计算出最小的更新 ->vdom
            //js->diff
            //reset
            //tag
            //props
            //children
            return h("div",
            {
                id:'app-'+context.state.count,
                class:'showTim'
            },
            String(context.state.count)
            );



    },
    setup(){
        //a = 响应式数据
        const state = reactive({
            count:0,
        });
        window.state = state;
        return {state};
    },

}

// App.render(App.setup());