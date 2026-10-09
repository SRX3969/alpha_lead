/**
 * ALPHALEAD ACADEMY — ENHANCED ANIMATIONS & MICRO-INTERACTION ENGINE
 * Scroll reveals, Accordions, Modal Controller, Number Counters, and 3D Card Tilts
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
  initAccordions();
  initModals();
  initStatCounters();
  initCardTilt();
  initPlaceGalleryLightbox();
  initBlogController();
});

/**
 * 1. Intersection Observer for Scroll Reveals
 */
function initScrollReveals() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -20px 0px',
      threshold: 0.05
    });

    elements.forEach(el => observer.observe(el));
  } else {
    elements.forEach(el => el.classList.add('revealed'));
  }
}

/**
 * 2. Accessible Accordion Controller
 */
function initAccordions() {
  const accordions = document.querySelectorAll('.faq-accordion');

  accordions.forEach(accordion => {
    const triggers = accordion.querySelectorAll('.faq-trigger');

    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        const panelId = trigger.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);

        triggers.forEach(otherTrigger => {
          if (otherTrigger !== trigger) {
            otherTrigger.setAttribute('aria-expanded', 'false');
            const otherPanelId = otherTrigger.getAttribute('aria-controls');
            const otherPanel = document.getElementById(otherPanelId);
            if (otherPanel) {
              otherPanel.style.maxHeight = null;
            }
          }
        });

        if (isExpanded) {
          trigger.setAttribute('aria-expanded', 'false');
          if (panel) panel.style.maxHeight = null;
        } else {
          trigger.setAttribute('aria-expanded', 'true');
          if (panel) {
            panel.style.maxHeight = panel.scrollHeight + 'px';
          }
        }
      });

      trigger.addEventListener('keydown', (e) => {
        const triggerList = Array.from(triggers);
        const index = triggerList.indexOf(trigger);

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = triggerList[(index + 1) % triggerList.length];
          next.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = triggerList[(index - 1 + triggerList.length) % triggerList.length];
          prev.focus();
        }
      });
    });
  });
}

/**
 * 3. Accessible Modal Controller with Focus Management
 */
function initModals() {
  const openButtons = document.querySelectorAll('[data-modal-open]');
  const closeButtons = document.querySelectorAll('[data-modal-close]');
  let lastFocusedElement = null;

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-modal-open');
      const modal = document.getElementById(modalId);
      if (modal) {
        lastFocusedElement = document.activeElement;
        openModal(modal);
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) closeModal(modal, lastFocusedElement);
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal, lastFocusedElement);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModalEl = document.querySelector('.modal-overlay.open');
      if (openModalEl) {
        closeModal(openModalEl, lastFocusedElement);
      }
    }
  });
}

function openModal(modal) {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    const focusable = modal.querySelectorAll('input, select, textarea, button');
    if (focusable.length) {
      focusable[0].focus();
    }
  }, 100);
}

function closeModal(modal, returnFocusTarget) {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  if (returnFocusTarget) {
    returnFocusTarget.focus();
  }
}

/**
 * 4. Animated Number Counters
 */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-value[data-target]');
  if (!statNumbers.length) return;

  const countUp = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1400;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = target * easedProgress;

      if (target % 1 === 0) {
        el.textContent = `${prefix}${Math.floor(currentVal)}${suffix}`;
      } else {
        el.textContent = `${prefix}${currentVal.toFixed(1)}${suffix}`;
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
      }
    };

    requestAnimationFrame(updateCount);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    statNumbers.forEach(num => observer.observe(num));
  } else {
    statNumbers.forEach(num => countUp(num));
  }
}

/**
 * 5. Futuristic Subtle 3D Card Tilt on Desktop
 */
function initCardTilt() {
  // Disabled per institutional design principles (restrained, dignified interactions without cursor gimmicks)
}

/**
 * 6. Interactive Place Photo Gallery & Fullscreen Lightbox Engine
 * Enables multi-photo modal preview when clicking on dormitory stay or any specific facility
 */
