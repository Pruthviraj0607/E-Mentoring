document.getElementById('fieldSelectionForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const selectedField = document.getElementById('fieldSelect').value;
    
    // Fetch information based on selected field
    const response = await fetch(`/api/fields/${selectedField}`);
    
    if (response.ok) {
        const data = await response.json();
        displayInformation(data);
    } else {
        alert('Error fetching information. Please try again.');
    }
});

function displayInformation(data) {
    const infoDisplay = document.getElementById('infoDisplay');
    
    // Clear previous info
    infoDisplay.innerHTML = '';
    
    // Display course information
    infoDisplay.innerHTML += `<h3>Courses:</h3><ul>${data.courses.map(course => `<li>${course}</li>`).join('')}</ul>`;
    
    // Display entrance exams
    infoDisplay.innerHTML += `<h3>Entrance Exams:</h3><ul>${data.exams.map(exam => `<li>${exam}</li>`).join('')}</ul>`;
    
    // Display related mentors
    infoDisplay.innerHTML += `<h3>Mentors:</h3><ul>${data.mentors.map(mentor => `<li>${mentor.name} - ${mentor.expertise}</li>`).join('')}</ul>`;
    
    // Display resources
    infoDisplay.innerHTML += `<h3>Resources:</h3><ul>${data.resources.map(resource => `<li><a href="${resource.link}">${resource.title}</a></li>`).join('')}</ul>`;
}