const courseApi = "../json/course.json";
const lessonApi = '../json/lesson.json';
const videoApi = '../json/video.json';

const course_id = window.location.search.substring(4);
const showVideo = document.getElementById("show-video");
const showTitle = document.getElementById("show-title");
const showDescription = document.getElementById("show-description");
const showAfter = document.getElementsByClassName("show-after");

var currentVideo = null;

fetch(courseApi)
    .then(response => response.json())
    .then(courses => {
        for (var i = 0; i < courses.length; i++) {
            if (courses[i].id == course_id) {
                showTitle.innerText = courses[i].title;
                showVideo.innerHTML = `<img src=${courses[i].img_url}>`;
                showDescription.innerHTML = courses[i].description;
                break;
            }
        }
    });

fetch(lessonApi)
    .then(response => response.json())
    .then(lessons => {
        var lessonID = [];
        var htmls = lessons.map(lesson => {
            if (lesson.course_id == course_id) {
                lessonID.push(lesson.id);
                return `<div class="lesson-block" >
                <div class="lesson-title" onclick="addCSS(this)">${lesson.title}</div>
                <div class="lesson-description">${lesson.description}</div>
                <div id="video-list-${lesson.id}"></div>
                </div>`;
            }
        });
        document.getElementById("lesson-container").innerHTML = htmls.join("");
        lessonID.forEach(id => videoCall(id));
    });

function videoCall(lesson_id) {
    fetch(videoApi)
        .then(response => response.json())
        .then(videos => {
            var htmls = videos.map(video => {
                if (video.lesson_id == lesson_id) {
                    return `<div class="video-title" onclick='getVideo(this,"${video.url}","${video.title}","${video.duration}","${video.description}")'>
                    <i class="fa-regular fa-circle-play"></i>
                    ${video.title}</div>`;
                }
            });
            document.getElementById("video-list-" + lesson_id).innerHTML = htmls.join("");
        });
}

function addCSS(element) {
    var next = element.nextElementSibling;
    if (next.style.display == "none") {
        next.style.display = "block";
        next.nextElementSibling.style.display = "block";
    }
    else {
        next.style.display = "none";
        next.nextElementSibling.style.display = "none";
    }
}

function getVideo(element, url, title, duration,description) {
    if (currentVideo) currentVideo.style.backgroundColor = "rgb(40,40,40)";
    element.style.backgroundColor = "rgb(60,60,60)";
    showVideo.innerHTML = `<iframe src=${url}></iframe>`;
    showTitle.innerHTML = title;
    document.getElementById("show-duration").innerHTML = duration;
    showDescription.innerHTML = description;
    showDescription.style.top = "90%";
    for (var i = 0; i < showAfter.length; i++) {
        showAfter[i].style.display = "block";
    }
    currentVideo = element;
}

function nextVideo() {
    var next = currentVideo.nextElementSibling;
    if (next) next.onclick();
    else {
        next = currentVideo.parentElement.parentElement;
        next = next.nextElementSibling;
        if (next) {
            next = next.children;
            next[1].style.display = next[2].style.display = "block";
            next[2].children[0].onclick();
        }
    }
}

function previousVideo() {
    var pre = currentVideo.previousElementSibling;
    if (pre) pre.onclick();
    else {
        pre = currentVideo.parentElement.parentElement;
        pre = pre.previousElementSibling;
        if (pre) {
            pre = pre.children;
            pre[1].style.display = pre[2].style.display = "block";
            pre = pre[2].children;
            pre[pre.length - 1].onclick();
        }
    }
}
