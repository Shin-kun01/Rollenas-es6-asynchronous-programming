class Student {
    constructor(id, name, age, course) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.course = course;
    }

    introduce() {
        return `Hi, my name is ${this.name}, I am ${this.age} years old, and I am enrolled in ${this.course}.`;
    }
}

class Instructor {
    constructor(id, name, subject) {
        this.id = id;
        this.name = name;
        this.subject = subject;
    }

    teach() {
        return `I am ${this.name} and I teach ${this.subject}.`;
    }
}

let jsonData = null;
let studentsArray = [];
let instructorsArray = [];

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ 
        behavior: 'smooth' 
    });
}

async function loadData() {
    try {
      
        const response = await fetch('data/students.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        jsonData = await response.json();
        console.log('Data loaded:', jsonData);
        
      
        loadClass();
        
    } catch (error) {
        console.error('Error loading data:', error);
  
        const student = document.getElementById('student');
        const instructor = document.getElementById('instructor');
        
        student.innerHTML = `<div style="color: #ef4444;">Error: Could not load students.json<br>Make sure students.json is in the <b>data</b> folder and the fetch path is correct</div>`;
        instructor.innerHTML = `<div style="color: #ef4444;">Error: Could not load students.json<br>Make sure students.json is in the <b>data</b> folder and the fetch path is correct</div>`;
    }
}

function fetchWithPromises() {
    const resultDiv = document.getElementById('promise-result');
    const button = document.getElementById('promises-btn');
    
    resultDiv.textContent = 'Loading...';
    button.disabled = true;
    
    fetch('data/students.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data fetched with promises:', data);
            jsonData = data;
            resultDiv.innerHTML = `
                ✓ Data fetched successfully!<br>
                Students: ${data.students.length}<br>
                Courses: ${data.courses.length}<br>
                Instructors: ${data.instructors.length}
            `;
            loadClass();
        })
        .catch(error => {
            console.error('Error fetching data with promises:', error);
            resultDiv.textContent = `Error: ${error.message}`;
        })
        .finally(() => {
            button.disabled = false;
        });
}

async function fetchWithAsyncAwait() {
    const resultDiv = document.getElementById('async-result');
    const button = document.getElementById('async-btn');
    
    resultDiv.textContent = 'Loading...';
    button.disabled = true;
    
    try {
        const response = await fetch('data/students.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Data fetched with async/await:', data);
        jsonData = data;
        resultDiv.innerHTML = `
            ✓ Data fetched successfully!<br>
            Students: ${data.students.length}<br>
            Courses: ${data.courses.length}<br>
            Instructors: ${data.instructors.length}
        `;
        loadClass();
    } catch (error) {
        console.error('Error fetching data with async/await:', error);
        resultDiv.textContent = `Error: ${error.message}`;
    } finally {
        button.disabled = false;
    }
}

function loadClass() {
    if (!jsonData) return;
    studentsArray = jsonData.students.slice(0, 3).map(s => 
        new Student(s.id, s.name, s.age, s.course)
    );
    instructorsArray = jsonData.instructors.slice(0, 2).map(i => 
        new Instructor(i.id, i.name, i.subject)
    );
    const student = document.getElementById('student');
    student.innerHTML = studentsArray.map(student => 
        `<div class="item-card">${student.introduce()}</div>`
    ).join('');
    const instructor = document.getElementById('instructor');
    instructor.innerHTML = instructorsArray.map(instructor => 
        `<div class="item-card">${instructor.teach()}</div>`
    ).join('');
}

