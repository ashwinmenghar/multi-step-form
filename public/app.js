// Selecting necessary elements
const nextButton = document.getElementById("nextBtn");
const previousBtn = document.getElementById("previousBtn");

const personalInfoSection = document.querySelector(".personal-info");
const selectPlanSection = document.querySelector(".select-plans");
const addOns = document.querySelector(".add-ons");

const stepIndicators = document.querySelectorAll(".step-block li");
let currentStep = 0;

// Object to store user input
let formData = {
  name: "",
  email: "",
  phoneNumber: "",
  plan: {
    name: "Arcade",
    price: 9,
    planType: "Monthly",
  },
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

// Function to validate input fields
const validateInputs = () => {
  let inputs = personalInfoSection.querySelectorAll("input");
  let isFormValid = true;

  inputs.forEach((input) => {
    let valueLength = input.value.trim().length;
    let errorMessage = validationMessages[input.id];
    let errorSpan = input.previousElementSibling.querySelector("span");

    // Create error span if not exists
    if (!errorSpan) {
      errorSpan = document.createElement("span");
      errorSpan.className = "text-red-500 font-semibold text-sm";
      input.previousElementSibling.appendChild(errorSpan);
    }

    switch (input.id) {
      case "name":
        if (valueLength === 0) {
          errorSpan.innerText = errorMessage[0];
          isFormValid = false;
        } else {
          errorSpan.innerText = "";
          formData[input.id] = input.value.trim();
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (valueLength === 0) {
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
        const phoneRegex = /^\d{10}$/; // Must be exactly 10 digits
        if (valueLength === 0) {
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

// Function to update step indicators
const updateStepIndicators = (previousStep, nextStep) => {
  console.log(previousStep, nextStep);

  // Remove active styles from current step
  stepIndicators[previousStep].firstElementChild.classList.remove(
    "bg-[var(--light-blue)]",
    "text-black"
  );
  stepIndicators[previousStep].firstElementChild.classList.add(
    "text-white",
    "border"
  );

  // Add active styles to the new step
  stepIndicators[nextStep].firstElementChild.classList.add(
    "bg-[var(--light-blue)]",
    "text-black"
  );
  stepIndicators[nextStep].firstElementChild.classList.remove(
    "text-white",
    "border"
  );

  // Update `data-step` attribute dynamically
  nextButton.setAttribute("data-step", currentStep + 1);
};

// Function for next page
const nextStepPage = (e) => {
  let step = parseInt(e.target.dataset.step, 10);

  switch (step) {
    case 1:
      if (validateInputs()) {
        console.log("Validation passed", formData);

        // Hide personal info, show select plan section
        personalInfoSection.classList.add("hidden");
        selectPlanSection.classList.remove("hidden");

        // Update step indicators
        updateStepIndicators(currentStep, ++currentStep);
        previousBtn.classList.remove("invisible");
      }
      break;

    case 2:
      console.log("Page 2");

      // Hide current section, show next section
      selectPlanSection.classList.add("hidden");
      addOns.classList.remove("hidden");

      // Update step indicators
      updateStepIndicators(currentStep, ++currentStep);
      break;

    case 3:
      break;
    default:
      break;
  }
};

// Function for pervious page
const previousStepPage = () => {
  if (currentStep == 1) {
    previousBtn.classList.add("invisible");
  }
  updateStepIndicators(currentStep, currentStep - 1);

  let sections = document.querySelectorAll("section");
  sections[currentStep].classList.add("hidden");
  sections[currentStep - 1].classList.remove("hidden");

  nextButton.setAttribute("data-step", currentStep);
  currentStep--;
};

// Next button event listener
nextButton.addEventListener("click", nextStepPage);
previousBtn.addEventListener("click", previousStepPage);

selectPlanSection.addEventListener("change", (e) => {
  let isYearly = document.getElementById("monthly-yearly-switch").checked;
  formData.plan.planType = isYearly ? "Yearly" : "Monthly";

  // Get the currently selected plan radio input
  let selectedPlanInput = document.querySelector("input[name='plan']:checked");

  if (selectedPlanInput) {
    let selectedPlan = selectedPlanInput.value;
    let planPrice = Number(selectedPlanInput.dataset.price);

    // Update the formData with the new pricing type
    formData.plan.name = selectedPlan;
    formData.plan.price = isYearly ? planPrice * 10 : planPrice;
  }

  // Toggle between monthly and yearly prices
  if (e.target.id === "monthly-yearly-switch") {
    let freeMonthsList = document.querySelectorAll(".extra-free-months");

    freeMonthsList.forEach((freeMonth) => {
      let yearlyPrice = freeMonth.previousElementSibling.dataset.yearlyPrice;
      let setNewPrice = "";

      if (isYearly) {
        setNewPrice = `$${yearlyPrice}/yr`;
        freeMonth.classList.remove("hidden"); // Show "2 months free"
      } else {
        setNewPrice = `$${yearlyPrice / 10}/mo`;
        freeMonth.classList.add("hidden"); // Hide "2 months free"
      }

      freeMonth.previousElementSibling.innerText = setNewPrice;
    });
  }
});
