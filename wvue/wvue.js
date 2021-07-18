function defineReactive(obj,key,val){
    // 
    //如果val本身还是一个对象,则需要递归处理
    observe(val)

    //创建一个Dep实例和key对应
    const dep = new Dep();

    Object.defineProperty(obj,key,{
        get(){
            console.log('get',key);

            //依赖收集
            Dep.target && dep.addDep(Dep.target)
            return val;
        },
        set(v){
            if(v!=val){
                
                //如果传入val是一个对象,则仍然需要一个响应式处理
                observe(v);

                val=v;
                console.log('set',key);

                //update()
                // watchers.forEach(w=>{w.update()})
                dep.notify();
            }
        }
    })
}

function observe(obj){
    //判断obj的值,必须是Object
    if(typeof obj !=='object' || obj == null){
        return obj;
    }
    Object.keys(obj).forEach((key)=>defineReactive(obj,key,obj[key]))
}


function proxy(vm){
    Object.keys(vm.$data).forEach(key=>{
        Object.defineProperty(vm,key,{
            get(){
                return vm.$data[key]
            },
            set(v){
                vm.$data[key] = v
            }
        })
    })
}

//
class WVue {
    constructor(options){
        //1.保存选项
        this.$options = options
        this.$data = options.data

        //2.对data选项做响应式处理
        observe(this.$data)

        //2.5代理
        proxy(this)

        //3.编译
        new Compile(options.el,this);
    }
}

class Compile {
    constructor(el,vm){
        //保存WVue 实例
        this.$vm = vm

        //编译模板树
        this.compile(document.querySelector(el))
    }

    //el模板根节点
    compile(el){
        //遍历el
        //1.获取el所有子节点
        el.childNodes.forEach((node)=>{
            //2.判断node类型
            if(node.nodeType===1){
                //元素
                console.log('element',node.nodeName);
                this.compileElement(node);
                //递归
                if(node.childNodes.length>0){
                    this.compile(node)
                }
            } else if(this.isInter(node)){
                //插值文本
                console.log('text',node.textContent);
                this.compileText(node);
                
            }
        })
    } 

    compileText(node){
        this.update(node,RegExp.$1,"text");
    }

    textUpdater(node,val){
        node.textContent = val;
    }

    //统一做初始化和更新处理
    update(node,exp,dir){
        //初始化
        const fn = this[dir+"Updater"];
        fn && fn(node,this.$vm[exp]);

        //更新
        new Watcher(this.$vm,exp,function(val){
            fn && fn(node,val)
        })
    }

    compileHtml(node){
        this.update(node,RegExp.$1,"html");
    }
    htmlUpdater(node,val){
        node.innerHTML = val;
    }
    //编译element
    compileElement(node){
        //1.获取当前元素的所有属性,并判断他们是不是动态的
        const nodeAttrs = node.attributes
        Array.from(nodeAttrs).forEach(attr=>{
            console.log(attr);
            const attrName = attr.nodeName
            const exp = attr.value
            //判断attrName是否是指令或事件等动态
            if(attrName.startsWith('w-')){
                //指令
                //截取w-后面的部分,特殊处理
                const dir = attrName.substring(2)
                //判断是否存在指令处理函数,若存在则调用它
                this[dir]&&this[dir](node, exp);
            }
        })
    }

    //w-text
    text(node,exp){
        this.update(node,exp,'text')
    }
    //w-html
    html(node,exp){
        this.update(node,exp,"html")
    }

    isInter(node){
        return node.nodeType===3 && /\{\{(.*)\}\}/.test(node.textContent)
    }
}

// const watchers=[]
//负责具体更新任务的watcher
class Watcher{
    constructor(vm,key,updateFn){
        this.vm = vm
        this.key = key
        this.updateFn = updateFn

        // watchers.push(this)
        //触发依赖收集,存集当前实例的
        Dep.target = this;
        vm[key]
        Dep.target = null;
    }
    update(){
        this.updateFn.call(this.vm,this.vm[this.key])
    }
}

//和data中响应式key之间是一一对应关系
class Dep {
    constructor(){
        //保存关联的watcher实例
        this.deps = []
    }
    addDep(dep){
        this.deps.push(dep);
    }
    notify(){
        this.deps.forEach(dep=>{
            dep.update()
        })
    }
}