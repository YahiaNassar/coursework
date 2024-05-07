document.addEventListener("DOMContentLoaded", function() {
    // Function to show the bid modal
    function showBidModal() {
        const bidModal = document.getElementById('bidModal');
        bidModal.style.display = 'block';
    }

    // Function to close the bid modal
    function closeBidModal() {
        const bidModal = document.getElementById('bidModal');
        bidModal.style.display = 'none';
    }

    // Function to submit the bid
    function submitBid() {
        // Get the bid amount from the form
        const bidAmountInput = document.getElementById('bidAmount');
        const bidAmount = parseFloat(bidAmountInput.value);

        // Check if the bid amount is valid
        if (isNaN(bidAmount) || bidAmount <= 0) {
            alert('Please enter a valid bid amount.');
            return;
        }

        // Get the index of the car from the query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const index = urlParams.get('vin');

        // Fetch the current price of the car from the server
        fetch(`http://127.0.0.1:8080/cars/${index}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(car => {
                // Get the current price of the car
                const currentPrice = car.body.data.price;

                // Check if the bid amount is greater than the current price
                if (bidAmount <= currentPrice) {
                    alert('Your bid must be higher than the current price.');
                    return;
                }

                // Create bid data object
                const bidData = {
                    amount: bidAmount,
                    carVin: index,
                    bidderUserName: 'Marks' // Assuming a static username for the bidder
                };

                // Send bid data to the server
                return fetch('http://127.0.0.1:8080/bids/new', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bidData),
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to submit bid.');
                }
                return response.json();
            })
            .then(data => {
                // Display success message or handle response accordingly
                alert('Bid submitted successfully: $' + bidAmount);
                closeBidModal();
            })
            .catch(error => {
                console.error('Error submitting bid:', error);
                alert('Failed to submit bid. Please try again later.');
            });
    }

    // Event listener for the bid button to open the bid modal
    document.getElementById('make-bid').addEventListener('click', showBidModal);

    // Event listener for the close button in the bid modal
    document.getElementsByClassName('close')[0].addEventListener('click', closeBidModal);

    // Event listener for the bid form submission
    document.getElementById('bidForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting normally
        submitBid(); // Call the function to submit the bid
    });

    // Fetch the car data from the server
    const urlParams = new URLSearchParams(window.location.search);
    const index = urlParams.get('vin');

    fetch(`http://127.0.0.1:8080/cars/${index}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(car => {
            // Display the car details on the page
            const carData = car.body.data;
            document.getElementById('car-image').src = carData.image;
            document.getElementById('make').innerText = carData.make;
            document.getElementById('model').innerText = carData.model;
            document.getElementById('year').innerText = `Year: ${carData.year}`;
            document.getElementById('price').innerText = `Current bid: $${carData.price}`;

            // Populate bid table if bid history exists
            const bidTableBody = document.getElementById('bid-table-body');
            if (carData.bidHistory && Array.isArray(carData.bidHistory)) {
                carData.bidHistory.forEach(bid => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${bid.bidder.name}</td>
                        <td>$${bid.amount}</td>
                        <td>${new Date(bid.date).toLocaleString()}</td>
                    `;
                    bidTableBody.appendChild(row);
                });
            } else {
                // If bid history is missing or not an array, display a message
                const row = document.createElement('tr');
                row.innerHTML = '<td colspan="3">No bid history available</td>';
                bidTableBody.appendChild(row);
            }
        })
        .catch(error => {
            console.error('Error fetching car details:', error);
        });
});