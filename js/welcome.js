document.addEventListener('DOMContentLoaded', () => {
    const getStartedBtn = document.querySelector('.get-started-btn');
    
    // Add hover effect for the get started button
    getStartedBtn.addEventListener('mouseenter', () => {
        getStartedBtn.style.transform = 'translateY(-3px)';
        getStartedBtn.style.boxShadow = '0 10px 20px rgba(245, 110, 15, 0.3)';
    });
    
    getStartedBtn.addEventListener('mouseleave', () => {
        getStartedBtn.style.transform = '';
        getStartedBtn.style.boxShadow = '';
    });
    
    // Background animation enhancement
    const circles = document.querySelectorAll('.circle');
    
    circles.forEach(circle => {
        // Add random initial positions
        const randomX = Math.random() * 20 - 10;
        const randomY = Math.random() * 20 - 10;
        circle.style.transform = `translate(${randomX}px, ${randomY}px)`;
    });
    
    // Parallax effect on mouse move
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        circles.forEach((circle, index) => {
            const speed = (index + 1) * 20;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            circle.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
});