const PLACE_GALLERIES = {
  dormitory: [
    {
      src: 'assets/images/live/dorm-beds.jpg',
      title: 'Candidate Quarters & Resting Bunk Beds',
      subtitle: 'Alpha Lead SSB Stay · Residential Wing',
      caption: 'Airy, spotless candidate dormitories equipped with comfortable orthopedic mattresses, fresh linens, individual lockable wardrobes, bedside reading lights, and dedicated personal charging ports in a quiet, undisturbed rest environment.'
    },
    {
      src: 'assets/images/live/dorm-study.jpg',
      title: 'SSB Study Lounge & Defence Library',
      subtitle: 'Alpha Lead SSB Stay · Academic Wing',
      caption: 'Spacious, silent study lounge stocked with latest defence journals, current affairs dossiers, OIR test practice sets, and comfortable study carrels with high-speed Wi-Fi for evening PIQ revision.'
    },
    {
      src: 'assets/images/live/dorm-dining.jpg',
      title: 'Hygienic Candidate Dining & Cafeteria',
      subtitle: 'Alpha Lead SSB Stay · Nutrition Wing',
      caption: 'Clean and well-maintained dining facility serving fresh, balanced, home-cooked vegetarian meals formulated for sustained physical stamina and mental alertness during rigorous SSB testing days.'
    },
    {
      src: 'assets/images/live/dorm-briefing.jpg',
      title: 'Pre-Reporting Briefing & Orientation Hall',
      subtitle: 'Alpha Lead SSB Stay · Briefing Wing',
      caption: 'Dedicated conference chamber where ex-officers and resident mentors conduct Day-1 document verification drills, reporting etiquette briefings, and Stage-1 screening mental conditioning before candidates walk to 2 AFSB.'
    },
    {
      src: 'assets/images/live/ssb-dormitory.jpg',
      title: 'Campus Facade & 2 AFSB Proximity',
      subtitle: 'Alpha Lead SSB Stay · Bannur Road Chamundi Vihar',
      caption: 'Strategic location situated approximately 300 metres from the 2 AFSB Selection Centre Mysuru reporting gate, eliminating early morning transit stress and traffic delays.'
    }
  ],
  defence: [
    {
      src: 'assets/images/live/gto-obstacles.jpg',
      title: 'Outdoor GTO Obstacle Training Course',
      subtitle: 'Alpha Lead Defence · GTO Training Grounds',
      caption: 'Full-scale obstacle course modeled on Services Selection Board specifications featuring PGT, HGT, FGT, Snake Race, and Command Task structures with Chamundi Hill backdrop, supervised by veteran GTO assessors.'
    },
    {
      src: 'assets/images/live/psych-hall.jpg',
      title: 'Psychological Assessment & TAT/WAT/SRT Chamber',
      subtitle: 'Alpha Lead Defence · Psychology Wing',
      caption: 'Acoustically treated, high-focus assessment hall where DIPR-trained psychologists conduct timed TAT, WAT, and SRT batteries under realistic SSB exam room conditions.'
    },
    {
      src: 'assets/images/live/defence-entrance.webp',
      title: 'Strategic Defence Lecture & Briefing Theater',
      subtitle: 'Alpha Lead Defence · Main Lecture Hall',
      caption: 'High-tech interactive lecture theater for NDA, CDS, AFCAT written examination coaching, Current Affairs debates, and Defence Strategy masterclasses.'
    },
    {
      src: 'assets/images/live/dorm-beds.jpg',
      title: 'SSB Residential Quarters (300m from 2 AFSB)',
      subtitle: 'Alpha Lead SSB Stay · Candidate Accommodation',
      caption: 'Comfortable, safe candidate dormitory stay right next to 2 AFSB Mysuru for outstation batch candidates during intensive 14-day and 21-day mentorship batches.'
    }
  ],
  corporate: [
    {
      src: 'assets/images/live/corporate-training.webp',
      title: 'Executive Leadership & Boardroom Training Studio',
      subtitle: 'Alpha Lead Corporate · Executive Wing',
      caption: 'Interactive executive seminar arena equipped for high-stakes leadership simulations, crisis management drills, and ethical decision-making workshops for senior CXOs and managers.'
    }
  ],
  career: [
    {
      src: 'assets/images/live/career-launchpad.webp',
      title: 'Personal Interview & Communication Studio',
      subtitle: 'Alpha Lead Career Launchpad · Studio Wing',
      caption: 'One-on-one interview simulation suites featuring audio-visual playback, body language analysis, and personalized feedback sessions for aspiring professionals.'
    }
  ]
};

