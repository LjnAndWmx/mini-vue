//响应式库


let currentEffect;
//依赖
class Dep {
    constructor(val) {
        this.effects = new Set();
        this._val = val;
    }

    get value() {
        this.depend();
        return this._val;
    }

    set value(newVal) {
        this._val = newVal;
        this.notice();
    }
    //1.收集依赖
    depend() {
        if (currentEffect) {
            this.effects.add(currentEffect);
        }
    }

    //2.触发依赖
    notice() {
        //触发一下我们之前收集的依赖
        this.effects.forEach(effect => {
            effect();
        })
    }
}


export function effectWatch(effect) {
    //收集依赖
    currentEffect = effect;
    effect();
    // dep.depend();
    currentEffect = null;
}

// const dep = new Dep(10);

// var b;

// effectWatch(() => {
//     b = dep.value + 10;
//     console.log(b)
// })

// dep.value = 20;
// dep.notice();


//================================
//reactive
//dep ->number string
//object =>key ->dep


//1.这个对象在什么时候改变的
//object.a ->get
//object.a = 1 -> set

//vue2
//proxy

const targetMap = new Map();

function getDep(target, key) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Dep();
        depsMap.set(key, dep);
    }

    return dep;
}

export function reactive(raw) {
    return new Proxy(raw, {
        get(target, key) {
            //key -dep
            //dep 我们存储在哪里
            // let depsMap = targetMap.get(target);
            // if(!depsMap){
            //     depsMap = new Map();
            //     targetMap.set(target,depsMap);
            // }
            // let dep = depsMap.get(key);
            // if(!dep){
            //     dep = new Dep();
            //     depsMap.set(key,dep);
            // }
            const dep = getDep(target, key);
            //依赖收集
            dep.depend();

            return Reflect.get(target, key);
        },
        set(target, key, value) {
            //触发依赖
            //要获取到dep
            const dep = getDep(target, key);
            const result = Reflect.set(target, key, value)
            // dep.notice(result);
            dep.notice();
            return result;
        }
    })
}

// const user = reactive({
//     age: 19,
// })

// let double;
// effectWatch(()=>{
//     console.log('===reative===');
//     double = user.age;
//     console.log(double);
// })

// user.age = 20;