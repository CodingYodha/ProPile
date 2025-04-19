document.addEventListener('DOMContentLoaded', () => {
    // Get references to elements
    const loadingContainer = document.querySelector('.loading-container');
    const portfolioFrame = document.getElementById('portfolio-frame');
    const editBtn = document.getElementById('edit-btn');
    const templateBtn = document.getElementById('template-btn');
    const downloadBtn = document.getElementById('download-btn');
    const downloadModal = document.getElementById('download-modal');
    const closeModal = document.querySelector('.close-modal');
    const confirmDownload = document.getElementById('confirm-download');
    
    // Get data from localStorage
    const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '{}');
    const selectedTemplate = localStorage.getItem('selectedTemplate') || 'modern';
    
    // Load the template in the iframe
    portfolioFrame.src = `templates/${selectedTemplate}.html`;
    
    // Hide loading screen once the template is loaded
    portfolioFrame.addEventListener('load', () => {
        // Simulate a delay to make the loading more visible
        setTimeout(() => {
            loadingContainer.style.opacity = '0';
            loadingContainer.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                loadingContainer.style.display = 'none';
            }, 500);
            
            // Now populate the template with the data
            populateTemplate();
        }, 1500);
    });
    
    // Function to populate the template with the user's data
    function populateTemplate() {
        try {
            // Get the iframe's document
            const iframeDoc = portfolioFrame.contentDocument || portfolioFrame.contentWindow.document;
            
            // Populate the data in the template
            // This is just a basic example - in a real application, this would be more sophisticated
            
            // Education
            if (portfolioData.education) {
                const schoolElement = iframeDoc.getElementById('school');
                if (schoolElement && portfolioData.education.school) {
                    schoolElement.textContent = portfolioData.education.school;
                }
                
                const collegeElement = iframeDoc.getElementById('college');
                if (collegeElement && portfolioData.education.college) {
                    collegeElement.textContent = portfolioData.education.college;
                }
                
                const degreeElement = iframeDoc.getElementById('degree');
                if (degreeElement && portfolioData.education.degree) {
                    degreeElement.textContent = portfolioData.education.degree;
                }
                
                const graduationElement = iframeDoc.getElementById('graduation');
                if (graduationElement && portfolioData.education.graduation) {
                    graduationElement.textContent = portfolioData.education.graduation;
                }
            }
            
            // Portfolio
            if (portfolioData.portfolio) {
                const portfolioLinkElement = iframeDoc.getElementById('portfolio-link');
                if (portfolioLinkElement && portfolioData.portfolio['portfolio-link']) {
                    portfolioLinkElement.href = portfolioData.portfolio['portfolio-link'];
                    portfolioLinkElement.textContent = 'Portfolio';
                }
                
                const linkedinElement = iframeDoc.getElementById('linkedin');
                if (linkedinElement && portfolioData.portfolio.linkedin) {
                    linkedinElement.href = portfolioData.portfolio.linkedin;
                    linkedinElement.textContent = 'LinkedIn';
                }
                
                const githubElement = iframeDoc.getElementById('github');
                if (githubElement && portfolioData.portfolio.github) {
                    githubElement.href = portfolioData.portfolio.github;
                    githubElement.textContent = 'GitHub';
                }
            }
            
            // Projects - more complex, so we'll simplify for this example
            if (portfolioData.projects) {
                const projectsContainer = iframeDoc.getElementById('projects-container');
                if (projectsContainer) {
                    let projectsHTML = '';
                    
                    // Iterate through projects data
                    for (let i = 1; i <= 5; i++) {
                        const nameKey = `project${i}-name`;
                        const linkKey = `project${i}-link`;
                        const descKey = `project${i}-desc`;
                        
                        if (portfolioData.projects[nameKey]) {
                            projectsHTML += `
                                <div class="project-item">
                                    <h3>${portfolioData.projects[nameKey]}</h3>
                                    <p>${portfolioData.projects[descKey] || 'No description provided'}</p>
                                    <a href="${portfolioData.projects[linkKey] || '#'}" target="_blank" class="project-link">View Project</a>
                                </div>
                            `;
                        }
                    }
                    
                    projectsContainer.innerHTML = projectsHTML || '<p>No projects added yet.</p>';
                }
            }
            
            // LeetCode
            if (portfolioData.leetcode) {
                const leetcodeElement = iframeDoc.getElementById('leetcode-profile');
                if (leetcodeElement && portfolioData.leetcode['leetcode-profile']) {
                    leetcodeElement.href = portfolioData.leetcode['leetcode-profile'];
                    leetcodeElement.textContent = 'LeetCode Profile';
                }
                
                const problemsElement = iframeDoc.getElementById('problems-solved');
                if (problemsElement && portfolioData.leetcode['problems-solved']) {
                    problemsElement.textContent = portfolioData.leetcode['problems-solved'];
                }
            }
            
            // Set the name
            const nameElement = iframeDoc.getElementById('user-name');
            if (nameElement) {
                // Get user data from localStorage if available
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                
                if (userData.firstName && userData.lastName) {
                    nameElement.textContent = `${userData.firstName} ${userData.lastName}`;
                } else {
                    nameElement.textContent = 'Your Name';
                }
            }
            
        } catch (error) {
            console.error('Error populating template:', error);
        }
    }
    
    // Button event listeners
    editBtn?.addEventListener('click', () => {
        // In a real application, this would take you back to the form
        window.location.href = 'landing.html#portfolio-builder';
    });
    
    templateBtn?.addEventListener('click', () => {
        // In a real application, this would take you back to the templates section
        window.location.href = 'landing.html#templates';
    });
    
    downloadBtn?.addEventListener('click', () => {
        // Show the download modal
        downloadModal.classList.add('show');
    });
    
    closeModal?.addEventListener('click', () => {
        downloadModal.classList.remove('show');
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === downloadModal) {
            downloadModal.classList.remove('show');
        }
    });
    
    confirmDownload?.addEventListener('click', () => {
        // In a real application, this would trigger a download of the files
        
        // For demo purposes, we'll create a simple example of what would be downloaded
        const templateHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - ${JSON.parse(localStorage.getItem('user') || '{}').firstName || 'Your Name'}</title>
    <style>
        /* CSS would be here */
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        /* More styles would be included */
    </style>
</head>
<body>
    <header>
        <h1>Portfolio</h1>
        <!-- Navigation would be here -->
    </header>
    
    <main>
        <section id="about">
            <h2>About Me</h2>
            <p>Your personal details and introduction would be here.</p>
        </section>
        
        <section id="education">
            <h2>Education</h2>
            <!-- Education details would be populated here -->
        </section>
        
        <section id="projects">
            <h2>Projects</h2>
            <!-- Projects would be populated here -->
        </section>
        
        <!-- More sections would be included -->
    </main>
    
    <footer>
        <p>&copy; 2025 ${JSON.parse(localStorage.getItem('user') || '{}').firstName || 'Your Name'}. All rights reserved.</p>
    </footer>
    
    <script>
        // JavaScript would be here
    </script>
</body>
</html>
        `;
        
        // Create a blob and download link
        const blob = new Blob([templateHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio.html';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Close the modal
            downloadModal.classList.remove('show');
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.textContent = 'Files downloaded successfully!';
            successMessage.style.position = 'fixed';
            successMessage.style.top = '20px';
            successMessage.style.left = '50%';
            successMessage.style.transform = 'translateX(-50%)';
            successMessage.style.padding = '1rem 2rem';
            successMessage.style.backgroundColor = 'rgba(21, 20, 25, 0.9)';
            successMessage.style.color = '#FBFBFB';
            successMessage.style.borderRadius = '4px';
            successMessage.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            successMessage.style.zIndex = '1000';
            
            document.body.appendChild(successMessage);
            
            // Remove the message after 3 seconds
            setTimeout(() => {
                successMessage.style.opacity = '0';
                successMessage.style.transition = 'opacity 0.5s ease';
                
                setTimeout(() => {
                    document.body.removeChild(successMessage);
                }, 500);
            }, 3000);
        }, 100);
    });
});