
document.addEventListener("DOMContentLoaded", function() {
    const carList = document.getElementById("carList");
    const addCarButton = document.getElementById("addCarButton");
    const addCarModal = document.getElementById("addCarModal");
    const addCarForm = document.getElementById("addCarForm");
    const modalCloseButtons = document.querySelectorAll(".close");
    const loginButton = document.getElementById("logoutButton");
    const loginModal = document.getElementById("loginModal");
    const loginForm = document.getElementById("loginForm");

    // Function to display cars on the page
    function displayCars(cars) {
        carList.innerHTML = "";
        cars.forEach((car, index) => {
            const carDiv = document.createElement("div");
            carDiv.classList.add("car");
            carDiv.innerHTML = `
                <img src="${car.image}" alt="${car.make} ${car.model}">
                <h2>${car.make} ${car.model}</h2>
                <p>Year: ${car.year}</p>
                <p>Current bid: $${car.price}</p>
                <button class="details-btn" data-vin="${car.vin}">View Details</button>
            `;
            carList.appendChild(carDiv);
        });
    }

    // Function to open the modal
    function openModal(modal) {
        modal.style.display = "block";
    }

    // Function to close the modal
    function closeModal(modal) {
        modal.style.display = "none";
    }

    // Event listener for clicking "Add New Car" button
    addCarButton.addEventListener("click", function() {
        openModal(addCarModal);
    });

    // Event listener for clicking "Log in" button
    loginButton.addEventListener("click", function() {
        openModal(loginModal);
    });

    // Event listener for closing modals
    modalCloseButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            closeModal(addCarModal);
            closeModal(loginModal);
        });
    });

    // Event listener for form submission to add new car
    addCarForm.addEventListener("submit", function(event) {
        event.preventDefault();
        // Add functionality to handle form submission
    });

    // Event listener for clicking "View Details" button
    carList.addEventListener("click", function(event) {
        if (event.target.classList.contains("details-btn")) {
            const vin = event.target.dataset.vin;
            window.open(`details.html?vin=${vin}`, "_blank");
        }
    });

    // cancelled the bid button on the main page (now bid button is only on the details page)

    // carList.addEventListener("click", function(event) {
    //     if (event.target.classList.contains("bid-btn")) {
    //         const vin = event.target.dataset.index;
    //         window.open(`details.html?index=${vin}`, "_blank");
    //     }
    // });

     
    // Function to fetch cars from the database

    async function fetchCarsFromDB() {
        try {
            const response = await fetch('http://127.0.0.1:8080/cars/all')
            .then(response => response.json())
            displayCars(response.body.data)
            
        } catch (error) {

        }
    }

    // Event listener for form submission to add new car
    addCarForm.addEventListener("submit", function(event) {
    event.preventDefault();

    // Get the form data
    const formData = new FormData(addCarForm);

    // Convert the form data to a JSON object
    const jsonData = Object.fromEntries(formData.entries());

    // Send the JSON data to the server using fetch
    fetch('http://127.0.0.1:8080/cars/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => {
        if (response.ok) {
            // If the request was successful, close the modal and reset the form
            addCarModal.style.display = 'none';
            addCarForm.reset();
        } else {
            // If the request failed, display an error message
            console.error('Error:', response.statusText);
            alert('A server error occurred while adding the listing. Please try again later.');
        }
    })
    .catch(error => {
        // If there was a network error, display an error message
        console.error('Error:', error);
        alert('A network occurred while adding the listing. Please try again later.');
    });

    // ------------------------------------------------------------------------------------------------------------------------------------------------


});

    // Initial loading of cars from the database
    fetchCarsFromDB();
});