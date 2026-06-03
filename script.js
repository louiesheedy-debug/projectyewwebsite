/* Project Yew — Shared JavaScript */

(function () {
  'use strict';

  // ── Nav scroll behaviour ──────────────────────────
  const nav = document.querySelector('nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile nav toggle ─────────────────────────────
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Scroll reveal ─────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, (entry.target.dataset.delay || 0) * 1);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => observer.observe(el));
  }

  // ── Staggered card reveal ─────────────────────────
  const staggerGroups = document.querySelectorAll('[data-stagger]');
  staggerGroups.forEach(group => {
    const children = group.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.dataset.delay = i * 120;
      child.style.transitionDelay = `${i * 0.1}s`;
    });
  });

  // ── Contact form ──────────────────────────────────
  const form = document.querySelector('#contact-form');
  const successEl = document.querySelector('.form-success');

  if (form && successEl) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        form.style.display = 'none';
        successEl.classList.add('show');
      }, 900);
    });
  }

  // ── Smooth anchor scrolling ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Yew tree grow-on-scroll ───────────────────────
  (function () {
    const SVG_H     = 1000;
    const DRAW_RANGE = 0.13;

    // Seeded RNG so tree shape varies each page load
    let _s = Date.now() % 999983;
    const rng = () => { _s = (_s * 16807) % 2147483647; return (_s - 1) / 2147483646; };
    const rr  = (lo, hi) => lo + rng() * (hi - lo);

    // Single bezier leaf shape pointing in `angleDeg`
    const leafShape = (cx, cy, angleDeg, size) => {
      const l   = size * (0.75 + rng() * 0.5);
      const w   = l * 0.28;
      const rad = angleDeg * Math.PI / 180;
      const ex  = cx + Math.cos(rad) * l;
      const ey  = cy + Math.sin(rad) * l;
      const mx  = (cx + ex) / 2;
      const my  = (cy + ey) / 2;
      const nx  = Math.cos(rad + Math.PI / 2) * w;
      const ny  = Math.sin(rad + Math.PI / 2) * w;
      return `M ${cx.toFixed(1)} ${cy.toFixed(1)} ` +
             `C ${(mx+nx).toFixed(1)} ${(my+ny).toFixed(1)} ${(ex+nx*0.4).toFixed(1)} ${(ey+ny*0.4).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)} ` +
             `C ${(ex-nx*0.4).toFixed(1)} ${(ey-ny*0.4).toFixed(1)} ${(mx-nx).toFixed(1)} ${(my-ny).toFixed(1)} ${cx.toFixed(1)} ${cy.toFixed(1)} Z`;
    };

    // Fan of leaves around a tip point
    const leafCluster = (cx, cy, facingDeg, count, size) => {
      const spread = 65;
      return Array.from({ length: count }, (_, i) => {
        const a = count === 1
          ? facingDeg + rr(-10, 10)
          : facingDeg - spread / 2 + (spread / (count - 1)) * i + rr(-7, 7);
        const ox = rr(-size * 0.2, size * 0.2);
        const oy = rr(-size * 0.2, size * 0.2);
        return leafShape(cx + ox, cy + oy, a, size);
      }).join(' ');
    };

    // Quadratic bezier branch path with organic wobble
    const branch = (sx, sy, ex, ey) => {
      const mx = (sx + ex) / 2 + rr(-7, 7);
      const my = (sy + ey) / 2 + rr(-10, 4);
      return `M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
    };

    const bDefs = []; // { d, width, y }
    const lDefs = []; // { d, y }

    // Trunk — slightly wavy
    const w1 = rr(-5, 5), w2 = rr(-5, 5);
    bDefs.push({ d: `M 100 1000 C ${100+w1} 700 ${100+w2} 400 100 200 C 100 130 100 60 100 18`, width: 3.5, y: 1000 });

    // Branch pairs bottom → top
    const PAIRS = 7;
    for (let i = 0; i < PAIRS; i++) {
      const scale = 1 - i * 0.08;
      const sw    = Math.max(2.6 - i * 0.22, 0.9);
      const baseY = 855 - i * 118 + rr(-20, 20);

      // Occasionally throw in a wild branch that pokes out at an extreme angle
      const lWild = rng() > 0.55;
      const rWild = rng() > 0.55;

      // ── LEFT ──────────────────────────────────────
      const lY   = baseY + rr(-14, 14);
      const lAng = lWild ? rr(148, 165) : rr(172, 200); // wild = more upward
      const lLen = (lWild ? rr(105, 145) : rr(95, 130)) * scale;
      const lEx  = 100 + Math.cos(lAng * Math.PI / 180) * lLen;
      const lEy  = lY  + Math.sin(lAng * Math.PI / 180) * lLen * 0.42;
      bDefs.push({ d: branch(100, lY, lEx, lEy), width: sw, y: lY });

      // left sub-branch (longer, poking further out)
      const lt   = rr(0.42, 0.62);
      const lSx  = 100 + (lEx - 100) * lt;
      const lSy  = lY  + (lEy - lY)  * lt;
      const lSex = lSx + rr(-38, -18);
      const lSey = lSy + rr(-18, 8);
      bDefs.push({ d: branch(lSx, lSy, lSex, lSey), width: Math.max(sw - 0.85, 0.7), y: lSy });

      // occasional extra twig off sub-branch
      if (rng() > 0.5) {
        bDefs.push({ d: branch(lSex, lSey, lSex + rr(-18, -8), lSey + rr(-12, 4)), width: 0.6, y: lSey });
      }

      const lFace = lAng + rr(-18, 18);
      lDefs.push({ d: leafCluster(lEx,  lEy,  lFace,            7, 14 * scale), y: lEy  });
      lDefs.push({ d: leafCluster(lSex, lSey, lFace + rr(-25, 25), 5, 10 * scale), y: lSey });

      // ── RIGHT ─────────────────────────────────────
      const rY   = baseY - 30 + rr(-14, 14);
      const rAng = rWild ? rr(15, 32) : rr(-18, 10); // wild = more upward
      const rLen = (rWild ? rr(105, 145) : rr(95, 130)) * scale;
      const rEx  = 100 + Math.cos(rAng * Math.PI / 180) * rLen;
      const rEy  = rY  + Math.sin(rAng * Math.PI / 180) * rLen * 0.42;
      bDefs.push({ d: branch(100, rY, rEx, rEy), width: sw, y: rY });

      const rt   = rr(0.42, 0.62);
      const rSx  = 100 + (rEx - 100) * rt;
      const rSy  = rY  + (rEy - rY)  * rt;
      const rSex = rSx + rr(18, 38);
      const rSey = rSy + rr(-18, 8);
      bDefs.push({ d: branch(rSx, rSy, rSex, rSey), width: Math.max(sw - 0.85, 0.7), y: rSy });

      if (rng() > 0.5) {
        bDefs.push({ d: branch(rSex, rSey, rSex + rr(8, 18), rSey + rr(-12, 4)), width: 0.6, y: rSey });
      }

      const rFace = rAng + rr(-18, 18);
      lDefs.push({ d: leafCluster(rEx,  rEy,  rFace,            7, 14 * scale), y: rEy  });
      lDefs.push({ d: leafCluster(rSex, rSey, rFace + rr(-25, 25), 5, 10 * scale), y: rSey });
    }

    // A few random "stray" branches that poke out unexpectedly
    for (let k = 0; k < 4; k++) {
      const sY   = rr(200, 820);
      const side = rng() > 0.5;
      const sAng = side ? rr(145, 168) : rr(12, 35);
      const sLen = rr(50, 85);
      const sEx  = 100 + Math.cos(sAng * Math.PI / 180) * sLen;
      const sEy  = sY  + Math.sin(sAng * Math.PI / 180) * sLen * 0.5;
      bDefs.push({ d: branch(100, sY, sEx, sEy), width: rr(0.7, 1.3), y: sY });
      lDefs.push({ d: leafCluster(sEx, sEy, sAng + rr(-20, 20), 4, rr(7, 11)), y: sEy });
    }

    // Top canopy
    lDefs.push({ d: leafCluster(100, 18, -90,  9, 15), y: 18 });
    lDefs.push({ d: leafCluster(86,  32, -112, 5, 11), y: 32 });
    lDefs.push({ d: leafCluster(114, 29, -68,  5, 11), y: 29 });

    // Build SVG markup
    const bSVG = bDefs.map(b =>
      `<path class="yew-branch" stroke-width="${b.width.toFixed(1)}" d="${b.d}"/>`
    ).join('');
    const lSVG = lDefs.map(l =>
      `<path class="yew-leaf-el" data-y="${Math.round(l.y)}" d="${l.d}"/>`
    ).join('');

    document.body.insertAdjacentHTML('beforeend',
      `<div class="yew-tree-wrap" aria-hidden="true">
         <svg class="yew-tree-svg" viewBox="0 0 200 1000" xmlns="http://www.w3.org/2000/svg">
           ${bSVG}${lSVG}
         </svg>
       </div>`
    );

    const wrap     = document.querySelector('.yew-tree-wrap');
    const branches = Array.from(wrap.querySelectorAll('.yew-branch'));
    const leaves   = Array.from(wrap.querySelectorAll('.yew-leaf-el'));

    requestAnimationFrame(() => {
      const bMeta = branches.map((el, i) => {
        const len = el.getTotalLength();
        el.style.strokeDasharray  = len;
        el.style.strokeDashoffset = len;
        return { el, len, y: bDefs[i].y };
      });

      const tick = () => {
        const max = document.body.scrollHeight - window.innerHeight;
        const raw = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        const p   = raw * 0.88 + 0.12; // offset so trunk shows on load

        bMeta.forEach(bd => {
          const trigger = (1 - bd.y / SVG_H) * 0.75;
          const bp = Math.max(0, Math.min(1, (p - trigger) / DRAW_RANGE));
          bd.el.style.strokeDashoffset = bd.len * (1 - bp);
          bd.done = bp > 0.72;
        });

        leaves.forEach(leaf => {
          const cy     = parseFloat(leaf.dataset.y);
          const showAt = (1 - cy / SVG_H) * 0.75 + 0.09;
          leaf.classList.toggle('sprouted', p >= showAt);
        });
      };

      window.addEventListener('scroll', tick, { passive: true });
      tick();
    });
  })();

})();
