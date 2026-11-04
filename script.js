/* ========================================
   JEWELS WITH JAZZ - JAVASCRIPT
======================================== */

document.addEventListener("DOMContentLoaded", function () {
  /* ========================================
       CONDITIONAL JEWELRY QUESTIONS
    ======================================== */

  const jewelryType = document.getElementById("jewelry-type");

  if (jewelryType) {
    const conditionalFields = {
      ring: document.getElementById("ring-options"),
      necklace: document.getElementById("necklace-options"),
      earrings: document.getElementById("earring-options"),
    };

    function updateJewelryFields() {
      // Hide and disable all conditional fields
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

      // Show the questions for the selected jewelry type
      const selectedField = conditionalFields[jewelryType.value];

      if (selectedField) {
        selectedField.hidden = false;

        selectedField
          .querySelectorAll("input, select, textarea")
          .forEach(function (input) {
            input.disabled = false;
          });

        // Require ring size only when Ring is selected
        if (jewelryType.value === "ring") {
          const ringSize = document.getElementById("ring-size");

          if (ringSize) {
            ringSize.required = true;
          }
        }
      }
    }

    jewelryType.addEventListener("change", updateJewelryFields);

    // Initialize fields when the page loads
    updateJewelryFields();
  }

  /* ========================================
       INSPIRATION PHOTO VALIDATION
    ======================================== */

  const photoInput = document.getElementById("inspiration-photos");

  const MAX_FILES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB per image

  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

  function validatePhotos() {
    if (!photoInput || photoInput.files.length === 0) {
      return true;
    }

    const files = Array.from(photoInput.files);

    // Check number of uploaded images
    if (files.length > MAX_FILES) {
      alert("Please upload no more than 5 inspiration photos.");
      photoInput.value = "";
      return false;
    }

    // Check each image
    for (const file of files) {
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        alert(
          `"${file.name}" is not a supported image format. Please upload JPG, PNG, or WEBP images.`,
        );

        photoInput.value = "";
        return false;
      }

      // Validate file size
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
      // Prevent submission until email integration is ready
      event.preventDefault();

      // Validate uploaded images
      if (!validatePhotos()) {
        return;
      }

      // Check required fields
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
