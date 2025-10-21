(function() {
	console.log("Carousel script loaded");

	const carouselContainers = document.querySelectorAll(".carousel-container");
	
	if (carouselContainers.length === 0) {
		console.log("No carousels found on this page");
		return;
	}

	let lightbox = document.querySelector('.lightbox');
	if (!lightbox) {
		lightbox = document.createElement('div');
		lightbox.className = 'lightbox';
		lightbox.innerHTML = `
			<span class="lightbox-close">&times;</span>
			<img class="lightbox-img" src="" alt="Full size image">
			<button class="lightbox-arrow lightbox-left">&#8249;</button>
			<button class="lightbox-arrow lightbox-right">&#8250;</button>
		`;
		document.body.appendChild(lightbox);
	}

	const lightboxImg = lightbox.querySelector('.lightbox-img');
	const lightboxClose = lightbox.querySelector('.lightbox-close');
	const lightboxLeft = lightbox.querySelector('.lightbox-left');
	const lightboxRight = lightbox.querySelector('.lightbox-right');

	let activeLightboxCarousel = null;

	function openLightbox(carousel, index) {
		const img = carousel.cards[index].querySelector('img');
		if (img) {
			lightboxImg.src = img.src;
			lightboxImg.alt = img.alt;
			lightbox.classList.add('active');
			document.body.style.overflow = 'hidden';
			activeLightboxCarousel = carousel;
		}
	}

	function closeLightbox() {
		lightbox.classList.remove('active');
		document.body.style.overflow = '';
		activeLightboxCarousel = null;
	}

	function navigateLightbox(direction) {
		if (activeLightboxCarousel) {
			const newIndex = (activeLightboxCarousel.currentIndex + direction + activeLightboxCarousel.cards.length) % activeLightboxCarousel.cards.length;
			activeLightboxCarousel.updateCarousel(newIndex);
			openLightbox(activeLightboxCarousel, newIndex);
		}
	}

	const newLightboxClose = lightboxClose.cloneNode(true);
	lightboxClose.parentNode.replaceChild(newLightboxClose, lightboxClose);
	
	const newLightboxLeft = lightboxLeft.cloneNode(true);
	lightboxLeft.parentNode.replaceChild(newLightboxLeft, lightboxLeft);
	
	const newLightboxRight = lightboxRight.cloneNode(true);
	lightboxRight.parentNode.replaceChild(newLightboxRight, lightboxRight);

	newLightboxClose.addEventListener('click', closeLightbox);

	newLightboxLeft.addEventListener('click', (e) => {
		e.stopPropagation();
		navigateLightbox(-1);
	});

	newLightboxRight.addEventListener('click', (e) => {
		e.stopPropagation();
		navigateLightbox(1);
	});

	lightbox.addEventListener('click', (e) => {
		if (e.target === lightbox) {
			closeLightbox();
		}
	});

	if (window.carouselKeyboardHandler) {
		document.removeEventListener("keydown", window.carouselKeyboardHandler);
	}

	window.carouselKeyboardHandler = function(e) {
		if (lightbox.classList.contains('active')) {
			if (e.key === "Escape") {
				closeLightbox();
			} else if (e.key === "ArrowLeft") {
				navigateLightbox(-1);
			} else if (e.key === "ArrowRight") {
				navigateLightbox(1);
			}
		}
	};
	document.addEventListener("keydown", window.carouselKeyboardHandler);

	if (window.carouselTouchStart) {
		document.removeEventListener("touchstart", window.carouselTouchStart);
	}
	if (window.carouselTouchEnd) {
		document.removeEventListener("touchend", window.carouselTouchEnd);
	}

	let touchStartX = 0;
	let touchEndX = 0;

	window.carouselTouchStart = function(e) {
		touchStartX = e.changedTouches[0].screenX;
	};

	window.carouselTouchEnd = function(e) {
		touchEndX = e.changedTouches[0].screenX;
		handleSwipe();
	};

	document.addEventListener("touchstart", window.carouselTouchStart);
	document.addEventListener("touchend", window.carouselTouchEnd);

	function handleSwipe() {
		const swipeThreshold = 50;
		const diff = touchStartX - touchEndX;

		if (Math.abs(diff) > swipeThreshold) {
			if (lightbox.classList.contains('active')) {
				if (diff > 0) {
					navigateLightbox(1);
				} else {
					navigateLightbox(-1);
				}
			}
		}
	}

	// Initialize each carousel
	carouselContainers.forEach(container => {
		const carousel = {
			container: container,
			cards: container.querySelectorAll(".card"),
			dots: container.querySelectorAll(".dot"),
			leftArrow: container.querySelector(".nav-arrow.left"),
			rightArrow: container.querySelector(".nav-arrow.right"),
			currentIndex: 0,
			isAnimating: false,

			updateCarousel: function(newIndex) {
				if (this.isAnimating) return;
				this.isAnimating = true;

				this.currentIndex = (newIndex + this.cards.length) % this.cards.length;

				this.cards.forEach((card, i) => {
					const offset = (i - this.currentIndex + this.cards.length) % this.cards.length;

					card.classList.remove(
						"center",
						"left-1",
						"left-2",
						"right-1",
						"right-2",
						"hidden"
					);

					if (offset === 0) {
						card.classList.add("center");
					} else if (offset === 1) {
						card.classList.add("right-1");
					} else if (offset === 2) {
						card.classList.add("right-2");
					} else if (offset === this.cards.length - 1) {
						card.classList.add("left-1");
					} else if (offset === this.cards.length - 2) {
						card.classList.add("left-2");
					} else {
						card.classList.add("hidden");
					}
				});

				this.dots.forEach((dot, i) => {
					dot.classList.toggle("active", i === this.currentIndex);
				});

				setTimeout(() => {
					this.isAnimating = false;
				}, 200);
			}
		};

		// Arrow navigation
		carousel.leftArrow.addEventListener("click", (e) => {
			e.stopPropagation();
			carousel.updateCarousel(carousel.currentIndex - 1);
		});

		carousel.rightArrow.addEventListener("click", (e) => {
			e.stopPropagation();
			carousel.updateCarousel(carousel.currentIndex + 1);
		});

		// Dot navigation
		carousel.dots.forEach((dot, i) => {
			dot.addEventListener("click", () => {
				carousel.updateCarousel(i);
			});
		});

		// Card click to open lightbox
		carousel.cards.forEach((card, i) => {
			card.addEventListener("click", () => {
				openLightbox(carousel, i);
			});
		});

		// Initialize carousel
		carousel.updateCarousel(0);
	});

	console.log(`Initialized ${carouselContainers.length} carousel(s)`);
})();