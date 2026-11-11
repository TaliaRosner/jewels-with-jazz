/* ========================================
   JEWELS WITH JAZZ - JAVASCRIPT
======================================== */

document.addEventListener("DOMContentLoaded", function () {
  /* ========================================
     CONDITIONAL JEWELRY QUESTIONS
  ======================================== */

  const jewelryType = document.getElementById("jewelry-type");

  const conditionalFields = {
    ring: document.getElementById("ring-options"),
    necklace: document.getElementById("necklace-options"),
    earrings: document.getElementById("earring-options"),
    bracelet: document.getElementById("bracelet-options"),
    redesign: document.getElementById("redesign-options"),
  };

  function updateJewelryFields() {
    if (!jewelryType) return;

    // Hide and disable all jewelry-specific fields
    Object.values(conditionalFields).forEach(function (field) {
      if (!field) return;

      field.hidden = true;

      field
        .querySelectorAll("input, select, textarea")
        .forEach(function (input) {
          input.disabled = true;
          input.required = false;
        });
    });

    // Show fields for selected jewelry type
    const selectedField = conditionalFields[jewelryType.value];

    if (selectedField) {
      selectedField.hidden = false;

      selectedField
        .querySelectorAll("input, select, textarea")
        .forEach(function (input) {
          input.disabled = false;
        });

      // Ring size is required only for rings
      if (jewelryType.value === "ring") {
        const ringSize = document.getElementById("ring-size");

        if (ringSize) {
          ringSize.required = true;
        }
      }
    }

    // Update conditional "Other" fields
    updateConditionalFields();
  }

  if (jewelryType) {
    jewelryType.addEventListener("change", updateJewelryFields);
  }

  /* ========================================
     CONDITIONAL "OTHER" TEXT FIELDS
  ======================================== */

  const otherFields = [
    {
      selectId: "ring-size",
      fieldId: "other-ring-size-field",
      inputId: "other-ring-size",
    },
    {
      selectId: "metal-type",
      fieldId: "other-metal-field",
      inputId: "other-metal",
    },
    {
      selectId: "necklace-length",
      fieldId: "other-necklace-length-field",
      inputId: "other-necklace-length",
    },
    {
      selectId: "earring-style",
      fieldId: "other-earring-style-field",
      inputId: "other-earring-style",
    },
    {
      selectId: "gemstone-type",
      fieldId: "other-gemstone-field",
      inputId: "other-gemstone",
    },
    {
      selectId: "referral-source",
      fieldId: "other-referral-field",
      inputId: "other-referral",
    },
    {
      selectId: "jewelry-type",
      fieldId: "other-jewelry-type-field",
      inputId: "other-jewelry-type",
    },
    {
      selectId: "bracelet-style",
      fieldId: "other-bracelet-style-field",
      inputId: "other-bracelet-style",
    },
    {
      selectId: "bracelet-size",
      fieldId: "other-bracelet-size-field",
      inputId: "other-bracelet-size",
    },
  ];

  function updateConditionalFields() {
    otherFields.forEach(function (config) {
      const select = document.getElementById(config.selectId);
      const field = document.getElementById(config.fieldId);
      const input = document.getElementById(config.inputId);

      if (!select || !field || !input) return;

      const isOther =
        select.value === "other" &&
        !select.disabled &&
        !select.closest("[hidden]");

      field.hidden = !isOther;
      input.disabled = !isOther;
      input.required = isOther;

      if (!isOther) {
        input.value = "";
      }
    });
  }

  otherFields.forEach(function (config) {
    const select = document.getElementById(config.selectId);

    if (select) {
      select.addEventListener("change", updateConditionalFields);
    }
  });

  /* ========================================
     RUSH TIMELINE
  ======================================== */

  const timelineSelect = document.getElementById("project-timeline");

  const rushField = document.getElementById("rush-deadline-field");

  const rushInput = document.getElementById("rush-deadline");

  if (rushInput) {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7);

    const year = minDate.getFullYear();
    const month = String(minDate.getMonth() + 1).padStart(2, "0");
    const day = String(minDate.getDate()).padStart(2, "0");

    rushInput.min = `${year}-${month}-${day}`;
  }

  function updateRushField() {
    if (!timelineSelect || !rushField || !rushInput) return;

    const isRush = timelineSelect.value === "rush";

    rushField.hidden = !isRush;
    rushInput.disabled = !isRush;
    rushInput.required = isRush;

    if (!isRush) {
      rushInput.value = "";
    }
  }

  if (timelineSelect) {
    timelineSelect.addEventListener("change", updateRushField);
  }

  /* ========================================
     INITIALIZE CONDITIONAL FIELDS
  ======================================== */

  updateJewelryFields();
  updateConditionalFields();
  updateRushField();

  /* ========================================
     INSPIRATION PHOTO VALIDATION
  ======================================== */

  const photoInput = document.getElementById("inspiration-photos");

  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

  function validatePhotos() {
    if (!photoInput || photoInput.files.length === 0) {
      return true;
    }

    const files = Array.from(photoInput.files);

    // Maximum 5 photos
    if (files.length > MAX_FILES) {
      alert("Please upload no more than 5 inspiration photos.");
      photoInput.value = "";
      return false;
    }

    // Validate each photo
    for (const file of files) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        alert(
          `"${file.name}" is not a supported image format. Please upload JPG, PNG, or WEBP images.`,
        );

        photoInput.value = "";
        return false;
      }

      if (file.size > MAX_FILE_SIZE) {
        alert(
          `"${file.name}" exceeds the 5 MB limit. Please choose a smaller image.`,
        );

        photoInput.value = "";
        return false;
      }
    }

    return true;
  }

  if (photoInput) {
    photoInput.addEventListener("change", validatePhotos);
  }

  /* ========================================
     FORM SUBMISSION - DEMO MODE
  ======================================== */

  const inquiryForm = document.getElementById("jewelry-inquiry-form");

  if (inquiryForm) {
    inquiryForm.addEventListener("submit", function (event) {
      // Prevent real submission until integration is ready
      event.preventDefault();

      // Validate photos
      if (!validatePhotos()) {
        return;
      }

      // Validate required fields
      if (!inquiryForm.checkValidity()) {
        inquiryForm.reportValidity();
        return;
      }

      // Demo confirmation
      alert(
        "Demo successful! Your inquiry form is working. " +
          "No information has been sent yet. " +
          "We'll connect submissions to Jazz's email when we're ready.",
      );
    });
  }
});
