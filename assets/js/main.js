document.addEventListener("DOMContentLoaded", () => {
  const main = document.querySelector("main");
  const links = document.querySelectorAll("header nav a");
  let scrollObserver = null;
  
  const pageFiles = {
    home: 'pages/home.html',
    projects: 'pages/projects.html',
    about: 'pages/about.html',
    contact: 'pages/contact.html'
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

  async function changePage(target, pushHistory = true) {
    const filePath = pageFiles[target];
    if (!filePath) return;
    
    // Fade out animation
    main.classList.remove("animate");
    main.style.opacity = "0";

    setTimeout(async () => {
      try {
        // Fetch the HTML file
        const response = await fetch(filePath);
        if (!response.ok) throw new Error('Page not found');
        const html = await response.text();
        
        // Load content
        main.innerHTML = html;
        
        // Execute any inline scripts in the loaded HTML
        const scripts = main.querySelectorAll('script');
        scripts.forEach(oldScript => {
          // Skip redirect protection scripts
          if (oldScript.textContent.includes('window.parent === window')) {
            oldScript.remove();
            return;
          }
          
          const newScript = document.createElement('script');
          // Copy attributes
          Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });
          // Copy script content
          newScript.textContent = oldScript.textContent;
          // Replace old script with new one to trigger execution
          oldScript.parentNode.replaceChild(newScript, oldScript);
        });
        
        setupScrollAnimations();
        
        // Fade in animation
        void main.offsetWidth;
        main.classList.add("animate");
        main.style.opacity = "1";
        
        // Update active link
        links.forEach(a => a.classList.remove("active"));
        const currentLink = [...links].find(
          a => a.getAttribute("href").includes(target)
        );
        if (currentLink) currentLink.classList.add("active");
        
        // Update URL
        if (pushHistory) {
          window.history.pushState({ page: target }, "", `#${target}`);
        }
        
        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: "instant" });
      } catch (error) {
        console.error('Error loading page:', error);
        main.innerHTML = '<div class="animate-on-scroll"><h2>Page not found</h2><p>Sorry, this page could not be loaded.</p></div>';
        main.style.opacity = "1";
      }
    }, 300);
  }

  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const page = link.getAttribute("href").replace(".html", "").replace("#", "").toLowerCase();
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