import{d,u as p,y as _,a as k,z as f,r as x,o as r,c as i,e,t as o,f as t,F as b,A as h,B as v,b as y,w as N,C}from"./app-W2DrManX.js";import{u as w}from"./user-How-uFhE.js";const B=e("div",{"text-4xl":""},[e("div",{"i-carbon-pedestrian":"","inline-block":""})],-1),R={"text-sm":"","opacity-75":""},V={key:0,"mt-4":"","text-sm":""},g={"opacity-75":""},$=d({__name:"[name]",setup(L){const c=p(),l=_(),n=w(),{t:s}=k();return f(()=>{n.setNewName(l.params.name)}),(E,u)=>{const m=x("RouterLink");return r(),i("div",null,[B,e("p",null,o(t(s)("intro.hi",{name:t(n).savedName})),1),e("p",R,[e("em",null,o(t(s)("intro.dynamic-route")),1)]),t(n).otherNames.length?(r(),i("p",V,[e("span",g,o(t(s)("intro.aka"))+":",1),e("ul",null,[(r(!0),i(b,null,h(t(n).otherNames,a=>(r(),i("li",{key:a},[y(m,{to:`/hi/${a}`,replace:""},{default:N(()=>[C(o(a),1)]),_:2},1032,["to"])]))),128))])])):v("",!0),e("div",null,[e("button",{m:"3 t6","text-sm":"",btn:"",onClick:u[0]||(u[0]=a=>t(c).back())},o(t(s)("button.back")),1)])])}}});export{$ as default};