"use strict";
/* Back-end set up through Heroku where API is called using the access token as a process environment variable. */
let END = 'https://tybox-556e5650be9b.herokuapp.com/api/instagram';
async function fetchInstagramPosts() {
    try{
        let response = await fetch(END);
        if (!response.ok) throw new Error("Failed to fetch IG posts");
        let data = await response.json();
        console.log(data);
        return data.data;
    } catch(error) {
        console.error("Fetching error: ", error);
    }
}
/* displays IG posts into a container */
function displayIGFeed(posts) {
    let container = document.getElementById("feed");
    posts.forEach(post => {

        let postElement = document.createElement("div");
        postElement.classList.add("post");
        let content = `<a href="${post.permalink}" target="_blank">`;
        if (post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM") {
            content += `<img src="${post.media_url}" alt="${post.caption || ''}">`
        } else if (post.media_type === "VIDEO") {
            content += `<video controls><source src="${post.media_url}" type="video/mp4"></video>;`
        }
        content += `</a>`;
        postElement.innerHTML = content;
        container.appendChild(postElement)
    });
    /* Creates a carousel from posts */
    $("#feed").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        dots: true,
        infinite: true
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    let posts = await fetchInstagramPosts();
    console.log(posts);
    if (posts) {
        displayIGFeed(posts);
    }
})

/* Form validation */
function checkForm(event) {
    event.preventDefault();
    let valid = true;

    document.querySelectorAll('.error').forEach(error => error.textContent = '');
    let form = document.getElementById('contactForm')

    let name = document.getElementById('name');
    if (name.value.trim() === '') {
        document.getElementById('nameE').textContent = 'Name is required.'
        valid = false;
    }

    let phone = document.getElementById('phone');
    const phoneReg = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
    if (!phoneReg.test(phone.value)) {
        document.getElementById('phoneE').textContent = 'Phone number is invalid.'
        valid = false;
    }

    let email = document.getElementById('email');
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(email.value)) {
        document.getElementById('emailE').textContent = 'Email is invalid.'
        valid = false;
    }

    let contact = document.querySelector('input[name="contactMethod"]:checked');
    if (!contact) {
        document.getElementById('fieldE').textContent = 'Please choose a preferred method of contact.';
        valid = false;
    }

    if (valid) {
        let formData = new FormData(form);
        fetch(form.action, {
            method: 'POST',
            body: formData
        }) .then (response => {
            console.log('Form submitted successfully: ', response);
            let complete = document.getElementById('complete');
            complete.textContent = 'Thank you for reaching out! We will get back to you as soon as possible.';
            complete.style.color = 'green';
            form.reset();
        }) .catch (error => {
            console.error('Error submitting form: ', error);
        });
    }
}

/* dark mode toggle */
document.addEventListener("DOMContentLoaded", function () {
    let toggle = document.getElementById("toggle");
    let toToggle = document.querySelectorAll(".light-dark");
    let main = document.querySelector("#main");
    let grad = document.querySelector("#gradientcontainer")

    let prefTheme = localStorage.getItem("theme") || "light";
    applyTheme(prefTheme);
    
    toggle.addEventListener("click", function () {
        let newTheme = prefTheme === "light" ? "dark" : "light";
        applyTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        prefTheme = newTheme;
    });

    function applyTheme(theme) {
        
        if (theme === "dark") {
            main.classList.add("darkmain");
            grad.classList.add("darkgrad");
        } else {
            main.classList.remove("darkmain");
            grad.classList.remove("darkgrad");
        }
        toToggle.forEach((el) => {
            if (theme === "dark") {
                el.classList.add("dark");
            } else {
                el.classList.remove("dark");
            }
        });
    }
});

/* jQuery tab widget */
$(function () {
    $("#tabdiv").tabs();
});