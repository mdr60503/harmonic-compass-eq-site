const checkoutUrl = 'https://buy.stripe.com/6oU6oG2JiaAQfQLgYN8Ra00';

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

const compass = document.querySelector('.compass-canvas');

if (compass) {
  const context = compass.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const tau = Math.PI * 2;
  const bands = [
    { color: [109, 190, 190], start: 1.58, end: 2.42, phase: 0.4, speed: 0.43 },
    { color: [139, 176, 119], start: 2.72, end: 3.88, phase: 1.7, speed: 0.37 },
    { color: [227, 214, 181], start: 3.96, end: 5.45, phase: 2.9, speed: 0.31 },
    { color: [221, 108, 88], start: 5.57, end: 6.64, phase: 4.1, speed: 0.41 },
    { color: [235, 151, 67], start: 6.71, end: 7.66, phase: 5.3, speed: 0.35 }
  ];

  let size = 720;
  let animationFrame = 0;
  let lastTime = 0;

  const rgba = (color, alpha) => `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;

  function resizeCompass() {
    const bounds = compass.getBoundingClientRect();
    size = Math.max(280, Math.round(bounds.width || 720));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const pixelSize = Math.round(size * pixelRatio);

    if (compass.width !== pixelSize || compass.height !== pixelSize) {
      compass.width = pixelSize;
      compass.height = pixelSize;
    }

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function strokeOrbit(cx, cy, radius, alpha, width = 1) {
    context.beginPath();
    context.arc(cx, cy, radius, 0, tau);
    context.strokeStyle = `rgba(181, 196, 188, ${alpha})`;
    context.lineWidth = width;
    context.stroke();
  }

  function drawLattice(cx, cy, radius, time) {
    context.save();
    context.translate(cx, cy);
    context.rotate(Math.sin(time * 0.09) * 0.025);
    context.strokeStyle = 'rgba(128, 154, 145, 0.12)';
    context.lineWidth = Math.max(0.7, size * 0.0012);

    for (let index = 0; index < 6; index += 1) {
      const angle = (tau * index) / 6;
      const offset = radius * 0.26;
      context.beginPath();
      context.arc(
        Math.cos(angle) * offset,
        Math.sin(angle) * offset,
        radius * 0.45,
        0,
        tau
      );
      context.stroke();
    }

    context.restore();
  }

  function drawBand(band, bandIndex, cx, cy, baseRadius, time) {
    const breath = Math.sin(time * band.speed + band.phase);
    const radius = baseRadius + breath * size * 0.006;
    const start = band.start + Math.sin(time * 0.17 + band.phase) * 0.012;
    const end = band.end + Math.cos(time * 0.15 + band.phase) * 0.012;
    const lineWidth = size * 0.013;

    const tracePath = () => {
      context.beginPath();
      const steps = 72;
      for (let step = 0; step <= steps; step += 1) {
        const progress = step / steps;
        const angle = start + (end - start) * progress;
        const ripple = Math.sin(progress * Math.PI * 3 + time * 0.55 + band.phase) * size * 0.0024;
        const pointRadius = radius + ripple;
        const x = cx + Math.cos(angle) * pointRadius;
        const y = cy + Math.sin(angle) * pointRadius;
        if (step === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
    };

    context.save();
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.shadowColor = rgba(band.color, 0.62);
    context.shadowBlur = size * 0.024;
    tracePath();
    context.strokeStyle = rgba(band.color, 0.15);
    context.lineWidth = lineWidth * 2.45;
    context.stroke();

    context.shadowBlur = size * 0.01;
    tracePath();
    context.strokeStyle = rgba(band.color, 0.86);
    context.lineWidth = lineWidth;
    context.stroke();

    tracePath();
    context.strokeStyle = rgba([248, 241, 221], 0.3);
    context.lineWidth = Math.max(1, lineWidth * 0.16);
    context.stroke();

    const nodeProgress = 0.5 + Math.sin(time * band.speed * 0.92 + band.phase) * 0.22;
    const nodeAngle = start + (end - start) * nodeProgress;
    const nodeRadius = radius + Math.sin(time * 0.61 + band.phase) * size * 0.012;
    const nodeX = cx + Math.cos(nodeAngle) * nodeRadius;
    const nodeY = cy + Math.sin(nodeAngle) * nodeRadius;
    const nodeSize = size * (0.015 + Math.sin(time * 0.8 + bandIndex) * 0.0015);

    context.shadowBlur = size * 0.036;
    context.fillStyle = rgba(band.color, 0.14);
    context.beginPath();
    context.arc(nodeX, nodeY, nodeSize * 2.5, 0, tau);
    context.fill();

    context.shadowBlur = size * 0.015;
    context.fillStyle = rgba(band.color, 1);
    context.beginPath();
    context.arc(nodeX, nodeY, nodeSize, 0, tau);
    context.fill();

    context.shadowBlur = 0;
    context.strokeStyle = 'rgba(250, 244, 227, 0.62)';
    context.lineWidth = Math.max(1, size * 0.0014);
    context.stroke();
    context.restore();
  }

  function drawCore(cx, cy, time) {
    const pulse = 1 + Math.sin(time * 0.72) * 0.045;
    const outer = size * 0.069 * pulse;

    context.save();
    context.shadowColor = 'rgba(111, 173, 166, 0.28)';
    context.shadowBlur = size * 0.035;
    context.fillStyle = 'rgba(49, 67, 63, 0.62)';
    context.beginPath();
    context.arc(cx, cy, outer, 0, tau);
    context.fill();

    context.shadowBlur = 0;
    context.strokeStyle = 'rgba(129, 174, 167, 0.65)';
    context.lineWidth = size * 0.006;
    context.beginPath();
    context.arc(cx, cy, outer * 0.68, 0, tau);
    context.stroke();

    context.fillStyle = 'rgba(154, 186, 178, 0.92)';
    context.beginPath();
    context.arc(cx, cy, outer * 0.31, 0, tau);
    context.fill();

    context.fillStyle = 'rgba(10, 14, 13, 0.96)';
    context.beginPath();
    context.arc(cx, cy, outer * 0.13, 0, tau);
    context.fill();
    context.restore();
  }

  function drawFrame(timestamp) {
    resizeCompass();
    const time = reducedMotion.matches ? 2.4 : timestamp / 1000;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size * 0.31;

    context.clearRect(0, 0, size, size);
    drawLattice(cx, cy, radius, time);
    strokeOrbit(cx, cy, radius * 1.25, 0.08, size * 0.0012);
    strokeOrbit(cx, cy, radius * 1.06, 0.1, size * 0.001);
    strokeOrbit(cx, cy, radius * 0.72, 0.07, size * 0.001);

    bands.forEach((band, index) => drawBand(band, index, cx, cy, radius, time));

    const sweepAngle = time * 0.32;
    context.save();
    context.lineCap = 'round';
    context.strokeStyle = 'rgba(205, 222, 213, 0.16)';
    context.lineWidth = size * 0.0022;
    context.beginPath();
    context.arc(cx, cy, radius * 1.1, sweepAngle, sweepAngle + 0.56);
    context.stroke();
    context.restore();

    drawCore(cx, cy, time);
    lastTime = timestamp;

    if (!reducedMotion.matches && !document.hidden) {
      animationFrame = window.requestAnimationFrame(drawFrame);
    }
  }

  function restartAnimation() {
    window.cancelAnimationFrame(animationFrame);
    drawFrame(reducedMotion.matches ? 0 : performance.now());
  }

  const resizeObserver = new ResizeObserver(restartAnimation);
  resizeObserver.observe(compass);
  reducedMotion.addEventListener('change', restartAnimation);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) drawFrame(lastTime || performance.now());
    else window.cancelAnimationFrame(animationFrame);
  });

  restartAnimation();
}
