document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.parallax-track');
    if (!track) return;
    track.addEventListener('scroll', () => {
      const x = track.scrollLeft;
      track.querySelectorAll('.parallax-item').forEach(item => {
        const speed = parseFloat(item.dataset.speed);
        item.querySelector('img').style.transform = `translateX(${-x * speed}px)`;
      });
    });
  });
  