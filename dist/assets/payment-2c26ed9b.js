import{a as u,u as p,r as m,b as x,j as e}from"./index-5eb48504.js";/* empty css                    */const h=n=>new Promise(s=>{const o=document.createElement("script");o.src=n,o.onload=()=>{s(!0)},o.onerror=()=>{s(!1)},document.body.appendChild(o)}),b=async(n,s)=>{if(!await h("https://checkout.razorpay.com/v1/checkout.js")){alert("You are offline");return}const r={key:"rzp_test_omwV1KzHmstnbs",currency:"INR",amount:n*100,name:"MEDINET",prefill:{name:"MEDINET"}};try{return(await u.post("https://medinet.website/checkSlot",{doctor:s.doctor,time:s.time,day:s.date,user:s.user})).data!=="unavailable"?await new Promise((a,c)=>{r.handler=function(d){d.razorpay_payment_id?a(d.razorpay_payment_id):c("Payment failed")},new window.Razorpay(r).open()}):(console.log("Slot unavailable"),"slot unavailable")}catch(t){return console.log(t),null}};function w(){const n=p(),[s,o]=m.useState(),r=localStorage.getItem("userToken"),t=x(a=>a.appointment.appointment),l=t.fee+t.fee*.1;m.useEffect(()=>{(!t||isNaN(t.fee))&&n("/findDoctor")});const i=async()=>{try{const a=await b(l,t);a=="slot unavailable"?(o(a),setTimeout(()=>{o("")},4e3)):a?(console.log(t),await u.post("https://medinet.website/bookslot",t,{headers:{Authorization:`Bearer ${r}`}}).then(c=>{c.data=="success"?n("/success"):c.data=="blocked"&&(n("/login"),localStorage.removeItem("userToken"))})):console.log("payment error")}catch(a){console.log(a)}};return e.jsxs("div",{className:"slice m-3 mx-auto mt-5 mb-5 p-2 app-div",style:{maxWidth:"1200px"},children:[s?e.jsx("div",{className:"alert alert-danger text-center",children:s}):"",e.jsx("div",{className:"container",children:e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-lg-6",children:e.jsx("img",{width:"100%",src:"https://www.shebaonline.org/wp-content/uploads/2018/09/Featured-image-new-14.jpg",alt:""})}),e.jsxs("div",{className:"col-lg-6",children:[e.jsx("div",{className:"col-12 text-center",children:e.jsx("h4",{className:"text-dark",children:"Payment"})}),e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-5 text-end",children:["Service : ",e.jsx("br",{}),"Date : ",e.jsx("br",{}),"Time : ",e.jsx("br",{}),"Cons. Fee : ",e.jsx("br",{}),"Platform fee: ",e.jsx("br",{}),"Total Payable:"]}),e.jsxs("div",{className:"col-6 text-start text-success",children:["Online Consulting ",e.jsx("br",{}),t.date," ",e.jsx("br",{}),t.time," ",e.jsx("br",{}),t.fee," ",e.jsx("br",{}),t.fee*.1," ",e.jsx("br",{}),l,"/-"]}),e.jsxs("div",{className:"col-12 mt-5 text-center",children:[e.jsx("button",{className:"btn text-dark btn-outline-success",onClick:i,children:"Pay"})," ",e.jsx("button",{onClick:()=>n("/findDoctor"),className:"btn text-dark btn-outline-success",children:"Cancel"})]})]})]})]})})]})}export{w as default};
