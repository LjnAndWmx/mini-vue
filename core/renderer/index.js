//n1 oldVnode
//n2 newVnode

export function diff(n1,n2){

    console.log(n1);
    console.log(n2);
    //1.tag
    if(n1.tag !== n2.tag){
        n1.el.replaceWith(document.createElement(n2.tag));
    }else{
        //小细节问题,调试时
        n2.el = n1.el;

        //2.props
        //new:{id:'foo',class:'bar',a}
        //old:{id:'foo',class:'bar',a,b}
        const {props: newProps} = n2;
        const {props: oldProps} = n1;
        if(newProps && oldProps){
            Object.keys(newProps).forEach(key=>{
                const newVal = newProps[key];
                const oldVal = oldProps[key];

                if(newVal!==oldVal){
                    n1.el.setAttribute(key,newVal);
                }
            })
        }

        if(oldProps){
            Object.keys(oldProps).forEach(key=>{
                if(!newProps[key]){
                    n1.el.removeAttribute(key);
                }
            })
        }
    }
    
    //3.children->暴力的解法
      //1.newChildren->String (oldChildren->String  oldChildren->Array)
      //2.newChildren->Array (oldChildren->String  oldChildren->Array)

      const { children:newChildren } = n2;
      const { children:oldChildren } = n1;

    if(newChildren === 'string'){
        if(oldChildren === 'string'){
            n2.el.textContent = newChildren;
        }else if(Array.isArray(oldChildren)){
            n2.el.textContent = newChildren;
        }
    }

    if(Array.isArray(newChildren)){
        if(typeof oldChildren === 'string'){
            n2.el.innerText = '';
            mountElement(n2,n2.el)
        }else if(Array.isArray(oldChildren)){

            const length = Math.min(newChildren,oldChildren);

            //处理公共的VNode
            for (let index = 0; index < length; index++) {
                const newVnode = newChildren[index];
                const oldVnode = oldChildren[index];
                diff(oldVnode,newVnode);
                
            }

            if(newChildren.length > length){
                //创建节点
                for (let index = 0; index < newChildren.length; index++) {
                    const newVnode = newChildren[index];
                    mountElement(newVnode);
                }
            }


            if(oldChildren.length>length){
                //删除节点
                for (let index = 0; index < oldChildren.length; index++) {
                    const oldVnode = oldChildren[index];
                    oldVnode.el.parent.removeChild(oldVnode.el)
                }
            }
        }
    }

}


//vdom -> dom

export function mountElement(vnode,container){
    const {tag,props,children} = vnode;

    //tag
    const el =(vnode.el = document.createElement(tag));

    //props
    if(props){
        for (const key in props) {
            const val = props[key];
            el.setAttribute(key,val)
        }
    }

    //children
    //1.它可以接收一个 string

    if(typeof children === "string"){
        const textNode = document.createTextNode(children);
        el.append(textNode);
    }else if(Array.isArray(children)){
        //2.它可以接收一个数组
        children.forEach(v => {
            mountElement(v,el);
        });

    }
    



    //插入
    container.append(el);

}