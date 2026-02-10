// Hero Effects: Magnetic buttons
document.addEventListener('DOMContentLoaded', function () {
    initMagneticButtons();
});

// Magnetic button effect — buttons subtly follow cursor when nearby
function initMagneticButtons() {
    var buttons = document.querySelectorAll('.magnetic-btn');
    if (!buttons.length) return;

    // Only enable on devices that have a pointer (no touch-only)
    if (window.matchMedia('(hover: none)').matches) return;

    var strength = 25; // max pixel offset
    var triggerDistance = 120; // px from button center to start attracting

    buttons.forEach(function (btn) {
        btn.addEventListener('mousemove', function (e) {
            var rect = btn.getBoundingClientRect();
            var cx = rect.left + rect.width / 2;
            var cy = rect.top + rect.height / 2;
            var dx = e.clientX - cx;
            var dy = e.clientY - cy;
            var dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < triggerDistance) {
                var pull = (triggerDistance - dist) / triggerDistance;
                var moveX = dx * pull * (strength / triggerDistance);
                var moveY = dy * pull * (strength / triggerDistance);
                btn.style.transform = 'translate(' + moveX + 'px, ' + moveY + 'px)';
            }
        });

        btn.addEventListener('mouseleave', function () {
            btn.style.transform = '';
        });
    });
}
