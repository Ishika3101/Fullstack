import { dbank } from "../../declarations/dbank";
//files inside declarations basically just exposes our motoko code to our js in a way that our js is able to understand and is able to access and call these functions.

window.addEventListener("load",async function(){
  const currentAmount=await dbank.checkBalance();
  document.getElementById("value").innerText=Math.round(currentAmount*100)/100;
});

document.querySelector("form").addEventListener("submit",async function(event){
  event.preventDefault();

  const button =event.target.querySelector("#submit-btn");

  const inputAmount= parseFloat(document.getElementById("input-amount").value);
  const outputAmount= parseFloat(document.getElementById("withdrawal-amount").value);

  button.setA
  await dbank.topUp(inputAmount);
  const currentAmount=await dbank.checkBalance();
  document.getElementById("value").innerText=Math.round(currentAmount*100)/100;
  await dbank.withdrawl(outputAmount);
});
