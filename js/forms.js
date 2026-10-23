/**
 * ALPHALEAD ACADEMY — FORM HANDLING & MULTI-CHANNEL INQUIRY DISPATCHER
 * 
 * Channels:
 * 1. Immediate WhatsApp Direct Forwarding (+91 99025 00649)
 * 2. Automated Google Sheets Multi-Tab CRM Router
 * 3. Web3Forms Direct Email Delivery (optional fallback)
 * 4. LocalStorage offline backup cache
 * 5. GA4 Conversion Event Tracking
 */

const FORM_CONFIG = {
  // Active contact details
  whatsappNumber: '919902500649',
  recipientEmail: 'shreeram.3969@gmail.com',
  
  // Google Sheets Webhook URL
  googleScriptUrl: 'https://script.google.com/macros/s/AKfycbyQJNOuDNNhnPuSfnGErFYHiBeAphZZl7n2DiwAi-fEadNx-4XZQROi7iTP9_mqY8D9dw/exec',
  
  // Web3Forms Access Key (optional)
  web3formsAccessKey: ''
};

// Sheet tab mapping per category
const SHEET_TAB_MAPPING = {
  general: 'General Inquiries',
  defence: 'Defence & SSB',
  career: 'Career Guidance',
  corporate: 'Corporate Solutions',
  stay: 'SSB Stay (2 AFSB)',
  callback: 'Express Callbacks'
};

document.addEventListener('DOMContentLoaded', () => {
  initFormValidation('contactForm');
  initFormValidation('callbackModalForm');
});

function detectCategory(form, formId) {
  if (formId === 'callbackModalForm') {
    return 'callback';
  }
  const explicitCategory = form.getAttribute('data-form-category');
  if (explicitCategory) {
    return explicitCategory.toLowerCase();
  }
  const path = window.location.pathname.toLowerCase();
  if (path.includes('defence')) return 'defence';
  if (path.includes('career')) return 'career';
  if (path.includes('corporate')) return 'corporate';
  if (path.includes('stay')) return 'stay';
  return 'general';
}

