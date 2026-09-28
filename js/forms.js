/**
 * ALPHALEAD ACADEMY — FORM HANDLING & VALIDATION ENGINE
 * Client-side validation, error states, and responsive submission feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  initFormValidation('contactForm');
  initFormValidation('callbackModalForm');
  initFormValidation('quickBookingForm');
});

function initFormValidation(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const inputs = form.querySelectorAll('.form-control[required]');

  // Clear error state on input
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        input.classList.remove('error');
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    let firstInvalidInput = null;

    inputs.forEach(input => {
      const val = input.value.trim();
      let fieldValid = true;

      if (!val) {
        fieldValid = false;
      } else if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          fieldValid = false;
        }
      } else if (input.type === 'tel') {
        const cleanPhone = val.replace(/\D/g, '');
        if (cleanPhone.length < 10) {
          fieldValid = false;
        }
      }

      if (!fieldValid) {
        isValid = false;
        input.classList.add('error');
        if (!firstInvalidInput) {
          firstInvalidInput = input;
        }
      } else {
        input.classList.remove('error');
      }
    });

    if (!isValid) {
      // Trigger subtle shake animation
      form.classList.remove('shake');
      void form.offsetWidth; // Trigger reflow
      form.classList.add('shake');

      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      return;
    }

    // Submit Simulation State
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    const feedbackBox = form.querySelector('.form-feedback') || createFeedbackBox(form);

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner" aria-hidden="true"></span>
        <span>Submitting Request...</span>
      `;
    }

    // Simulate reliable API callback
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }

      // Show success feedback
      feedbackBox.className = 'form-feedback success';
      feedbackBox.setAttribute('role', 'alert');
      feedbackBox.setAttribute('aria-live', 'polite');
      feedbackBox.innerHTML = `
        <div class="success-icon-badge" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div>
          <strong style="display:block; color:var(--color-status-green); font-size:0.9375rem; margin-bottom:2px;">
            Request Received Successfully
          </strong>
          <span style="color:var(--color-text-secondary); font-size:0.875rem;">
            Thank you for reaching out. A Senior Leadership Mentor from Alpha Lead will contact you within 24 hours.
          </span>
        </div>
      `;
      feedbackBox.style.display = 'flex';

      form.reset();

      // Scroll into view if needed
      feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 700);
  });
}

function createFeedbackBox(form) {
  const box = document.createElement('div');
  box.className = 'form-feedback';
  form.prepend(box);
  return box;
}
