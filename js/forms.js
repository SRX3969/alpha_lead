/**
 * ALPHALEAD ACADEMY — FORM HANDLING & MULTI-CHANNEL INQUIRY DISPATCHER
 * 
 * Channels:
 * 1. Immediate WhatsApp Direct Forwarding (+91 9902500649)
 * 2. Automated Google Sheets Webhook Logging
 * 3. Web3Forms Direct Email Delivery (shreeram.3969@gmail.com)
 * 4. LocalStorage offline backup cache
 */

const FORM_CONFIG = {
  // Test contact details requested by user:
  whatsappNumber: '919902500649',
  recipientEmail: 'shreeram.3969@gmail.com',
  
  // 1. Google Sheets Webhook URL (Paste your Google Apps Script Web App URL here)
  googleScriptUrl: 'https://script.google.com/macros/s/AKfycbyQJNOuDNNhnPuSfnGErFYHiBeAphZZl7n2DiwAi-fEadNx-4XZQROi7iTP9_mqY8D9dw/exec',
  
  // 2. Web3Forms Access Key (Paste your free access key from https://web3forms.com here)
  web3formsAccessKey: ''
};

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

  form.addEventListener('submit', async (e) => {
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
      form.classList.remove('shake');
      void form.offsetWidth;
      form.classList.add('shake');

      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      return;
    }

    // Extract submission values accurately across different form schemas
    const nameEl = form.querySelector('input[type="text"], #contact-name');
    const phoneEl = form.querySelector('input[type="tel"], #contact-phone');
    const emailEl = form.querySelector('input[type="email"], #contact-email');
    const selectEl = form.querySelector('select, #contact-vertical');
    const msgEl = form.querySelector('textarea, #contact-message');

    const leadData = {
      name: nameEl ? nameEl.value.trim() : 'Candidate',
      phone: phoneEl ? phoneEl.value.trim() : '',
      email: emailEl ? emailEl.value.trim() : '',
      programme: selectEl && selectEl.selectedOptions && selectEl.selectedOptions[0] ? selectEl.selectedOptions[0].text : 'General Inquiry',
      message: msgEl && msgEl.value.trim() ? msgEl.value.trim() : 'Callback requested',
      formType: formId === 'contactForm' ? 'Main Contact Form' : 'Callback Modal Request',
      sourcePage: document.title || window.location.pathname,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    // 1. LocalStorage Offline Backup (inquiries are never lost)
    try {
      const storedLeads = JSON.parse(localStorage.getItem('alpha_lead_leads') || '[]');
      storedLeads.unshift(leadData);
      localStorage.setItem('alpha_lead_leads', JSON.stringify(storedLeads.slice(0, 50)));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }

    // 2. Prepare WhatsApp Forwarding URL
    const waText = 
      `*New Alpha Lead Inquiry*\n\n` +
      `*Name:* ${leadData.name}\n` +
      `*Phone:* ${leadData.phone}\n` +
      `*Email:* ${leadData.email}\n` +
      `*Programme:* ${leadData.programme}\n` +
      `*Message:* ${leadData.message}\n` +
      `*Source:* ${leadData.sourcePage}`;
    const waUrl = `https://wa.me/${FORM_CONFIG.whatsappNumber}?text=${encodeURIComponent(waText)}`;

    // Show loading state
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

    // 3. Dispatch to Google Sheets Webhook (if URL configured)
    if (FORM_CONFIG.googleScriptUrl) {
      fetch(FORM_CONFIG.googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      }).catch(err => console.warn('Google Sheets dispatch error:', err));
    }

    // 4. Dispatch to Web3Forms Email Service (if key configured)
    if (FORM_CONFIG.web3formsAccessKey) {
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: FORM_CONFIG.web3formsAccessKey,
          subject: `New Lead: ${leadData.name} - ${leadData.programme}`,
          from_name: 'Alpha Lead Academy Admissions',
          name: leadData.name,
          phone: leadData.phone,
          email: leadData.email,
          programme: leadData.programme,
          message: leadData.message,
          source_page: leadData.sourcePage
        })
      }).catch(err => console.warn('Web3Forms dispatch error:', err));
    }

    // Wait short simulated time for UI feedback
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }

      // Render Rich Success Feedback
      feedbackBox.className = 'form-feedback success';
      feedbackBox.setAttribute('role', 'alert');
      feedbackBox.setAttribute('aria-live', 'polite');
      feedbackBox.innerHTML = `
        <div class="success-icon-badge" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div style="flex: 1;">
          <strong style="display:block; color:var(--color-status-green, #15803d); font-size:1rem; margin-bottom:4px;">
            Inquiry Received Successfully!
          </strong>
          <span style="display:block; color:var(--color-text-secondary, #475569); font-size:0.875rem; line-height:1.5;">
            Thank you, <strong>${escapeHtml(leadData.name)}</strong>. Your details have been sent to our Senior Mentors. We will reach you at <strong>${escapeHtml(leadData.phone)}</strong> within 24 hours.
          </span>
          <div style="margin-top: 12px;">
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-direct">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
              </svg>
              <span>Connect on WhatsApp for Instant Response &rarr;</span>
            </a>
          </div>
        </div>
      `;
      feedbackBox.style.display = 'flex';

      form.reset();
      feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Automatically launch WhatsApp in new tab for instant engagement
      try {
        window.open(waUrl, '_blank');
      } catch (e) {}
    }, 700);
  });
}

function createFeedbackBox(form) {
  const box = document.createElement('div');
  box.className = 'form-feedback';
  form.prepend(box);
  return box;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.innerText = str;
  return div.innerHTML;
}
