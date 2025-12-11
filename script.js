document.addEventListener("DOMContentLoaded", () => {
  const introLogo = document.getElementById("intro-logo");
  const headerLogo = document.getElementById("header-logo");
  const intro = document.getElementById("intro");
  const header = document.querySelector("header");
  const title = document.getElementById("site-title");
  const interviewContainers = document.querySelectorAll('.interview-container');

  introLogo.addEventListener("click", () => {
    const introRect = introLogo.getBoundingClientRect();
    const headerRect = headerLogo.getBoundingClientRect();
    const deltaX = headerRect.left + headerRect.width / 2 - (introRect.left + introRect.width / 2);
    const deltaY = headerRect.top + headerRect.height / 2 - (introRect.top + introRect.height / 2);
    const scale = headerRect.width / introRect.width;

    introLogo.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;

    setTimeout(() => {
      header.style.opacity = 1;
    }, 800);

    setTimeout(() => {
      title.classList.add("show-title");
      const navBar = document.getElementById("nav-bar");
      navBar.classList.add("show-nav");
      intro.style.display = "none";

      createBlurOverlay();
      setupAnswerReveal();
    }, 1000);
  });

  function createBlurOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'blur-overlay';
    overlay.style.cssText = `
      position: fixed;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(4px);
      mask-image: radial-gradient(circle, black 10%, transparent 70%);
      -webkit-mask-image: radial-gradient(circle, black 10%, transparent 70%);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s ease;
      z-index: 100;
    `;
    document.body.appendChild(overlay);

    title.addEventListener('mouseenter', () => {
      overlay.style.opacity = '1';
    });

    title.addEventListener('mousemove', (e) => {
      overlay.style.left = `${e.clientX - 40}px`;
      overlay.style.top = `${e.clientY - 40}px`;
    });

    title.addEventListener('mouseleave', () => {
      overlay.style.opacity = '0';
    });
  }

  interviewContainers.forEach(container => {
    container.addEventListener('click', () => {
      container.classList.toggle('active');
    });
  });

function showHintPhoto(imagePath, nextSection) {
  if (document.getElementById('hint-photo')) return;

  const hintButton = document.createElement('div');
  hintButton.id = 'hint-photo';
  hintButton.innerHTML = '↓';
  hintButton.style.cssText = `
    position: fixed;
    font-family: typeka-regular, sans-serif;
    bottom: 100px;
    right: 100px;
    width: 60px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    color: black;
    border: 0.7px solid black;
    border-radius: 40%;
    opacity: 0;
    transition: opacity 0.3s ease;
    cursor: pointer;
    z-index: 50;
     background-color: rgba(255, 255, 255, 0.05); /* semi-transparent white */
  backdrop-filter: blur(0.4rem);
  -webkit-backdrop-filter: blur(0.4rem);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  `;

  document.body.appendChild(hintButton);

  setTimeout(() => {
    hintButton.style.opacity = '1';
  }, 100);

  hintButton.addEventListener('click', () => {
    const targetSection = document.querySelector(nextSection);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  hintButton.addEventListener('mouseenter', () => {
    hintButton.style.transform = 'scale(1.1)';
    hintButton.style.background = 'black';
    hintButton.style.color = 'white';
  });

  hintButton.addEventListener('mouseleave', () => {
    hintButton.style.transform = 'scale(1)';
    hintButton.style.background = 'white';
    hintButton.style.color = 'black';
  });
}

  function setupAnswerReveal() {
    const answers = document.querySelectorAll('.answer');

    answers.forEach(answer => {
      const originalText = answer.textContent;

      answer.innerHTML = `
        <span class="blurred-text" style="filter: blur(2px);">${originalText}</span>
        <span class="clear-text" style="position: absolute; top: 0; left: 0; filter: blur(0px); clip-path: circle(0px at 0 0); pointer-events: none;">${originalText}</span>
      `;

      const clearText = answer.querySelector('.clear-text');
      const blurredText = answer.querySelector('.blurred-text');
      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      let isRevealed = false;
      answer.addEventListener('click', (e) => {
        e.stopPropagation(); // Add this line to prevent container click
        isRevealed = !isRevealed;
        if (isRevealed) {
          blurredText.style.filter = 'blur(0px)';
          clearText.style.clipPath = 'circle(100% at 50% 50%)';

          const hintImage = answer.getAttribute('data-hint-image');
          const nextSection = answer.getAttribute('data-next-section');
          showHintPhoto(hintImage, nextSection);
        } else {
          blurredText.style.filter = 'blur(2px)';
          clearText.style.clipPath = 'circle(0px at 0 0)';
          hideHintPhoto();
        }
      });

      if (!isMobile) {
        answer.addEventListener('mousemove', (e) => {
          if (!isRevealed) {
            const rect = answer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            clearText.style.clipPath = `circle(18px at ${x}px ${y}px)`;
          }
        });

        answer.addEventListener('mouseleave', () => {
          if (!isRevealed) {
            clearText.style.clipPath = 'circle(0px at 0 0)';
          }
        });
      }
    });
  }
});
// === NAV BLUR ON SCROLL ===
const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-item");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {

        // Remove active blur class from all nav items
        navItems.forEach((item) => item.classList.remove("active"));

        // Match nav item whose data-target equals section ID
        const match = document.querySelector(
          `.nav-item[data-target="${entry.target.id}"]`
        );

        if (match) match.classList.add("active");
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((section) => observer.observe(section));
