const checkoutUrl = 'https://buy.stripe.com/dRmeVfc6z1aO0ZR1BU1Fe01';

document.querySelectorAll('.checkout-link').forEach((link) => {
  if (checkoutUrl) {
    link.href = checkoutUrl;
    link.target = '_blank';
    link.rel = 'noopener';
    return;
  }

  link.setAttribute('aria-disabled', 'true');
  link.addEventListener('click', (event) => event.preventDefault());
});
