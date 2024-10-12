const lessonsApi = "../json/course.json";

fetch(lessonsApi)
    .then(response => response.json())
    .then(courses => {
        var htmls = courses.map(course => {
            return `<div onclick=window.location.assign("lesson.html?id=${course.id}")>
            <img src=${course.img_url}></img>
            <div class="course-title">${course.title}</div>
            <p class="course-description">${course.description}</p>
            
            </div>`;
        });
        document.getElementById("course-container").innerHTML = htmls.join("");
    });
