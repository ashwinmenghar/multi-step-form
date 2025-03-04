const nextButton = document.getElementById("nextBtn");
const previousBtn = document.getElementById("previousBtn");
const changePlan = document.getElementById("change-plan");
const sections = document.querySelectorAll("section");
const stepIndicators = document.querySelectorAll(".step-block li");
const personalInfoSection = document.querySelector(".personal-info");
const confirmPage = document.querySelector(".confirm-page");

// Store steps
let currentStep = 0;

// Add ons
let addOnsInfo = {
  1: { name: "Online service", price: { monthly: 1, yearly: 10 } },
  2: { name: "Larger storage", price: { monthly: 2, yearly: 20 } },
  3: { name: "Customizable profile", price: { monthly: 2, yearly: 20 } },
};

// To store all data
let formData = {
  name: "",
  email: "",
  phoneNumber: "",
  plan: { name: "Arcade", price: 9, planType: "Monthly" },
  addOns: {},
};

// Validation messages
const validationMessages = {
  name: ["This field is required"],
  email: ["This field is required", "Invalid email format"],
  phoneNumber: [
    "This field is required",
    "Should only contain numbers",
    "Must contain exactly 10 digits",
  ],
};

// Generic function to validate inputs
const validateInputs = () => {
  let isFormValid = true;

  personalInfoSection.querySelectorAll("input").forEach((input) => {
    let errorSpan =
      input.previousElementSibling.querySelector("span") ||
      document.createElement("span");

    errorSpan.className = "text-red-500 font-semibold text-sm";
    input.previousElementSibling.appendChild(errorSpan);

    let value = input.value.trim();
    let errorMessage = validationMessages[input.id];

    switch (input.id) {
      case "name":
        if (value.length === 0) {
          errorSpan.innerText = errorMessage[0];
          isFormValid = false;
        } else {
          errorSpan.innerText = "";
          formData[input.id] = input.value.trim();
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.length === 0) {
          errorSpan.innerText = errorMessage[0];
          isFormValid = false;
        } else if (!emailRegex.test(input.value.trim())) {
          errorSpan.innerText = errorMessage[1];
          isFormValid = false;
        } else {
          errorSpan.innerText = "";
          formData[input.id] = input.value.trim();
        }
        break;

      case "phoneNumber":
        const phoneRegex = /^\d{10}$/;
        if (value.length === 0) {
          errorSpan.innerText = errorMessage[0];
          isFormValid = false;
        } else if (/[a-z]/i.test(input.value.trim())) {
          errorSpan.innerText = errorMessage[1];
          isFormValid = false;
        } else if (!phoneRegex.test(input.value.trim())) {
          errorSpan.innerText = errorMessage[2];
          isFormValid = false;
        } else {
          errorSpan.innerText = "";
          formData[input.id] = input.value.trim();
        }
        break;
    }
  });

  return isFormValid;
};

// Update step indicators
const updateStepIndicators = (prevStep, nextStep) => {
  stepIndicators[prevStep].firstElementChild.classList.remove(
    "bg-[var(--light-blue)]"
  );
  stepIndicators[prevStep].firstElementChild.classList.add(
    "text-white",
    "border"
  );

  stepIndicators[nextStep].firstElementChild.classList.add(
    "bg-[var(--light-blue)]"
  );

  stepIndicators[nextStep].firstElementChild.classList.remove(
    "text-white",
    "border"
  );
  nextButton.setAttribute("data-step", nextStep + 1);
};

// Handle navigation between steps
const changeStep = (step) => {
  sections[currentStep].classList.add("hidden");
  sections[step].classList.remove("hidden");

  if (step <= 3) {
    updateStepIndicators(currentStep, step);
  }
  currentStep = step;

  previousBtn.classList.toggle("invisible", currentStep === 0);

  previousBtn.classList.toggle("hidden", currentStep === sections.length - 1);
  nextButton.classList.toggle("hidden", currentStep === sections.length - 1);
};

