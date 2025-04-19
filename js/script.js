document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => span.classList.toggle('active'));
    });
    
    // Tab Navigation
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            btn.classList.add('active');
            const tabId = `${btn.dataset.tab}-tab`;
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Form Navigation
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const nextTab = btn.dataset.next;
            const nextTabBtn = document.querySelector(`.tab-btn[data-tab="${nextTab}"]`);
            nextTabBtn.click();
        });
    });
    
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const prevTab = btn.dataset.prev;
            const prevTabBtn = document.querySelector(`.tab-btn[data-tab="${prevTab}"]`);
            prevTabBtn.click();
        });
    });
    
    // Add Project Button
    const addProjectBtn = document.getElementById('add-project');
    const projectContainer = document.getElementById('project-container');
    let projectCount = 1;
    
    addProjectBtn?.addEventListener('click', () => {
        projectCount++;
        
        const projectEntry = document.createElement('div');
        projectEntry.className = 'project-entry';
        projectEntry.innerHTML = `
            <div class="form-group">
                <label for="project${projectCount}-name">Project ${projectCount} Name</label>
                <input type="text" id="project${projectCount}-name" name="project${projectCount}-name" placeholder="Enter project name">
            </div>
            <div class="form-group">
                <label for="project${projectCount}-link">Project ${projectCount} GitHub Link</label>
                <input type="text" id="project${projectCount}-link" name="project${projectCount}-link" placeholder="Enter GitHub repository URL">
            </div>
            <div class="form-group">
                <label for="project${projectCount}-desc">Project ${projectCount} Description</label>
                <textarea id="project${projectCount}-desc" name="project${projectCount}-desc" placeholder="Describe your project"></textarea>
            </div>
            <button type="button" class="remove-project-btn">Remove Project</button>
        `;
        
        projectContainer.appendChild(projectEntry);
        
        // Add event listener to the remove button
        const removeBtn = projectEntry.querySelector('.remove-project-btn');
        removeBtn.addEventListener('click', () => {
            projectEntry.remove();
        });
    });
    
    // Submit all forms
    const submitAllBtn = document.getElementById('submit-all');
    
    submitAllBtn?.addEventListener('click', () => {
        // Collect data from all forms
        const educationForm = document.getElementById('education-form');
        const portfolioForm = document.getElementById('portfolio-form');
        const projectsForm = document.getElementById('projects-form');
        const leetcodeForm = document.getElementById('leetcode-form');
        
        // Create FormData objects
        const educationData = new FormData(educationForm);
        const portfolioData = new FormData(portfolioForm);
        const projectsData = new FormData(projectsForm);
        const leetcodeData = new FormData(leetcodeForm);
        
        // Combine all data
        const allData = {
            education: Object.fromEntries(educationData),
            portfolio: Object.fromEntries(portfolioData),
            projects: Object.fromEntries(projectsData),
            leetcode: Object.fromEntries(leetcodeData)
        };
        
        // Store in localStorage for demo purposes
        localStorage.setItem('portfolioData', JSON.stringify(allData));
        
        // Redirect to templates section
        window.location.href = '#templates';
        
        // Show success message
        const alertBox = document.createElement('div');
        alertBox.className = 'alert-box';
        alertBox.textContent = 'Information saved successfully! Choose a template below.';
        alertBox.style.position = 'fixed';
        alertBox.style.top = '20px';
        alertBox.style.left = '50%';
        alertBox.style.transform = 'translateX(-50%)';
        alertBox.style.padding = '1rem 2rem';
        alertBox.style.backgroundColor = 'rgba(21, 20, 25, 0.9)';
        alertBox.style.color = '#FBFBFB';
        alertBox.style.borderRadius = '4px';
        alertBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        alertBox.style.zIndex = '1000';
        
        document.body.appendChild(alertBox);
        
        // Remove the alert after 3 seconds
        setTimeout(() => {
            alertBox.style.opacity = '0';
            alertBox.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                document.body.removeChild(alertBox);
            }, 500);
        }, 3000);
    });
    
    // Template Selection
    const templateBtns = document.querySelectorAll('.select-template-btn');
    const templateModal = document.getElementById('template-modal');
    const closeModal = document.querySelector('.close-modal');
    const templatePreview = document.getElementById('template-preview');
    const downloadBtn = document.getElementById('download-portfolio');
    
    templateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const templateName = btn.dataset.template;
            
            // Set the template name in localStorage
            localStorage.setItem('selectedTemplate', templateName);
            
            // Show the modal
            templateModal.classList.add('show');
            
            // Load the preview (in a real application, this would be a dynamic preview)
            templatePreview.src = `templates/${templateName}.html`;
            
            // For demo purposes, we're using a timeout to simulate loading
            setTimeout(() => {
                // Redirect to preview page
                window.location.href = 'preview.html';
            }, 1000);
        });
    });
    
    closeModal?.addEventListener('click', () => {
        templateModal.classList.remove('show');
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === templateModal) {
            templateModal.classList.remove('show');
        }
    });
    
    downloadBtn?.addEventListener('click', () => {
        // In a real application, this would trigger a download
        alert('Your portfolio files are being prepared for download.');
        
        // For demo purposes, we'll just close the modal
        templateModal.classList.remove('show');
    });
});