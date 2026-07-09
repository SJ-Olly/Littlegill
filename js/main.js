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
  var hero = document.querySelector('.hero');
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
})();