function initFormValidation(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const inputs = form.querySelectorAll('.form-control[required]');

  // Clear error state on user input
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

    const category = detectCategory(form, formId);
    const sheetTab = SHEET_TAB_MAPPING[category] || 'General Inquiries';

    // Helper to safely extract input values by name or fallback
    const getVal = (name, selector) => {
      const el = form.querySelector(`[name="${name}"]`) || (selector ? form.querySelector(selector) : null);
      if (!el) return '';
      if (el.tagName === 'SELECT') {
        return el.selectedOptions && el.selectedOptions[0] ? el.selectedOptions[0].text : el.value;
      }
      return el.value.trim();
    };

    // Extract all fields reliably across specific page schemas
    const fullName = getVal('fullName', 'input[type="text"]');
    const phone = getVal('phone', 'input[type="tel"]');
    const email = getVal('email', 'input[type="email"]');
    const programme = getVal('programme', 'select');
    const entryType = getVal('entryType', '#def-entry');
    const academicStatus = getVal('academicStatus', '#career-status');
    const company = getVal('company', '#corp-company');
    const focusArea = getVal('focusArea', '#corp-focus');
    const checkInDate = getVal('checkInDate', 'input[type="date"]');
    const reportingBatch = getVal('reportingBatch', '#stay-batch');
    const interest = getVal('interest', '#modal-vertical');
    const message = getVal('message', '#contact-message');
    const notes = getVal('notes', 'textarea');

    const leadData = {
      category: category,
      sheetTab: sheetTab,
      formType: formId === 'contactForm' ? `Main Form (${sheetTab})` : 'Quick Callback Modal',
      sourcePage: document.title || window.location.pathname,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      
      // Captured form fields
      fullName: fullName || 'Candidate',
      phone: phone || '',
      email: email || '',
      programme: programme || '',
      entryType: entryType || '',
      academicStatus: academicStatus || '',
      company: company || '',
      focusArea: focusArea || '',
      checkInDate: checkInDate || '',
      reportingBatch: reportingBatch || '',
      interest: interest || '',
      message: message || '',
      notes: notes || ''
    };

    // 0. GA4 Conversion Event Tracking
    if (typeof window.gtag === 'function') {
      try {
        window.gtag('event', 'generate_lead', {
          event_category: 'Admissions Lead',
          event_label: sheetTab,
          form_type: leadData.formType,
          page_path: window.location.pathname,
          value: 1
        });
      } catch (gtagErr) {
        console.warn('GA4 dispatch notice:', gtagErr);
      }
    }

    // 1. LocalStorage Offline Backup (inquiries are never lost)
    try {
      const storedLeads = JSON.parse(localStorage.getItem('alpha_lead_leads') || '[]');
      storedLeads.unshift(leadData);
      localStorage.setItem('alpha_lead_leads', JSON.stringify(storedLeads.slice(0, 50)));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }

    // 2. Prepare Tailored WhatsApp Message
    let waText = `*New Alpha Lead Inquiry — ${sheetTab}*\n\n` +
      `*Name:* ${leadData.fullName}\n` +
      `*Phone:* ${leadData.phone}\n` +
      `*Email:* ${leadData.email || 'N/A'}\n`;

    if (category === 'defence') {
      waText += `*Target Entry:* ${leadData.entryType || 'SSB Training'}\n` +
        `*Candidate Notes:* ${leadData.notes || 'None'}\n`;
    } else if (category === 'career') {
      waText += `*Academic / Status:* ${leadData.academicStatus || 'Candidate'}\n` +
        `*Target Goals:* ${leadData.notes || leadData.message || 'General'}\n`;
    } else if (category === 'corporate') {
      waText += `*Company:* ${leadData.company || 'Corporate'}\n` +
        `*Focus Area:* ${leadData.focusArea || 'Executive Development'}\n` +
        `*Objectives / Team:* ${leadData.notes || 'N/A'}\n`;
    } else if (category === 'stay') {
      waText += `*Check-In Date:* ${leadData.checkInDate || 'TBD'}\n` +
        `*2 AFSB Reporting Batch:* ${leadData.reportingBatch || 'Mysuru Board'}\n` +
        `*Arrival Notes:* ${leadData.notes || 'None'}\n`;
    } else if (category === 'callback') {
      waText += `*Interest Area:* ${leadData.interest || sheetTab}\n`;
    } else {
      waText += `*Programme:* ${leadData.programme || 'General Inquiry'}\n` +
        `*Message:* ${leadData.message || 'N/A'}\n`;
    }

    waText += `*Source Page:* ${leadData.sourcePage}`;
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

    // 3. Dispatch to Google Sheets Webhook
    if (FORM_CONFIG.googleScriptUrl) {
      fetch(FORM_CONFIG.googleScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      }).catch(err => console.warn('Google Sheets dispatch error:', err));
    }

    // 4. Dispatch to Web3Forms Email Service (if configured)
    if (FORM_CONFIG.web3formsAccessKey) {
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: FORM_CONFIG.web3formsAccessKey,
          subject: `New Lead [${sheetTab}]: ${leadData.fullName}`,
          from_name: 'Alpha Lead Academy Admissions',
          name: leadData.fullName,
          phone: leadData.phone,
          email: leadData.email,
          programme: sheetTab,
          message: waText,
          source_page: leadData.sourcePage
        })
      }).catch(err => console.warn('Web3Forms dispatch error:', err));
    }

    // Render Rich Success Feedback
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }

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
            Thank you, <strong>${escapeHtml(leadData.fullName)}</strong>. Your details have been routed directly to our Mentorship Team. We will connect with you at <strong>${escapeHtml(leadData.phone)}</strong> within 24 hours.
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
  div.innerText = str || '';
  return div.innerHTML;
}
