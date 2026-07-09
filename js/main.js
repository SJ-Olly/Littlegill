/*
  Littlegill — minimal interactions.
  Everything here maps to native Elementor behaviour:
  * header style change on scroll  -> Elementor sticky header effects
  * mobile menu toggle             -> Elementor nav menu widget
  * fade-in on scroll              -> Elementor motion effects (fade up)
  * mobile CTA bar after the hero  -> Elementor sticky bottom bar
*/
(function () {
  'use strict';

  var header = document.getElementById('header');
  var hero = document.querySelector('.hero, .page-hero');
  var mobileCta = document.getElementById('mobile-cta');
  var toggle = document.querySelector('.header__toggle');
  var nav = document.getElementById('site-nav');

  /* Header: solid once the hero is mostly out of view; mobile CTA appears then too */
  if ('IntersectionObserver' in window && hero) {
    var heroWatcher = new IntersectionObserver(function (entries) {
      var heroVisible = entries[0].isIntersecting;
      header.classList.toggle('is-scrolled', !heroVisible);
      if (mobileCta) {
        mobileCta.classList.toggle('is-visible', !heroVisible);
      }
    }, { rootMargin: '-72px 0px 0px 0px' });
    heroWatcher.observe(hero);
  } else {
    header.classList.add('is-scrolled');
  }

  /* Mobile navigation toggle */
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      header.classList.toggle('nav-open', !open);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && header.classList.contains('nav-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        header.classList.remove('nav-open');
        toggle.focus();
      }
    });
  }

  /* Reveal on scroll */
  var revealables = document.querySelectorAll('.reveal');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealWatcher = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealWatcher.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealables.forEach(function (el) { revealWatcher.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Basic lightbox (gallery page only; Elementor equivalent is built in) */
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var items = Array.prototype.slice.call(document.querySelectorAll('.masonry__item'));
    var lightboxImage = document.getElementById('lightbox-image');
    var lightboxCaption = document.getElementById('lightbox-caption');
    var closeButton = lightbox.querySelector('.lightbox__close');
    var prevButton = lightbox.querySelector('.lightbox__prev');
    var nextButton = lightbox.querySelector('.lightbox__next');
    var current = 0;
    var lastFocused = null;

    var show = function (index) {
      current = (index + items.length) % items.length;
      var img = items[current].querySelector('img');
      var caption = items[current].parentElement.querySelector('figcaption');
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightboxCaption.textContent = caption ? caption.textContent : '';
    };

    var open = function (index) {
      lastFocused = document.activeElement;
      show(index);
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      closeButton.focus();
    };

    var close = function () {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocused) { lastFocused.focus(); }
    };

    items.forEach(function (item, index) {
      item.addEventListener('click', function () { open(index); });
    });

    closeButton.addEventListener('click', close);
    prevButton.addEventListener('click', function () { show(current - 1); });
    nextButton.addEventListener('click', function () { show(current + 1); });

    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) { close(); }
    });

    document.addEventListener('keydown', function (event) {
      if (!lightbox.classList.contains('is-open')) { return; }
      if (event.key === 'Escape') { close(); }
      if (event.key === 'ArrowLeft') { show(current - 1); }
      if (event.key === 'ArrowRight') { show(current + 1); }
    });
  }
})();
