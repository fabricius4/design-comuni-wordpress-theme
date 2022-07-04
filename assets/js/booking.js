/* Steps Page - Next and Back button */

var content = document.querySelector(".section-wrapper");
var currentStep = 1;
var navscroll = document.querySelector(
  '[data-index="'.concat(currentStep, '"]')
);
var progressBar = document.querySelector(
  '[data-progress="'.concat(currentStep, '"]')
);

function pageSteps() {
  if (!content) return;
  var btnSave = content.querySelectorAll(".saveBtn");
  var btnNext = content.querySelector(".btn-next-step");
  var btnBack = content.querySelector(".btn-back-step");
  navscroll.classList.add("d-lg-block");
  progressBar.classList.remove("d-none");
  btnSave.forEach(function (element) {
    element.classList.add("invisible");
  });

  if (btnNext) {
    btnNext.addEventListener("click", function () {
      openNext();
    });
  }

  if (btnBack) {
    btnBack.addEventListener("click", function () {
      backPrevious();
    });
  }
}

function openNext() {
  var btnSave = content.querySelectorAll(".saveBtn");
  var steps = content.querySelectorAll("[data-steps]");
  var nextStep = content.querySelector(
    '[data-steps="'.concat(currentStep + 1, '"]')
  );
  var stepWrapper = content.querySelector("[data-steps].active");
  navscroll.classList.remove("d-lg-block");
  progressBar.classList.remove("d-block");
  progressBar.classList.add("d-none");

  if (currentStep == steps.length) {
    return;
  } else {
    stepWrapper.classList.add("d-none");
    stepWrapper.classList.remove("active");
    nextStep.classList.add("active");
    nextStep.classList.remove("d-none");
    currentStep = currentStep + 1;
    progressBar = document.querySelector(
      '[data-progress="'.concat(currentStep, '"]')
    );
    progressBar.classList.add("d-block");
    progressBar.classList.remove("d-none");

    if (currentStep < steps.length) {
      navscroll = document.querySelector(
        '[data-index="'.concat(currentStep, '"]')
      );
      navscroll.classList.add("d-lg-block");
    }

    if (currentStep == steps.length) {
      content.classList.remove("offset-lg-1");
    }

    if (currentStep == steps.length) {
      content.querySelector(".steppers-btn-confirm span").innerHTML = "Invia";
      btnSave.forEach(function (element) {
        element.classList.remove("invisible");
        element.classList.add("visible");
      });
    }
  }
}

function backPrevious() {
  var btnSave = content.querySelectorAll(".saveBtn");
  var steps = content.querySelectorAll("[data-steps]");
  var stepWrapper = content.querySelector("[data-steps].active");
  var previousStep = content.querySelector(
    '[data-steps="'.concat(currentStep - 1, '"]')
  );

  if (currentStep == 1) {
    return;
  } else {
    previousStep.classList.remove("d-none");
    previousStep.classList.add("active");
    stepWrapper.classList.add("d-none");
    stepWrapper.classList.remove("active");
    navscroll.classList.remove("d-lg-block");
    progressBar.classList.add("d-none");
    currentStep = currentStep - 1;
    progressBar = document.querySelector(
      '[data-progress="'.concat(currentStep, '"]')
    );
    progressBar.classList.toggle("d-none");
    content.querySelector(".steppers-btn-confirm span").innerHTML = "Avanti";

    if (currentStep < steps.length) {
      navscroll = document.querySelector(
        '[data-index="'.concat(currentStep, '"]')
      );
      navscroll.classList.add("d-lg-block");
      content.classList.add("offset-lg-1");
    }

    if (currentStep < steps.length) {
      btnSave.forEach(function (element) {
        element.classList.remove("visible");
        element.classList.add("invisible");
      });
    }
  }
}

pageSteps();

/* Define an empty object to collect answers */
const answers = {};

const saveAnswerByValue = (key, value) => {
  answers[key] = value;
  console.log("ans", answers);
};
const saveAnswerById = (key, id, callback) => {
  const value = document.getElementById(id)?.value;
  answers[key] = value;
  console.log("ans", answers);
  if (typeof callback == "function") callback();
};

