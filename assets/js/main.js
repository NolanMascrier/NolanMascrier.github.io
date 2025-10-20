document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");
  const links = document.querySelectorAll("header nav a");
  let scrollObserver = null;
  const pages = {
    home: `
      <br/><br/>
      <div class="animate-on-scroll">
        <h2>Welcome to My Portfolio</h2>
        <p>Explore my projects and get to know more about me.</p>
      </div>
    `,
    projects: `
      <br/><br/>
      <div class="animate-on-scroll">
        <h3>Project A</h3>
        <p>Short description of Project A.</p>
      </div>
      <br/><br/>
      <div class="animate-on-scroll">
        <h3>Project B</h3>
        <p>Short description of Project B.</p>
      </div>
      <br/><br/>
      <div class="animate-on-scroll">
        <h3>Project C</h3>
        <p>Short description of Project C.</p>
      </div>
    `,
    about: `
      <br/><br/>
      <div class="animate-on-scroll">
        <h2>About Me</h2>
        <p>I’m a developer passionate about building interactive and performant experiences.</p>
      </div>
    `,
    contact: `
      <br/><br/>
      <div class="animate-on-scroll">
        <h2>Contact</h2>
        <p>Feel free to reach out via email or through my social media.</p>
      </div>
    `
  };

  function setupScrollAnimations() {
    if (scrollObserver) {
      scrollObserver.disconnect();
    }
    scrollObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    }, { threshold: 0.2 });
    const toObserve = main.querySelectorAll(".animate-on-scroll");
    toObserve.forEach(el => scrollObserver.observe(el));
  }
  function changePage(target, pushHistory = true) {
    const content = pages[target];
    if (!content) return;
    main.classList.remove("animate");
    main.style.opacity = "0";

    setTimeout(() => {
      main.innerHTML = content;
      setupScrollAnimations();
      void main.offsetWidth;
      main.classList.add("animate");
      main.style.opacity = "1";
      links.forEach(a => a.classList.remove("active"));
      const currentLink = [...links].find(
        a => a.getAttribute("href").includes(target)
      );
      if (currentLink) currentLink.classList.add("active");
      if (pushHistory) {
        window.history.pushState({ page: target }, "", `#${target}`);
      }
      main.scrollIntoView({ behavior: "instant", block: "start" });
    }, 300);
  }
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = link.getAttribute("href").replace(".html", "").toLowerCase();
      changePage(page);
    });
  });
  window.addEventListener("popstate", e => {
    const page = e.state?.page || "home";
    changePage(page, false);
  });
  const initialHash = window.location.hash.replace("#", "") || "home";
  changePage(initialHash, false);
});
