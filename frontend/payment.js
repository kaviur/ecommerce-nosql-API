const stripe = Stripe(
  "pk_test_51LCBY7DxZkw2FAlUNWmkq8HElC2w1UY86gTJqPmzRH8Q2h1fGaYz0md9PU9UFpGEVulQsgICiJlllFOuiR4RttbN00PRBt7wEt"
);

const form = document.getElementById("payment-form");
const loadPaymentBtn = document.getElementById("loadPayment");
const btnSubmit = document.getElementById("submit");
const btngoogle = document.getElementById("google");

loadPaymentBtn.onclick = () => {
  initialize();
};

let elements;

const initialize = async () => {
  debugger;
  const response = await fetch("http://localhost:8081/api/v1/payment/pay", {
    credentials: "include",
  });
  const data = await response.json();

  if (data.ok) {
    const clientSecret = data.data;
    const appearance = {
      theme: "stripe",
    };
    elements = stripe.elements({ appearance, clientSecret });
    const paymentElement = elements.create("payment");
    paymentElement.mount("#payment-element");
    btnSubmit.style.display = "block";
    loadPaymentBtn.style.display = "none";
    btngoogle.style.display = "none";
  }

  alert(data.errors[0].message);
};

form.onsubmit = async (event) => {
  event.preventDefault();
  const result = await stripe.confirmPayment({
    elements,
    redirect: "if_required",
  });
  if (result.paymentIntent?.status === "succeeded") {
    alert("Su pago de realizó exitosamente")
    document.location.reload(true)
  }

  console.log(result);
};
