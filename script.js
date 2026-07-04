const header = document.getElementById("siteHeader");
const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");
const mobileLinks = mobileMenu.querySelectorAll("a");
const form = document.getElementById("estimateForm");
const formMessage = document.getElementById("formMessage");
const currentYear = document.getElementById("currentYear");

const websiteImageSlots = [
  {
    id: "hero-background",
    selector: ".hero-image",
    type: "background"
  },
  {
    id: "statement-image",
    selector: ".statement-image",
    type: "background"
  },
  {
    id: "project-1",
    selector: ".project-image-one",
    type: "background"
  },
  {
    id: "project-2",
    selector: ".project-image-two",
    type: "background"
  },
  {
    id: "project-3",
    selector: ".project-image-three",
    type: "background"
  },
  {
    id: "project-4",
    selector: ".project-image-four",
    type: "background"
  },
  {
    id: "experience-background",
    selector: ".experience-background",
    type: "background"
  }
];

function applySavedWebsiteImages() {
  const savedImages = localStorage.getItem("daniloWebsiteImages");

  if (!savedImages) {
    return;
  }

  try {
    const parsedImages = JSON.parse(savedImages);

    websiteImageSlots.forEach((slot) => {
      const source = parsedImages[slot.id];
      const target = document.querySelector(slot.selector);

      if (!source || !target) {
        return;
      }

      target.style.backgroundImage = `url("${source}")`;
    });
  } catch (error) {
    console.warn("Unable to apply saved website images.", error);
  }
}

window.addEventListener("storage", (event) => {
  if (event.key === "daniloWebsiteImages") {
    applySavedWebsiteImages();
  }
});

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

window.addEventListener("scroll", () => {
  if (window.scrollY > 80) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

menuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
  document.body.classList.toggle("menu-open");
});

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
  });
});

if (form && formMessage) {
  form.addEventListener("submit", () => {
    const hiddenName = form.querySelector('input[name="name"]');
    const hiddenService = form.querySelector('input[name="service"]');
    const firstName = (form.querySelector('input[name="firstName"]')?.value || "").trim();
    const lastName = (form.querySelector('input[name="lastName"]')?.value || "").trim();

    if (hiddenName) {
      hiddenName.value = `${firstName} ${lastName}`.trim();
    }

    if (hiddenService) {
      hiddenService.value = "";
    }

    formMessage.textContent =
      "Thank you. Your estimate request is ready to be connected to email.";
  });
}

applySavedWebsiteImages();

if (typeof gsap !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".brand", {
    y: -30,
    opacity: 0,
    duration: 1,
    delay: 0.3,
    ease: "power3.out"
  });

  gsap.from(".desktop-nav a", {
    y: -20,
    opacity: 0,
    duration: 0.8,
    delay: 0.5,
    stagger: 0.08,
    ease: "power3.out"
  });

  gsap.from(".estimate-button", {
    y: -20,
    opacity: 0,
    duration: 0.8,
    delay: 0.7,
    ease: "power3.out"
  });

  gsap.from(".hero-eyebrow", {
    y: 25,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    ease: "power3.out"
  });

  gsap.from(".title-line", {
    yPercent: 120,
    opacity: 0,
    duration: 1.35,
    delay: 0.35,
    stagger: 0.12,
    ease: "power4.out"
  });

  gsap.from(".hero-bottom", {
    y: 50,
    opacity: 0,
    duration: 1.2,
    delay: 1.1,
    ease: "power3.out"
  });

  gsap.to(".hero-image", {
    yPercent: 12,
    scale: 1.12,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.utils.toArray(".reveal").forEach((element) => {
    if (
      element.classList.contains("hero-eyebrow") ||
      element.classList.contains("hero-bottom")
    ) {
      return;
    }

    gsap.from(element, {
      y: 55,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 88%",
        toggleActions: "play none none none"
      }
    });
  });

  gsap.from(".intro-title span", {
    y: 90,
    opacity: 0,
    duration: 1.15,
    stagger: 0.1,
    ease: "power4.out",
    scrollTrigger: {
      trigger: ".intro-title",
      start: "top 82%"
    }
  });

  gsap.to(".image-cover", {
    scaleY: 0,
    duration: 1.4,
    ease: "power4.inOut",
    scrollTrigger: {
      trigger: ".statement-image",
      start: "top 78%"
    }
  });

  gsap.to(".statement-image", {
    backgroundPosition: "center 65%",
    ease: "none",
    scrollTrigger: {
      trigger: ".statement",
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.from(".service-item", {
    y: 60,
    opacity: 0,
    duration: 1,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".service-list",
      start: "top 82%"
    }
  });

  gsap.utils.toArray(".project-card").forEach((card) => {
    const image = card.querySelector(".project-image");

    gsap.from(card, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%"
      }
    });

    gsap.to(image, {
      backgroundPosition: "center 65%",
      ease: "none",
      scrollTrigger: {
        trigger: card,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });

  gsap.to(".experience-background", {
    yPercent: 12,
    scale: 1.08,
    ease: "none",
    scrollTrigger: {
      trigger: ".experience",
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.from(".experience-line", {
    xPercent: -15,
    opacity: 0,
    duration: 1.2,
    stagger: 0.15,
    ease: "power4.out",
    scrollTrigger: {
      trigger: ".experience-content h2",
      start: "top 78%"
    }
  });

  gsap.from(".contact-heading h2", {
    y: 90,
    opacity: 0,
    duration: 1.3,
    ease: "power4.out",
    scrollTrigger: {
      trigger: ".contact-heading",
      start: "top 80%"
    }
  });

  gsap.from(".estimate-form .form-field", {
    y: 45,
    opacity: 0,
    duration: 0.9,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".estimate-form",
      start: "top 82%"
    }
  });

  gsap.from(".submit-button", {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".submit-button",
      start: "top 92%"
    }
  });

  gsap.from(".footer-brand", {
    y: 80,
    opacity: 0,
    duration: 1.3,
    ease: "power4.out",
    scrollTrigger: {
      trigger: ".footer-brand",
      start: "top 90%"
    }
  });
}