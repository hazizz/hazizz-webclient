(this["webpackJsonphazizz-webclient"]=this["webpackJsonphazizz-webclient"]||[]).push([[0],{43:function(e,t,n){e.exports=n.p+"static/media/logo.13001b87.png"},44:function(e,t,n){e.exports=n(73)},72:function(e,t,n){},73:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(18),c=n.n(o),s=n(22),l=n(10),i=n(7),u=Object(i.b)((function(e){return{authenticated:e.auth.token.length>0}}))((function(e){var t=e.exact,n=void 0!==t&&t,a=e.path,o=e.Component,c=e.render,s=void 0===c?function(){return null}:c,i=e.authenticated,u=void 0!==i&&i,m=r.a.createElement(l.b,{exact:n,path:a,component:o,render:function(){return s()}});return u||(m=r.a.createElement(l.a,{to:"/authenticate"})),m})),m=n(11),p=n(39);function h(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function d(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?h(n,!0).forEach((function(t){Object(p.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):h(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var g={token:"",refresh:"",expires_in:0,expire_on:0};Number(localStorage.getItem("expire_on"))>Number(new Date)&&(g.token=localStorage.getItem("token")||"",g.refresh=localStorage.getItem("refresh")||"",g.expires_in=Number(new Date(Number(localStorage.getItem("expire_on"))))-Number(new Date),g.expire_on=Number(localStorage.getItem("expire_on")));var b=Object(m.combineReducers)({auth:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:g,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"SAVE_TOKEN":var n=t.payload,a=n.token,r=n.refresh,o=n.expires_in;return localStorage.setItem("token",a),localStorage.setItem("refresh",r),localStorage.setItem("expire_on",(new Date).setSeconds((new Date).getSeconds()+o).toString()),d({},e,{token:a,refresh:r,expires_in:o});default:return e}}}),f=n(40),k=Object(m.createStore)(b,Object(f.composeWithDevTools)()),z=n(12),v=n(13),E=n(15),x=n(14),j=n(16),y=n(20),O=n.n(y),N=O.a.create({baseURL:"https://hazizz.duckdns.org:9000/auth-server",timeout:2e3,headers:{"Content-Type":"application/json"}}),w=O.a.create({baseURL:"https://hazizz.duckdns.org:9000/hazizz-server",timeout:3e3,headers:{"Content-Type":"application/json"}}),_=(O.a.create({baseURL:"https://hazizz.duckdns.org:9000/thera-server",timeout:2e3,headers:{"Content-Type":"application/json"}}),function(e){return r.a.createElement("div",{className:"groupLabel"},"N\xe9v: ",r.a.createElement("span",{className:"groupName"},e.name),"\xa0 L\xe9tsz\xe1m: ",r.a.createElement("span",{className:"groupUserCount"},e.userCount))}),C=function(){return r.a.createElement("div",{className:"spinner"},"Bet\xf6lt\xe9s")},D=function(e){function t(e){var n;return Object(z.a)(this,t),(n=Object(E.a)(this,Object(x.a)(t).call(this,e))).state={render:r.a.createElement(C,null)},n}return Object(j.a)(t,e),Object(v.a)(t,[{key:"componentDidMount",value:function(){var e=this;w({url:"/me/groups",headers:{Authorization:"Bearer "+this.props.token}}).then((function(t){var n=t.data;e.setState({render:n.map((function(e){return r.a.createElement(_,{key:e.id,name:e.name,userCount:e.userCount})}))})}))}},{key:"render",value:function(){return r.a.createElement("section",{className:"groupSection"},"Csoportjaid: ",this.state.render)}}]),t}(a.Component),S=Object(i.b)((function(e){return{token:e.auth.token}}))(D),I=n(26),L=n.n(I),T=function(e){return r.a.createElement("div",{className:"taskLabel"},r.a.createElement("h1",null,r.a.createElement("span",null,e.title),r.a.createElement("span",null,e.dueDate,"\xa0",r.a.createElement("input",{checked:e.completed,disabled:!0,title:"Fejleszt\xe9s alatt!",type:"checkbox",name:"completed",id:"completed"+e.title}))),r.a.createElement("p",null,e.children),r.a.createElement("div",{className:"taskDetails"},r.a.createElement("p",null,"L\xe9trehozta: ",e.creator),r.a.createElement("p",null,"Csoport: ",e.group),r.a.createElement("p",null,"T\xe9ma: ",e.subject),r.a.createElement("p",null,"C\xedmk\xe9k (kidolgoz\xe1s alatt): ",e.tags)))},M=function(e){function t(e){var n;return Object(z.a)(this,t),(n=Object(E.a)(this,Object(x.a)(t).call(this,e))).state={render:r.a.createElement(C,null)},n}return Object(j.a)(t,e),Object(v.a)(t,[{key:"componentDidMount",value:function(){var e=this;w({url:"/v2/me/tasks",headers:{Authorization:"Bearer "+this.props.token},params:{showThera:!0,unfinishedOnly:!1,finishedOnly:!1,startingDate:L()().format("YYYY-MM-DD"),endDate:L()().add(1,"M").format("YYYY-MM-DD")}}).then((function(t){var n=t.data;e.setState({render:n.map((function(e){return r.a.createElement(T,{key:e.id,completed:e.completed,creator:e.creator.displayName,dueDate:e.dueDate,group:e.group.name,subject:e.subject.name,tags:e.tags,title:e.title},e.description)}))})}))}},{key:"render",value:function(){return r.a.createElement("section",{className:"taskList"},this.state.render)}}]),t}(a.Component),P=Object(i.b)((function(e){return{token:e.auth.token}}))(M),Y=function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement(S,{isMobile:!1}),r.a.createElement(P,{isMobile:!1}))},B=n(41),H=n.n(B),A=n(42),F=n.n(A),R=n(43),U=n.n(R),J=function(e){function t(e){var n;return Object(z.a)(this,t),(n=Object(E.a)(this,Object(x.a)(t).call(this,e))).handleCheckChange=function(e){n.setState({consent:e.target.checked})},n.state={consent:!1,withoutConsent:!1},n}return Object(j.a)(t,e),Object(v.a)(t,[{key:"render",value:function(){var e=this,t=(this.props.location.state||{from:{pathname:"/home"}}).from,n=["consentLabel"];this.state.withoutConsent&&n.push("text-red-500");var a=function(n){var a=n.tokenId;N({url:"/auth",method:"post",params:{grant_type:"google_openid",openid_token:a,client_id:"H_MINDENHOL"}}).then((function(n){var a=n.data;e.props.saveToken(a.token,a.refresh,a.expires_in),e.props.history.replace(t)})).catch((function(n){23===n.response.data.errorCode&&N({url:"/account/googleregister",method:"post",data:{openIdToken:a,consent:e.state.consent}}).then((function(n){var a=n.data;e.props.saveToken(a.token,a.refresh,a.expires_in),e.props.history.replace(t)})).catch((function(t){35===t.response.data.errorCode&&e.setState({withoutConsent:!0})}))}))};return r.a.createElement("div",{className:"w-screen h-screen flex items-center justify-center"},r.a.createElement("div",{className:"max-w-md md:max-w-lg p-3 lg:max-w-4xl"},r.a.createElement("img",{src:U.a,alt:"H\xe1zizz logo",className:"w-5/6 md:w-3/5 m-auto"}),r.a.createElement("h1",{className:"text-center text-3xl font-bold text-hazizz_blue-200 md:text-5xl lg:text-6xl"},"Jelentkezz be!"),r.a.createElement("p",{className:"text-xs text-center text-gray-600 tracking-tight md:text-sm md:tracking-normal lg:text-xl"},"(A bejelentkez\xe9st \xe9s a regiszt\xe1ci\xf3t ugyan azok a gombok v\xe9gzik.)"),r.a.createElement("p",{className:"text-center text-hazizz_blue-200 text-xl font-semibold md:text-3xl lg:text-4xl"},"Haszn\xe1ld a k\xf6z\xf6ss\xe9gi bejelentkez\xe9sek egyik\xe9t:"),r.a.createElement("div",null,r.a.createElement("div",{className:"flex flex-col lg:flex-row"},r.a.createElement(F.a,{appId:"737993926628989",fields:"email",callback:function(n){N({url:"/auth",method:"post",params:{grant_type:"facebook_token",facebook_token:n.accessToken,client_id:"H_MINDENHOL"}}).then((function(n){var a=n.data;e.props.saveToken(a.token,a.refresh,a.expires_in),e.props.history.replace(t)}))},size:"small",render:function(t){return r.a.createElement("button",{className:e.state.consent?"btn bg-facebook cursor-pointer":"btn bg-facebook cursor-default",onClick:t.onClick,disabled:!e.state.consent,title:e.state.consent?"":"El kell fogadnod a felt\xe9teleket a folytat\xe1shoz!"},"Bejelentkez\xe9s Facebook haszn\xe1lat\xe1val")}}),r.a.createElement(H.a,{clientId:"425675787763-751dukg0oookea8tltaeboudlg0g555q.apps.googleusercontent.com",onSuccess:a,onFailure:a,scope:"openid",className:"google_login_button",render:function(t){return r.a.createElement("button",{className:e.state.consent?"btn bg-google cursor-pointer":"btn bg-google cursor-default",onClick:t.onClick,disabled:!e.state.consent,title:e.state.consent?"":"El kell fogadnod a felt\xe9teleket a folytat\xe1shoz!"},"Bejelnetkez\xe9s Google haszn\xe1lat\xe1val")}})),r.a.createElement("label",{className:n.join(" "),htmlFor:"consent"},r.a.createElement("input",{className:"absolute opacity-0 cursor-pointer h-0 w-0",onChange:this.handleCheckChange,checked:this.state.consent,type:"checkbox",name:"consent",id:"consent"}),r.a.createElement("span",{className:"consentCheckMark hover:bg-hazizz_blue-500 focus:shadow-outline"}),"A regisztr\xe1ci\xf3val \xe9s/vagy bejelekez\xe9ssel elfogadom a H\xe1zizz\xa0",r.a.createElement("a",{className:"consentLink",rel:"noopener noreferrer",target:"_blank",href:"https://raw.githubusercontent.com/hazizz/hazizz.github.io/master/privacy-hu.txt"},"adatv\xe9delmi nyilatkozat\xe1t"),",\xa0",r.a.createElement("a",{className:"consentLink",rel:"noopener noreferrer",target:"_blank",href:"https://raw.githubusercontent.com/hazizz/hazizz.github.io/master/tos-hu.txt"},"\xe1ltal\xe1nos szerz\u0151d\xe9si felt\xe9teleti"),", \xe9s a\xa0",r.a.createElement("a",{className:"consentLink",rel:"noopener noreferrer",target:"_blank",href:"https://raw.githubusercontent.com/hazizz/hazizz.github.io/master/guideline-hu.txt"},"h\xe1zirendj\xe9t"),"!"))))}}]),t}(a.Component),W=Object(i.b)(null,{saveToken:function(e,t,n){return{type:"SAVE_TOKEN",payload:{token:e,refresh:t,expires_in:n}}}})(J);n(72),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));var K=r.a.createElement(i.a,{store:k},r.a.createElement(s.a,null,r.a.createElement(l.a,{to:"/home"}),r.a.createElement(l.d,null,r.a.createElement(u,{path:"/home",Component:Y}),r.a.createElement(l.b,{path:"/authenticate",component:W}))));c.a.render(K,document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[44,1,2]]]);
//# sourceMappingURL=main.7bcf81ca.chunk.js.map