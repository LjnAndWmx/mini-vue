//实现响应式
//闭包函数:函数包含函数并返回数据
function defineReactive(obj,key,val){
    // 
    //如果val本身还是一个对象,则需要递归处理
    observe(val)

    Object.defineProperty(obj,key,{
        get(){
            console.log('get',key);
            return val;
        },
        set(v){
            if(v!=val){
                
                //如果传入val是一个对象,则仍然需要一个响应式处理
                observe(v);

                val=v;
                console.log('set',key);
                //update()
            }
        }
    })
}
//对obj对象所有的key进行循环,对每个key的值做响应式拦截
function observe(obj){
    //判断obj的值,必须是Object
    if(typeof obj !=='object' || obj == null){
        return obj;
    }
    Object.keys(obj).forEach((key)=>defineReactive(obj,key,obj[key]))
}

function set(obj,key,val){
    defineReactive(obj,key,val)
}

const obj={
    foo:'foo',
    bar:'bar',
    baz:{
        a:'a'
    }
}

defineReactive(obj,'foo','foooo');
observe(obj);
obj.foo
obj.foo = 'fooo'
obj.baz
obj.baz.a


set(obj,'dong','dong')
obj.dong;