function initPlaceGalleryLightbox() {
  let activePlaceKey = 'dormitory';
  let activePhotoIndex = 0;

  // 1. Ensure Lightbox DOM Element exists
  let overlay = document.querySelector('.place-lightbox-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'place-lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Place Photo Gallery');
    overlay.innerHTML = `
      <div class="place-lightbox-dialog">
        <div class="place-lightbox-header">
          <div class="place-lightbox-meta">
            <h3 class="place-lightbox-title" id="lbTitle">Place Name</h3>
            <span class="place-lightbox-counter" id="lbCounter">Photo 1 of 5</span>
          </div>
          <button type="button" class="place-lightbox-close" aria-label="Close photo gallery">&times;</button>
        </div>
        <div class="place-lightbox-stage">
          <button type="button" class="place-nav-btn place-nav-prev" aria-label="Previous photo">&#10094;</button>
          <img src="" alt="Place photo preview" class="place-lightbox-img" id="lbImg">
          <button type="button" class="place-nav-btn place-nav-next" aria-label="Next photo">&#10095;</button>
        </div>
        <div class="place-lightbox-footer">
          <p class="place-lightbox-caption" id="lbCaption"></p>
          <div class="place-lightbox-thumbs" id="lbThumbs"></div>
        </div>
      </div>
    `;
    overlay.style.display = 'none';
    document.body.appendChild(overlay);
  }

  const lbTitle = overlay.querySelector('#lbTitle');
  const lbCounter = overlay.querySelector('#lbCounter');
  const lbImg = overlay.querySelector('#lbImg');
  const lbCaption = overlay.querySelector('#lbCaption');
  const lbThumbs = overlay.querySelector('#lbThumbs');
  const closeBtn = overlay.querySelector('.place-lightbox-close');
  const prevBtn = overlay.querySelector('.place-nav-prev');
  const nextBtn = overlay.querySelector('.place-nav-next');

  function renderPhoto(index) {
    const photos = PLACE_GALLERIES[activePlaceKey] || PLACE_GALLERIES.dormitory;
    if (!photos || !photos.length) return;
    
    activePhotoIndex = ((index % photos.length) + photos.length) % photos.length;
    const item = photos[activePhotoIndex];

    lbImg.style.opacity = '0.3';
    setTimeout(() => {
      lbImg.src = item.src;
      lbImg.alt = item.title;
      lbImg.style.opacity = '1';
    }, 120);

    lbTitle.textContent = item.title;
    lbCounter.textContent = `Photo ${activePhotoIndex + 1} of ${photos.length} · ${item.subtitle || ''}`;
    lbCaption.textContent = item.caption || '';

    // Update thumbnails
    const thumbBtns = lbThumbs.querySelectorAll('.place-lb-thumb');
    thumbBtns.forEach((tb, i) => {
      if (i === activePhotoIndex) {
        tb.classList.add('active');
        tb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        tb.classList.remove('active');
      }
    });
  }

  function openPlaceLightbox(placeKey, startIndex = 0) {
    activePlaceKey = placeKey in PLACE_GALLERIES ? placeKey : 'dormitory';
    const photos = PLACE_GALLERIES[activePlaceKey];

    // Build thumbnails
    lbThumbs.innerHTML = '';
    photos.forEach((photo, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'place-lb-thumb' + (idx === startIndex ? ' active' : '');
      btn.setAttribute('aria-label', `View ${photo.title}`);
      btn.innerHTML = `<img src="${photo.src}" alt="${photo.title}" loading="lazy">`;
      btn.addEventListener('click', () => renderPhoto(idx));
      lbThumbs.appendChild(btn);
    });

    renderPhoto(startIndex);
    overlay.style.display = 'flex';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closePlaceLightbox() {
    overlay.classList.remove('open');
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  // Event Listeners for Lightbox
  closeBtn.addEventListener('click', closePlaceLightbox);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePlaceLightbox();
  });

  prevBtn.addEventListener('click', () => renderPhoto(activePhotoIndex - 1));
  nextBtn.addEventListener('click', () => renderPhoto(activePhotoIndex + 1));

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') closePlaceLightbox();
    if (e.key === 'ArrowLeft') renderPhoto(activePhotoIndex - 1);
    if (e.key === 'ArrowRight') renderPhoto(activePhotoIndex + 1);
  });

  // Attach triggers across all pages
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-place]');
    if (trigger) {
      e.preventDefault();
      const place = trigger.getAttribute('data-place');
      const idx = parseInt(trigger.getAttribute('data-place-idx') || '0', 10);
      openPlaceLightbox(place, isNaN(idx) ? 0 : idx);
    }
  });

  // Filter Tabs on Places Gallery (e.g. inside ssb-stay.html)
  const filterBtns = document.querySelectorAll('.place-filter-btn');
  const photoCards = document.querySelectorAll('.place-photo-card');

  if (filterBtns.length && photoCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        photoCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
}

