/* Jewels With Jazz — inquiry form interactions and demo submission */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("jewelry-inquiry-form");
  if (!form) return;

  const $ = (id) => document.getElementById(id);

  /* ========================================
     CONDITIONAL JEWELRY QUESTIONS
  ======================================== */

  const jewelryType = $("jewelry-type");

  const conditionalFields = {
    ring: $("ring-options"),
    necklace: $("necklace-options"),
    earrings: $("earring-options"),
    bracelet: $("bracelet-options"),
    redesign: $("redesign-options"),
  };

  /* ========================================
     CONDITIONAL "OTHER" TEXT FIELDS
  ======================================== */

  const otherFields = [
    ["ring-size", "other-ring-size-field", "other-ring-size"],
    ["metal-type", "other-metal-field", "other-metal"],
    ["necklace-length", "other-necklace-length-field", "other-necklace-length"],
    ["earring-style", "other-earring-style-field", "other-earring-style"],
    ["gemstone-type", "other-gemstone-field", "other-gemstone"],
    ["referral-source", "other-referral-field", "other-referral"],
    ["jewelry-type", "other-jewelry-type-field", "other-jewelry-type"],
    ["bracelet-style", "other-bracelet-style-field", "other-bracelet-style"],
    ["bracelet-size", "other-bracelet-size-field", "other-bracelet-size"],
    ["redesign-piece", "other-redesign-piece-field", "other-redesign-piece"],
  ];

  function updateOtherFields() {
    otherFields.forEach(([selectId, fieldId, inputId]) => {
      const select = $(selectId);
      const field = $(fieldId);
      const input = $(inputId);

      if (!select || !field || !input) return;

      const active =
        select.value === "other" &&
        !select.disabled &&
        !select.closest("[hidden]");

      field.hidden = !active;
      input.disabled = !active;
      input.required = active;

      if (!active) {
        input.value = "";
      }
    });
  }

  function updateJewelryFields() {
    Object.values(conditionalFields).forEach((field) => {
      if (!field) return;

      field.hidden = true;

      field.querySelectorAll("input, select, textarea").forEach((el) => {
        el.disabled = true;
        el.required = false;
      });
    });

    const selected = conditionalFields[jewelryType?.value];

    if (selected) {
      selected.hidden = false;

      selected.querySelectorAll("input, select, textarea").forEach((el) => {
        el.disabled = false;
      });

      if (jewelryType.value === "ring") {
        $("ring-size").required = true;
      }
    }

    updateOtherFields();
  }

  jewelryType?.addEventListener("change", updateJewelryFields);

  otherFields.forEach(([id]) => {
    $(id)?.addEventListener("change", updateOtherFields);
  });

  /* ========================================
     RUSH TIMELINE
  ======================================== */

  const timeline = $("project-timeline");
  const rushField = $("rush-deadline-field");
  const rushInput = $("rush-deadline");

  if (rushInput) {
    const d = new Date();
    d.setDate(d.getDate() + 7);

    rushInput.min =
      `${d.getFullYear()}-` +
      `${String(d.getMonth() + 1).padStart(2, "0")}-` +
      `${String(d.getDate()).padStart(2, "0")}`;
  }

  function updateRush() {
    if (!timeline || !rushField || !rushInput) return;

    const active = timeline.value === "rush";

    rushField.hidden = !active;
    rushInput.disabled = !active;
    rushInput.required = active;

    if (!active) {
      rushInput.value = "";
    }
  }

  timeline?.addEventListener("change", updateRush);

  /* ========================================
     INSPIRATION PHOTO VALIDATION
  ======================================== */

  const photoInput = $("inspiration-photos");

  function validatePhotos() {
    if (!photoInput || !photoInput.files.length) {
      photoInput?.setCustomValidity("");
      return true;
    }

    const files = Array.from(photoInput.files);
    let message = "";

    if (files.length > 5) {
      message = "Please upload no more than 5 inspiration photos.";
    } else {
      for (const file of files) {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
          message = `${file.name} must be a JPG, PNG, or WEBP image.`;
          break;
        }

        if (file.size > 5 * 1024 * 1024) {
          message = `${file.name} exceeds the 5 MB limit.`;
          break;
        }
      }
    }

    photoInput.setCustomValidity(message);

    if (message) {
      photoInput.reportValidity();
      return false;
    }

    return true;
  }

  photoInput?.addEventListener("change", validatePhotos);

  /* ========================================
     INITIALIZE CONDITIONAL FIELDS
  ======================================== */

  updateJewelryFields();
  updateRush();
  updateOtherFields();

  /* ========================================
     MULTI-STEP FORM NAVIGATION
  ======================================== */

  const steps = Array.from(form.querySelectorAll(".form-step"));

  const stepNames = [
    "Your Vision",
    "The Details",
    "Your Timeline",
    "Let's Connect",
  ];

  const back = $("form-back");
  const next = $("form-next");
  const submit = form.querySelector('button[type="submit"]');

  const count = $("form-step-count");
  const name = $("form-step-name");
  const fill = $("form-progress-fill");

  const track = form.querySelector(".form-progress-track");

  let current = 0;

  function showStep(index) {
    current = index;

    steps.forEach((step, i) => {
      step.hidden = i !== index;
    });

    back.hidden = index === 0;
    next.hidden = index === steps.length - 1;
    submit.hidden = index !== steps.length - 1;

    count.textContent = `Step ${index + 1} of ${steps.length}`;
    name.textContent = stepNames[index];

    fill.style.width = `${((index + 1) / steps.length) * 100}%`;

    track.setAttribute("aria-valuenow", String(index + 1));

    form.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  }

  /* ========================================
     STEP VALIDATION
  ======================================== */

  function validateStep(index) {
    if (index === 1 && !validatePhotos()) {
      return false;
    }

    for (const input of steps[index].querySelectorAll(
      "input, select, textarea",
    )) {
      if (input.disabled || input.closest(".conditional-field[hidden]")) {
        continue;
      }

      if (!input.checkValidity()) {
        input.reportValidity();
        input.focus();
        return false;
      }
    }

    return true;
  }

  /* ========================================
     NEXT & BACK BUTTONS
  ======================================== */

  next.addEventListener("click", () => {
    if (validateStep(current) && current < steps.length - 1) {
      showStep(current + 1);
    }
  });

  back.addEventListener("click", () => {
    if (current > 0) {
      showStep(current - 1);
    }
  });

  /* ========================================
     FORM SUBMISSION — DEMO MODE
  ======================================== */

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateStep(current)) return;

    for (let i = 0; i < steps.length; i++) {
      if (i !== current) {
        showStep(i);
      }

      if (!validateStep(i)) {
        return;
      }
    }

    showStep(steps.length - 1);

    alert(
      "Demo successful! No information has been sent yet. " +
        "We'll connect submissions to Jazz's email when ready.",
    );
  });

  /* ========================================
     ENTER KEY NAVIGATION
  ======================================== */

  form.addEventListener("keydown", (event) => {
    if (
      event.key === "Enter" &&
      event.target.tagName !== "TEXTAREA" &&
      current < steps.length - 1
    ) {
      event.preventDefault();
      next.click();
    }
  });

  /* ========================================
     START AT STEP 1
  ======================================== */

  showStep(0);
});