/* Get Luoghi by Unità organizzativa - Step 1 */
const officeSelect = document.getElementById("office-choice");
let selectedOffice;
officeSelect.addEventListener("change", () => {
  saveAnswerByValue("office", officeSelect?.value);

  if (officeSelect?.value) {
    selectedOffice = officeSelect?.value;
    const urlParam = new URLSearchParams({ title: officeSelect.value });
    fetch(`/wp-json/wp/v2/sedi/ufficio/?${urlParam}`)
      .then((response) => response.json())
      .then((data) => {
        document.querySelector("#place-cards-wrapper").innerHTML = "";
        for (const place of data) {
          document.querySelector("#place-cards-wrapper").innerHTML += `
          <div class="cmp-info-radio radio-card">
            <div class="card p-3 p-lg-4">
              <div class="card-header mb-0 p-0">
                <div class="form-check m-0">
                    <input
                    class="radio-input"
                    name="beneficiaries"
                    type="radio"
                    id=${place?.ID}
                    value='${JSON.stringify(place)}'
                    onclick="saveAnswerById('place', ${place?.ID}, ${() =>
            setSelectedPlace()})"
                    />
                    <label for=${place?.ID}>
                    <h3 class="big-title mb-0 pb-0">
                        ${place?.post_title}
                    </h3></label
                    >
                </div>
              </div>
              <div class="card-body p-0">
                <div class="info-wrapper">
                  <span class="info-wrapper__label">Sportello</span>
                  <p class="info-wrapper__value">CIE</p>
                </div>
                <div class="info-wrapper">
                  <span class="info-wrapper__label">Indirizzo</span>
                  <p class="info-wrapper__value">
                  ${place?.indirizzo}
                  </p>
                </div>
                <div class="info-wrapper">
                    <span class="info-wrapper__label">Apertura</span>
                    <p class="info-wrapper__value">
                    ${place?.apertura}
                    </p>
                </div>
              </div>
            </div>
          </div>
          `;
        }
      })
      .catch((err) => {
        console.log("err", err);
      });

    /* Get Servizi by Unità organizzativa - Step 3 */
    fetch(`/wp-json/wp/v2/servizi/ufficio?${urlParam}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("servizi", data);
        document.querySelector("#motivo-appuntamento").innerHTML =
          '<option selected="selected" value="">Seleziona opzione</option>';
        for (const place of data) {
          document.querySelector("#motivo-appuntamento").innerHTML += `
          
          `;
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  } else {
    document.querySelector("#place-cards-wrapper").innerHTML = "";
  }
});

/* Step 2 */
/* Get appointments calendar */
const appointment = document.getElementById("appointment");
appointment.addEventListener("change", () => {
  fetch(
    url +
      `?month=${appointment?.value}&office=${encodeURIComponent(
        selectedOffice
      )}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      document.querySelector("#radio-appointment").innerHTML = "";
      for (const dates of data) {
        const { startDate, endDate } = dates;
        const startDay = startDate.split("T")[0];
        const startDayStr = new Date(startDay).toLocaleString([], {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
        const id = startDate + "/" + endDate;

        document.querySelector("#radio-appointment").innerHTML += `
        <div
        class="radio-body border-bottom border-light"
        >
        <input name="radio" type="radio" id="${id}" onclick="saveAnswerByValue('appointment', '${id}')"/>
        <label for="${id}" class="text-capitalize">${startDayStr} ore ${
          startDate.split("T")[1]
        }</label>
        </div>
        `;
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
});

/* Get selected office */
const setSelectedPlace = () => {
  const place = JSON.parse(answers?.place);
  console.log("selectedplace", place);
  document.querySelector("#selected-place-card").innerHTML = `  
  <div class="cmp-info-summary bg-white mb-4 mb-lg-30 p-4">
  <div class="card">
      <div
      class="card-header border-bottom border-light p-0 mb-0 d-flex justify-content-between d-flex justify-content-end"
      >
      <h3 class="title-large-semi-bold mb-3">
        ${place?.post_title}
      </h3>
      </div>

      <div class="card-body p-0">
      <div class="single-line-info border-light">
          <div class="text-paragraph-small">Sportello</div>
          <div class="border-light">
          <p class="data-text">CIE</p>
          </div>
      </div>
      <div class="single-line-info border-light">
          <div class="text-paragraph-small">Indirizzo</div>
          <div class="border-light">
          <p class="data-text">
            ${place?.indirizzo}
          </p>
          </div>
      </div>
      <div class="single-line-info border-light">
          <div class="text-paragraph-small">Apertura</div>
          <div class="border-light">
          <p class="data-text">
            ${place?.apertura}
          </p>
          </div>
      </div>
      </div>
      <div class="card-footer p-0"></div>
  </div>
  </div>
</div>
  `;
};