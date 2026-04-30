(function() {
  function getOffcanvasElement(trigger) {
    if (!trigger) return null;
    const target = trigger.getAttribute('data-bs-target') || trigger.getAttribute('data-target');
    return target ? document.querySelector(target) : null;
  }

  function createBackdrop() {
    const backdrop = document.createElement('div');
    backdrop.className = 'offcanvas-backdrop fade show';
    backdrop.setAttribute('data-bs-dismiss', 'offcanvas');
    return backdrop;
  }

  function showOffcanvas(offcanvas) {
    if (!offcanvas || offcanvas.classList.contains('show')) return;
    offcanvas.classList.add('show');
    offcanvas.style.visibility = 'visible';

    if (!document.querySelector('.offcanvas-backdrop')) {
      document.body.appendChild(createBackdrop());
    }
    document.body.classList.add('offcanvas-open');
  }

  function hideOffcanvas(offcanvas) {
    if (!offcanvas || !offcanvas.classList.contains('show')) return;
    offcanvas.classList.remove('show');
    offcanvas.style.visibility = 'hidden';

    const backdrop = document.querySelector('.offcanvas-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
    document.body.classList.remove('offcanvas-open');
  }

  document.addEventListener('click', function(event) {
    const trigger = event.target.closest('[data-bs-toggle="offcanvas"]');
    if (trigger) {
      event.preventDefault();
      const offcanvas = getOffcanvasElement(trigger);
      showOffcanvas(offcanvas);
      return;
    }

    const dismissControl = event.target.closest('[data-bs-dismiss="offcanvas"]');
    if (dismissControl) {
      event.preventDefault();
      const offcanvas = dismissControl.closest('.offcanvas');
      hideOffcanvas(offcanvas);
      return;
    }

    const backdrop = event.target.closest('.offcanvas-backdrop');
    if (backdrop) {
      event.preventDefault();
      const openOffcanvas = document.querySelector('.offcanvas.show');
      hideOffcanvas(openOffcanvas);
    }
  });

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      const openOffcanvas = document.querySelector('.offcanvas.show');
      hideOffcanvas(openOffcanvas);
    }
  });
})();
