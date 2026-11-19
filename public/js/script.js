
// "use strict";

// // Run after the HTML document has loaded
// document.addEventListener("DOMContentLoaded", () => {

//     // Select all forms that use Bootstrap validation
//     const forms = document.querySelectorAll(".needs-validation");

//     // Apply validation to each form
//     forms.forEach((form) => {

//         form.addEventListener("submit", (event) => {

//             // Check whether all required fields are valid
//             if (!form.checkValidity()) {

//                 // Stop submission if the form is invalid
//                 event.preventDefault();
//                 event.stopPropagation();

//             }

//             // Display Bootstrap validation feedback
//             form.classList.add("was-validated");

//         });

//     });

// });



"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // Bootstrap form validation
    const forms = document.querySelectorAll(".needs-validation");

    forms.forEach((form) => {
        form.addEventListener("submit", (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add("was-validated");
        });
    });

    // Image upload elements
    const imageInput = document.getElementById("imageFile");
    const imagePreview = document.getElementById("imagePreview");
    const previewContainer = document.getElementById("previewContainer");
    const removeButton = document.getElementById("removeImage");
    const imageError = document.getElementById("imageError");

    // Skip image handling on pages without an image input
    if (!imageInput || !imagePreview || !previewContainer) {
        return;
    }

    let previewUrl = null;

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    const maxSize = 5 * 1024 * 1024; // 5 MB

    // Clear the image preview and release its temporary URL
    function clearPreview() {
        imagePreview.removeAttribute("src");
        previewContainer.classList.add("d-none");

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            previewUrl = null;
        }
    }

    // Validate selected image and display preview
    imageInput.addEventListener("change", () => {
        if (imageError) {
            imageError.textContent = "";
        }

        clearPreview();

        const file = imageInput.files[0];

        if (!file) {
            return;
        }

        // Validate image format
        if (!allowedTypes.includes(file.type)) {
            if (imageError) {
                imageError.textContent =
                    "Please select a JPG, PNG, or WebP image.";
            }

            imageInput.value = "";
            return;
        }

        // Validate image size
        if (file.size > maxSize) {
            if (imageError) {
                imageError.textContent =
                    "Image size must not exceed 5 MB.";
            }

            imageInput.value = "";
            return;
        }

        // Generate and display preview
        previewUrl = URL.createObjectURL(file);
        imagePreview.src = previewUrl;
        previewContainer.classList.remove("d-none");
    });

    // Remove selected image
    if (removeButton) {
        removeButton.addEventListener("click", () => {
            imageInput.value = "";

            if (imageError) {
                imageError.textContent = "";
            }

            clearPreview();
        });
    }

    // Release temporary URL when leaving the page
    window.addEventListener("pagehide", clearPreview);
});