/**
 * 7. Blog & Knowledge Hub Controller
 * Category filtering and full article dossier modal viewer
 */
const BLOG_ARTICLES = {
  'art-1': {
    title: 'TAT 1: Thematic Apperception Test Story Matrix',
    category: 'SSB Psychology & TAT',
    author: 'Group Captain Abhinav Chaturvedi (Retd) · DIPR-Trained Psychologist',
    readTime: '4 min read',
    html: `
      <div class="article-content-prose">
        <p>The Thematic Apperception Test (TAT) is one of the most critical psychological instruments administered during Stage-2 testing at the Services Selection Board (SSB). Candidates are projected 11 ambiguous pictures followed by 1 blank slide, each shown for 30 seconds followed by 4 minutes to write a story.</p>
        <h4>1. Deconstructing the Stimulus (The First 30 Seconds)</h4>
        <p>In TAT Picture 1, candidates frequently observe a scene depicting one or more characters engaged in an activity or confronting an ambiguous situation. The primary psychological failure occurs when candidates hallucinate elements not present in the stimulus, such as introducing weapons, crime, or miraculous occurrences.</p>
        <ul>
          <li><strong>Identify the Protagonist (Hero):</strong> Choose a character closest in age and gender to yourself. The hero is your psychological surrogate.</li>
          <li><strong>Identify the Mood and Setting:</strong> Ground the situation in reality (academic project, community initiative, rural development, or professional duty).</li>
          <li><strong>Establish the Catalyst:</strong> What past circumstances led to this exact moment?</li>
        </ul>
        <h4>2. The Three-Phase Narrative Structure</h4>
        <p>Every effective TAT story must strictly adhere to the DIPR evaluation matrix:</p>
        <ol>
          <li><strong>What led to the situation (Past - ~20% of story):</strong> Brief realistic background that necessitated action.</li>
          <li><strong>What is happening presently (Present - ~60% of story):</strong> The hero formulates a clear plan, mobilizes resources, seeks cooperation, and actively works toward solving the problem. Emphasize physical action, organizing ability, and determination.</li>
          <li><strong>What is the outcome (Future - ~20% of story):</strong> A logical, constructive, and happy conclusion. The outcome must directly result from the hero's hard work—never luck or divine intervention.</li>
        </ol>
        <h4>3. Assessor's Key Takeaway</h4>
        <p>The psychologist evaluates your Officer Like Qualities (OLQs)—specifically Initiative, Planning, Self-Confidence, and Sense of Responsibility. A story about persistent preparation and teamwork reflects far greater psychological maturity than a heroic fantasy.</p>
      </div>
    `
  },
  'art-2': {
    title: 'Mental Strength Required for Girls to Enter Defence Forces',
    category: 'Women in Armed Forces',
    author: 'Flight Lieutenant Namrata Chaturvedi (Retd) · IAF Aviator & Psychologist',
    readTime: '6 min read',
    html: `
      <div class="article-content-prose">
        <p><em>“The sky never asks if a girl is strong enough to fly — it is we, as parents and society, who must decide whether we will give her the strength to rise.”</em></p>
        <p>With the historic opening of the National Defence Academy (NDA) to female cadets and expanded permanent commissions across the Army, Navy, and Air Force, young women across India are answering the call to serve. However, donning the uniform requires not merely physical preparation, but deep mental steel.</p>
        <h4>1. Transcending Stereotypes & Societal Conditioning</h4>
        <p>From childhood, girls are frequently conditioned to prioritize accommodation and avoid physical risk. In military training, however, an officer must make rapid, uncompromising decisions where human lives and operational missions are at stake.</p>
        <ul>
          <li><strong>Decisiveness over Approval:</strong> Learn to voice tactical opinions with clarity and conviction in Group Discussions and Command Tasks.</li>
          <li><strong>Emotional Congruence:</strong> True mental strength is not suppression of emotion, but emotional regulation under acute stress.</li>
        </ul>
        <h4>2. Physical Conditioning is Mental Discipline</h4>
        <p>Military training standards demand rigorous cardiovascular stamina, upper-body strength, and endurance. When running the final lap with field gear, physical fatigue sets in; it is sheer mental resilience and mental self-talk that pushes a cadet across the finish line.</p>
        <h4>3. The Role of Mentorship and Parental Encouragement</h4>
        <p>At Alpha Lead Academy, we work closely with female aspirants to cultivate genuine military presence, confident body language, vocal modulation, and psychological resilience. The uniform demands excellence without gender distinction—and Indian women officers are demonstrating this excellence on every front.</p>
      </div>
    `
  },
  'art-3': {
    title: 'Common Mistakes NDA Aspirants Make in the Exam — And How to Avoid Them',
    category: 'NDA Preparation',
    author: 'Alpha Lead Defence Faculty',
    readTime: '5 min read',
    html: `
      <div class="article-content-prose">
        <p>Preparing for the National Defence Academy (NDA) written examination conducted by UPSC is the first milestone for thousands of class 11 and 12 students. Despite months of study, many promising candidates fall short of the cut-off due to tactical execution errors rather than lack of intelligence.</p>
        <h4>1. Mathematics Paper: The Time Trap</h4>
        <p>The Mathematics paper comprises 120 questions for 300 marks in 2.5 hours. Candidates have approximately 75 seconds per question.</p>
        <ul>
          <li><strong>The Trap:</strong> Getting trapped in lengthly 4-step Calculus or Trigonometric identities that drain 5–8 minutes.</li>
          <li><strong>The Strategy:</strong> Scan and categorize questions into 3 rounds. Round 1: Questions solvable in under 45 seconds (Matrices, Determinants, Vector Algebra, Statistics). Round 2: Moderate questions. Round 3: Difficult questions.</li>
        </ul>
        <h4>2. Negative Marking Ignorance</h4>
        <p>UPSC deducts 1/3rd mark for every wrong answer. Guesswork on 25 questions where you have no clue can wipe out your hard-earned score. Attempt only when you can logically eliminate at least two options.</p>
        <h4>3. General Ability Test (GAT) Imbalance</h4>
        <p>Candidates often focus excessively on History or Geography while ignoring English (200 marks). English vocabulary, spotting errors, and sentence improvement offer the highest return on investment for GAT score maximization.</p>
        <h4>4. Neglecting Physical Fitness</h4>
        <p>Do not wait until clearing the written exam to start running or doing pushups. A healthy physical routine enhances cognitive focus and ensures you are ready when the SSB call-up arrives.</p>
      </div>
    `
  },
  'art-4': {
    title: 'Defence Careers: Building a Life of Honour, Discipline & Adventure',
    category: 'Career Guidance',
    author: 'Group Captain Abhinav Chaturvedi (Retd)',
    readTime: '7 min read',
    html: `
      <div class="article-content-prose">
        <p>A career in the Armed Forces is fundamentally distinct from any corporate job. It is not an employment contract; it is a way of life defined by honour, operational purpose, camaraderie, and selfless service to the nation.</p>
        <h4>1. Commission Types: Permanent vs Short Service Commission</h4>
        <ul>
          <li><strong>Permanent Commission (PC):</strong> Service until superannuation with continuous career progression through staff and command appointments, leading up to senior flag ranks.</li>
          <li><strong>Short Service Commission (SSC):</strong> Initial tenure of 10 years, extendable by 4 years (total 14 years). Provides unmatched early leadership responsibility before transitioning into corporate executive leadership.</li>
        </ul>
        <h4>2. Diverse Branches & Specialized Roles</h4>
        <p>Whether you enter the Army, Navy, or Air Force, opportunities span tactical aviation, armored corps, submarine warfare, cyber intelligence, logistics, and aeronautical engineering. Every branch demands technical mastery paired with decisive human command.</p>
        <h4>3. The Intangible Rewards</h4>
        <p>No civilian career offers the privilege of commanding soldiers who trust your orders with their lives. The values forged in military service—uncompromising integrity, situational awareness, and poise under fire—remain with you for a lifetime.</p>
      </div>
    `
  },
  'art-5': {
    title: 'Should India Have a Uniform Civil Code (UCC)?',
    category: 'SSB GD & Lecturette',
    author: 'Wing Commander Rajagopal (Retd)',
    readTime: '8 min read',
    html: `
      <div class="article-content-prose">
        <p>The Uniform Civil Code (UCC) is a perennial favorite topic in SSB Group Discussions, Lecturettes, and Personal Interviews with the Interviewing Officer (IO). Candidates who take radical ideological stances invariably lose points. An aspiring officer must demonstrate constitutional depth, balanced maturity, and pragmatic national vision.</p>
        <h4>1. Constitutional Foundation</h4>
        <p><strong>Article 44</strong> of the Directive Principles of State Policy states: <em>“The State shall endeavour to secure for the citizens a Uniform Civil Code throughout the territory of India.”</em></p>
        <h4>2. Arguments in Favor (Lead 1)</h4>
        <ul>
          <li><strong>Gender Justice & Equality:</strong> Personal laws across communities have historically exhibited discriminatory clauses regarding inheritance, polygamy, divorce, and maintenance. UCC establishes equal legal standing for women.</li>
          <li><strong>National Integration:</strong> A uniform set of civil laws governing marriage, succession, and guardianship fosters common citizenship and legal cohesion.</li>
          <li><strong>Precedents:</strong> The state of Goa has successfully functioned under a Uniform Civil Code for decades; Uttarakhand has enacted a state UCC with specific tribal exemptions.</li>
        </ul>
        <h4>3. Concerns & Counter-Arguments (Lead 2)</h4>
        <ul>
          <li><strong>Religious Freedom (Article 25):</strong> Minority communities express apprehension that uniform laws may dilute distinct religious traditions and cultural identities.</li>
          <li><strong>Tribal Customary Protections:</strong> India’s northeastern tribal areas have constitutionally protected customary rights (Article 371) that require delicate accommodation.</li>
        </ul>
        <h4>4. The Recommended Officer Standpoint</h4>
        <p>A balanced candidate concludes: <em>“UCC should be approached through consensus building, focusing primarily on eliminating gender discrimination in inheritance and maintenance, while protecting cultural diversity and respecting tribal autonomy.”</em></p>
      </div>
    `
  },
  'art-6': {
    title: 'Ranks of the Indian Army Starting from Sepoy to Field Marshal',
    category: 'Military Knowledge',
    author: 'Colonel Surendranath (Retd)',
    readTime: '5 min read',
    html: `
      <div class="article-content-prose">
        <p>Every defence aspirant appearing before the SSB Interviewing Officer must have thorough knowledge of the Armed Forces hierarchy. Below is the complete progression for the Indian Army with tri-service equivalents.</p>
        <h4>1. Non-Commissioned Officers (NCOs)</h4>
        <ul>
          <li><strong>Sepoy:</strong> Basic soldier rank (IAF: Aircraftman / Leading Aircraftman; Navy: Seaman II / Seaman I).</li>
          <li><strong>Lance Naik:</strong> Single chevron badge.</li>
          <li><strong>Naik:</strong> Two chevrons.</li>
          <li><strong>Havildar:</strong> Three chevrons (IAF: Sergeant; Navy: Petty Officer).</li>
        </ul>
        <h4>2. Junior Commissioned Officers (JCOs)</h4>
        <ul>
          <li><strong>Naib Subedar:</strong> One five-pointed star with a red-and-gold ribbon.</li>
          <li><strong>Subedar:</strong> Two stars with ribbon.</li>
          <li><strong>Subedar Major:</strong> National Emblem (Ashoka Lion) with ribbon.</li>
        </ul>
        <h4>3. Commissioned Officers</h4>
        <ol>
          <li><strong>Lieutenant:</strong> Two stars (IAF: Flying Officer; Navy: Sub Lieutenant).</li>
          <li><strong>Captain:</strong> Three stars (IAF: Flight Lieutenant; Navy: Lieutenant).</li>
          <li><strong>Major:</strong> National Emblem (IAF: Squadron Leader; Navy: Lieutenant Commander).</li>
          <li><strong>Lieutenant Colonel:</strong> National Emblem and one star (IAF: Wing Commander; Navy: Commander).</li>
          <li><strong>Colonel:</strong> National Emblem and two stars (IAF: Group Captain; Navy: Captain).</li>
          <li><strong>Brigadier:</strong> One star and National Emblem in triangular formation (IAF: Air Commodore; Navy: Commodore).</li>
          <li><strong>Major General:</strong> Crossed baton and saber with one star (IAF: Air Vice Marshal; Navy: Rear Admiral).</li>
          <li><strong>Lieutenant General:</strong> Crossed baton and saber with National Emblem (IAF: Air Marshal; Navy: Vice Admiral).</li>
          <li><strong>General:</strong> Chief of the Army Staff badge (IAF: Air Chief Marshal; Navy: Admiral).</li>
          <li><strong>Field Marshal:</strong> Honorary 5-star lifetime rank (held by Field Marshal Sam Manekshaw and Field Marshal K.M. Cariappa).</li>
        </ol>
      </div>
    `
  },
  'art-7': {
    title: 'Names and Locations of Premier Defence Training Academies in India',
    category: 'Academies & Induction',
    author: 'Group Captain Manoj Dayal (Retd)',
    readTime: '6 min read',
    html: `
      <div class="article-content-prose">
        <p>India’s officer training institutions are world-renowned for their grueling regimens, military discipline, and leadership excellence. Knowledge of these institutions is mandatory for all SSB interviews.</p>
        <h4>1. National Defence Academy (NDA) — Khadakwasla, Pune, Maharashtra</h4>
        <p>The world’s first tri-service academy where cadets of Army, Navy, and Air Force train together for 3 years before proceeding to their respective service academies. Motto: <em>“Seva Paramo Dharma”</em> (Service Before Self).</p>
        <h4>2. Indian Military Academy (IMA) — Dehradun, Uttarakhand</h4>
        <p>Premier cradle for Indian Army officer cadets from NDA, CDS (Direct Entry), and Technical Graduate Course. The Chetwode Motto defines the academy: <em>“The safety, honour and welfare of your country come first, always and every time...”</em></p>
        <h4>3. Officers Training Academy (OTA) — Chennai, Tamil Nadu</h4>
        <p>Specializes in training gentlemen and lady cadets for Short Service Commissions (SSC). Renowned for producing decorated combat leaders and pioneers in women officer induction.</p>
        <h4>4. Air Force Academy (AFA) — Dundigal, Hyderabad, Telangana</h4>
        <p>Conducts flying training on Pilatus PC-7 Mk II and Hawk 132 for IAF fighter, transport, and helicopter pilots, along with Ground Duty branches.</p>
        <h4>5. Indian Naval Academy (INA) — Ezhimala, Kannur, Kerala</h4>
        <p>Asia’s largest naval academy situated between Mount Dilli and the Arabian Sea. Motto: <em>“Vidyaya Amrutam Ashnute”</em> (Be Immortal Through Knowledge).</p>
      </div>
    `
  },
  'art-8': {
    title: 'What is the Strategic Significance of Siachen Glacier for India?',
    category: 'Geopolitics & Strategy',
    author: 'Group Captain Abhinav Chaturvedi (Retd)',
    readTime: '7 min read',
    html: `
      <div class="article-content-prose">
        <p>Situated in the eastern Karakoram range of the Himalayas at altitudes between 18,000 and 22,000 feet, the Siachen Glacier is known as the world’s highest, coldest battlefield. Understanding its strategic value is crucial for defence aspirants.</p>
        <h4>1. The Geostrategic Wedge</h4>
        <p>The glacier acts as a wedge separating Pakistan-Occupied Kashmir (POK) to the west from the Shaksgam Valley and Aksai Chin (occupied by China) to the north and east. If India were to vacate Siachen, Pakistan and China could link up geographically, directly threatening Ladakh and the Nubra Valley.</p>
        <h4>2. Operation Meghdoot (13 April 1984)</h4>
        <p>Under Operation Meghdoot, Indian troops air-landed on key passes of the <strong>Saltoro Ridge</strong> (Sia La, Bilafond La, and Gyong La), preempting Pakistani forces by days. Since then, India holds the dominant tactical heights overlooking Pakistani positions far below.</p>
        <h4>3. Logistical & Human Triumph</h4>
        <p>Maintaining troops at -50°C requires exceptional aviation support by IAF Cheetah and ALH Dhruv helicopters, and deep operational logistics. The bravery and tenacity of Indian soldiers at Siachen symbolize the pinnacle of military endurance.</p>
      </div>
    `
  },
  'art-9': {
    title: 'Should Extra-Curricular Activities Be Made Compulsory in Schools?',
    category: 'SSB GD & Personality',
    author: 'Dr. Gajendran Scientist \'F\'',
    readTime: '6 min read',
    html: `
      <div class="article-content-prose">
        <p>In modern education, the balance between academic excellence and holistic personality development is heavily debated. In SSB selection, assessors look for Officer Like Qualities (OLQs) like Initiative, Social Adaptability, and Stamina—qualities forged outside the textbook.</p>
        <h4>1. The Case for Making Them Mandatory</h4>
        <ul>
          <li><strong>Countering Sedentary Habits:</strong> Excessive screen time and competitive coaching classes lead to lifestyle disorders and social anxiety among youth.</li>
          <li><strong>Cultivating Team Dynamics:</strong> Sports, NCC, Scouting, and Debating teach children how to win with humility, lose with dignity, and cooperate within a team.</li>
          <li><strong>Identifying Hidden Talents:</strong> Compulsory exposure ensures that children discover athletic or creative aptitudes that parents might otherwise overlook.</li>
        </ul>
        <h4>2. The Case Against Rigid Compulsion</h4>
        <ul>
          <li><strong>Academic Overload:</strong> In crucial board exam years, forced participation in rigid activities without personal interest can generate severe mental stress.</li>
          <li><strong>Infrastructure Disparities:</strong> Many government and rural schools lack playgrounds, trainers, or musical equipment; making them compulsory would penalize underfunded institutions.</li>
        </ul>
        <h4>3. Synthesis for SSB Selection</h4>
        <p>A balanced officer perspective: <em>“Instead of punitive compulsion, schools should mandate active elective participation, offering diverse avenues ranging from athletics and drama to robotics and community service, graded purely on participation rather than perfection.”</em></p>
      </div>
    `
  }
};

function initBlogController() {
  const filterBtns = document.querySelectorAll('[data-blog-filter]');
  const blogCards = document.querySelectorAll('#blogCardsGrid .blog-card');
  const readBtns = document.querySelectorAll('[data-article-id]');
  const modal = document.getElementById('articleModal');

  // Filter Buttons
  if (filterBtns.length && blogCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-blog-filter');
        blogCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Read Dossier Modal Triggers
  if (readBtns.length && modal) {
    const modalTitle = document.getElementById('articleModalTitle');
    const modalAuthor = document.getElementById('articleModalAuthor');
    const modalContent = document.getElementById('articleModalContent');
    const categoryTag = document.getElementById('articleCategoryTag');

    readBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-article-id');
        const article = BLOG_ARTICLES[id];
        if (!article) return;

        if (modalTitle) modalTitle.textContent = article.title;
        if (modalAuthor) modalAuthor.textContent = `${article.author} · ${article.readTime}`;
        if (categoryTag) categoryTag.innerHTML = `<span class="telemetry-dot"></span> ${article.category.toUpperCase()}`;
        if (modalContent) modalContent.innerHTML = article.html;

        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });
  }
}

