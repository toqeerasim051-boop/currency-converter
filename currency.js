const Base_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const dropdowns = document.querySelectorAll(".dropdown select");
const button = document.querySelector(".btn");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg=document.querySelector(".msg");

for (let select of dropdowns) {
  for (let code in countryList) {
    let newoptions = document.createElement("option");
    newoptions.innerText = code;
    newoptions.value = code;
    if (select.name === "from" && code === "USD") {
      newoptions.selected = "selected";
    } else if (select.name === "to" && code === "PKR") {
      newoptions.selected = "selected";
    }
    select.append(newoptions);
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateFlag = (element) => {
  let Currcode = element.value;
  let countryCode = countryList[Currcode];
  let newsrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newsrc;
};

button.addEventListener("click", async (e) => {
  e.preventDefault();
  let amount = document.querySelector(".amount input");
  let amtValue = amount.value;
  if (amtValue === "" || amtValue <= 0) {
    amtValue = 1;
    amount.value = "1";
  }

  const URL = `${Base_URL}/${fromCurr.value.toLowerCase()}.json`;
  let response = await fetch(URL);
  let data = await response.json();

  let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
  console.log(rate);
   let finalamount=amtValue*rate;
   msg.innerText=`${amtValue} ${fromCurr.value}=${finalamount} ${toCurr.value}`;
});