async function loadAndDisplayData() {
    const outputDiv = document.getElementById('output');
    const button = document.getElementById('load-data-btn');
    outputDiv.innerHTML = '<div class="output-message">Loading data...</div>';
    button.disabled = true;
    try {
        if (!jsonData) {
            const response = await fetch('data/students.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            jsonData = await response.json();
        }
        outputDiv.innerHTML = `
            <div class="output-section">
                <h3>Students</h3>
                ${jsonData.students.map(student => {
                    const isOlder = student.age > 21;
                    return `
                        <div class="item-card ${isOlder ? 'highlight-older' : ''}">
                            <div class="name">${student.name}</div>
                            <div class="details">Age: ${student.age}</div>
                            <div class="details">Course: ${student.course}</div>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="output-section">
                <h3>Courses</h3>
                ${jsonData.courses.map(course => `
                    <div class="item-card">
                        <div class="name">${course.title}</div>
                        <div class="details">${course.description}</div>
                    </div>
                `).join('')}
            </div>
            <div class="output-section">
                <h3>Instructors</h3>
                ${jsonData.instructors.map(instructor => `
                    <div class="item-card">
                        <div class="name">${instructor.name}</div>
                        <div class="details">${instructor.subject}</div>
                    </div>
                `).join('')}
            </div>
        `;
        outputDiv.innerHTML += `
            <div style="grid-column: 1 / -1; background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 0.5rem; padding: 1rem; margin-top: 1rem;">
                <strong>Note:</strong> Students older than 21 are highlighted with ⭐ and special styling.
            </div>
        `;
    } catch (error) {
        outputDiv.innerHTML = `<div class="output-message" style="color: #ef4444;">Error loading data: ${error.message}</div>`;
    } finally {
        button.disabled = false;
    }
}

async function showDataRelationships() {
    const outputDiv = document.getElementById('relationships-output');
    const button = document.getElementById('relationships-btn');
    outputDiv.innerHTML = '<div class="output-message">Loading relationships...</div>';
    button.disabled = true;
    try {
        if (!jsonData) {
            const response = await fetch('data/students.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            jsonData = await response.json();
        }
        const courseInstructorMap = {
            "Computer Science": "John Rey Silverio",
            "Data Science": "Maria Santos", 
            "Cybersecurity": "Carlos Dela Cruz",
            "Information Technology": "John Rey Silverio",
            "Software Engineering": "John Rey Silverio"
        };
        let relationshipsHTML = `
            <div class="relationships-section">
                <h3>Student → Course → Description</h3>
                ${jsonData.students.map(student => {
                    const course = jsonData.courses.find(c => c.title === student.course);
                    return `
                        <div class="relationship-item">
                            <strong>${student.name}</strong>
                            <span class="relationship-arrow">→</span>
                            <strong>${student.course}</strong>
                            <span class="relationship-arrow">→</span>
                            <em>${course ? course.description : 'No description available'}</em>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="relationships-section">
                <h3>Course → Instructor</h3>
                ${jsonData.courses.map(course => {
                    const instructor = courseInstructorMap[course.title];
                    return `
                        <div class="relationship-item">
                            <strong>${course.title}</strong>
                            <span class="relationship-arrow">→</span>
                            <strong>${instructor ? `Taught by ${instructor}` : 'No instructor assigned'}</strong>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="relationships-section complete-chain">
                <h3>Complete Relationship Chain</h3>
                ${jsonData.students.filter(s => courseInstructorMap[s.course]).map(student => {
                    const course = jsonData.courses.find(c => c.title === student.course);
                    const instructor = courseInstructorMap[student.course];
                    return `
                        <div class="relationship-item">
                            <div>
                                <strong>${student.name}</strong> (${student.age}) 
                                studies <strong>${student.course}</strong> 
                                taught by <strong>${instructor}</strong>
                            </div>
                            <div style="color: #6b7280; font-style: italic; margin-top: 0.5rem;">
                                ${course ? course.description : 'No description available'}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        outputDiv.innerHTML = relationshipsHTML;
    } catch (error) {
        outputDiv.innerHTML = `<div class="output-message" style="color: #ef4444;">Error loading relationships: ${error.message}</div>`;
    } finally {
        button.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('ES6 Advanced JavaScript Concepts Ready');
    console.log('Features: ES6 Classes, Promises, Async/Await, Fetch API');
    loadData();
});