// Handle next step logic
const nextStepPage = (e) => {
  let step = parseInt(e.target.dataset.step, 10);
  if (step === 1 && !validateInputs()) return;

  if (step === 3) {
    formData.addOns = {};
    document
      .querySelectorAll("input.selectedAddOn:checked")
      .forEach((addOn) => {
        formData.addOns[addOn.value] = {
          name: addOnsInfo[addOn.value].name,
          price:
            formData.plan.planType === "Yearly"
              ? addOnsInfo[addOn.value].price.yearly
              : addOnsInfo[addOn.value].price.monthly,
        };
      });
    nextButton.classList.add("bg-indigo-600");
    nextButton.innerText = "Confirm";

    updateConfirmPage();
  }

  if (step >= 4) {
    console.log("formData is: ", formData);
  }

  changeStep(step);
};

// Update confirmation page
const updateConfirmPage = () => {
  const planNameField = confirmPage.querySelector(".plan-name");
  const planPrice = confirmPage.querySelector(".plan-price");
  const addOnsList = confirmPage.querySelector(".add-ons-list");

  planNameField.innerHTML = `${formData.plan.name} <span>(${formData.plan.planType})</span>`;
  planPrice.innerText = `$${formData.plan.price}/${
    formData.plan.planType === "Yearly" ? "yr" : "mo"
  }`;
  addOnsList.innerHTML = "";

  if (Object.values(formData.addOns).length > 0) {
    addOnsList.previousElementSibling.classList.remove("hidden");
    addOnsList.classList.remove("hidden");
  } else {
    addOnsList.previousElementSibling.classList.add("hidden");
    addOnsList.classList.add("hidden");
  }

  let total = formData.plan.price;
  Object.values(formData.addOns).forEach((plan) => {
    total += plan.price;

    // Create a new li element
    let li = document.createElement("li");
    li.className = "flex justify-between";

    // Create paragraph for the name
    let namePara = document.createElement("p");
    namePara.className = "text-gray-400 text-sm";
    namePara.textContent = plan.name;

    // Create span for the price
    let priceSpan = document.createElement("span");
    priceSpan.className = "text-sm";
    priceSpan.textContent = `+${plan.price}/${
      formData.plan.planType === "Yearly" ? "yr" : "mo"
    }`;

    // Append name and price to li
    li.appendChild(namePara);
    li.appendChild(priceSpan);

    // Append li to addOnsList
    addOnsList.appendChild(li);
  });

  updateTotalPrice();
};

// Update total price
const updateTotalPrice = () => {
  const total =
    formData.plan.price +
    Object.values(formData.addOns).reduce((sum, addOn) => sum + addOn.price, 0);

  const totalPriceContainer = confirmPage.querySelector(".total-price");
  totalPriceContainer.innerHTML = ""; // Clear previous content

  const totalBlock = document.createElement("p");
  totalBlock.innerText = `Total (per ${formData.plan.planType.toLowerCase()})`;

  const priceBlock = document.createElement("p");
  priceBlock.className = "text-blue-600 text-xl font-semibold";
  priceBlock.innerText = `$${total}/${
    formData.plan.planType === "Yearly" ? "yr" : "mo"
  }`;

  totalPriceContainer.append(totalBlock, priceBlock);
};

// Handle plan selection and pricing
document
  .getElementById("monthly-yearly-switch")
  .addEventListener("change", (e) => {
    let isYearly = e.target.checked;
    formData.plan.planType = isYearly ? "Yearly" : "Monthly";

    let selectedPlanInput = document.querySelector(
      "input[name='plan']:checked"
    );

    if (selectedPlanInput) {
      formData.plan.name = selectedPlanInput.value;
      formData.plan.price = isYearly
        ? selectedPlanInput.dataset.price * 10
        : +selectedPlanInput.dataset.price;
    }

    document.querySelectorAll(".extra-free-months").forEach((el) => {
      el.classList.toggle("hidden", !isYearly);
      el.previousElementSibling.innerText = isYearly
        ? `$${el.previousElementSibling.dataset.yearlyPrice}/yr`
        : `$${el.previousElementSibling.dataset.yearlyPrice / 10}/mo`;
    });

    document.querySelectorAll(".add-ons-price").forEach((el) => {
      el.innerText = `+$${
        isYearly ? el.dataset.addonsPrice * 10 : el.dataset.addonsPrice
      }/${isYearly ? "yr" : "mo"}`;
    });
  });

// Handle changing plan
changePlan.addEventListener("click", () => changeStep(1));

// Event listeners for navigation
nextButton.addEventListener("click", nextStepPage);
previousBtn.addEventListener("click", () => changeStep(currentStep - 1));
