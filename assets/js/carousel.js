console.log("Carousel script loaded");

const cards = document.querySelectorAll(".card");
const dots = document.querySelectorAll(".dot");
const leftArrow = document.querySelector(".nav-arrow.left");
const rightArrow = document.querySelector(".nav-arrow.right");
let currentIndex = 0;
let isAnimating = false;

// Create lightbox elements
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
	<span class="lightbox-close">&times;</span>
	<img class="lightbox-img" src="" alt="Full size image">
	<button class="lightbox-arrow lightbox-left">&#8249;</button>
	<button class="lightbox-arrow lightbox-right">&#8250;</button>
`;
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector('.lightbox-img');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxLeft = lightbox.querySelector('.lightbox-left');
const lightboxRight = lightbox.querySelector('.lightbox-right');

function updateCarousel(newIndex) {
	if (isAnimating) return;
	isAnimating = true;

	currentIndex = (newIndex + cards.length) % cards.length;

	cards.forEach((card, i) => {
		const offset = (i - currentIndex + cards.length) % cards.length;

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
		} else if (offset === cards.length - 1) {
			card.classList.add("left-1");
		} else if (offset === cards.length - 2) {
			card.classList.add("left-2");
		} else {
			card.classList.add("hidden");
		}
	});

	dots.forEach((dot, i) => {
		dot.classList.toggle("active", i === currentIndex);
	});

	setTimeout(() => {
		isAnimating = false;
	}, 800);
}

// Lightbox functions
function openLightbox(index) {
	const img = cards[index].querySelector('img');
	if (img) {
		lightboxImg.src = img.src;
		lightboxImg.alt = img.alt;
		lightbox.classList.add('active');
		document.body.style.overflow = 'hidden'; // Prevent scrolling
	}
}

function closeLightbox() {
	lightbox.classList.remove('active');
	document.body.style.overflow = ''; // Restore scrolling
}

function navigateLightbox(direction) {
	const newIndex = (currentIndex + direction + cards.length) % cards.length;
	updateCarousel(newIndex);
	openLightbox(newIndex);
}

// Carousel navigation
leftArrow.addEventListener("click", (e) => {
	e.stopPropagation();
	updateCarousel(currentIndex - 1);
	console.log("Left arrow clicked");
});

rightArrow.addEventListener("click", (e) => {
	e.stopPropagation();
	updateCarousel(currentIndex + 1);
	console.log("Right arrow clicked");
});

dots.forEach((dot, i) => {
	dot.addEventListener("click", () => {
		updateCarousel(i);
	});
});

// Open lightbox when card is clicked
cards.forEach((card, i) => {
	card.addEventListener("click", () => {
		openLightbox(i);
	});
});

// Lightbox controls
lightboxClose.addEventListener('click', closeLightbox);

lightboxLeft.addEventListener('click', (e) => {
	e.stopPropagation();
	navigateLightbox(-1);
});

lightboxRight.addEventListener('click', (e) => {
	e.stopPropagation();
	navigateLightbox(1);
});

// Close lightbox when clicking outside the image
lightbox.addEventListener('click', (e) => {
	if (e.target === lightbox) {
		closeLightbox();
	}
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
	if (lightbox.classList.contains('active')) {
		if (e.key === "Escape") {
			closeLightbox();
		} else if (e.key === "ArrowLeft") {
			navigateLightbox(-1);
		} else if (e.key === "ArrowRight") {
			navigateLightbox(1);
		}
	} else {
		if (e.key === "ArrowLeft") {
			updateCarousel(currentIndex - 1);
		} else if (e.key === "ArrowRight") {
			updateCarousel(currentIndex + 1);
		}
	}
});

// Touch support for lightbox
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", (e) => {
	touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", (e) => {
	touchEndX = e.changedTouches[0].screenX;
	handleSwipe();
});

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
		} else {
			if (diff > 0) {
				updateCarousel(currentIndex + 1);
			} else {
				updateCarousel(currentIndex - 1);
			}
		}
	}
}

updateCarousel(0);