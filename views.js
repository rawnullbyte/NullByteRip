document.addEventListener("DOMContentLoaded", function () {
    const views_element = document.getElementById("view-count");
    fetch('/api/views', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        views_element.textContent = data.total_requests;
    });
});