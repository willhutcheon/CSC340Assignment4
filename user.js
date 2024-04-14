document.getElementById('addMovieForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(this);
    try {
        const response = await fetch('http://127.0.0.1:8000/movie/add', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error('Failed to add movie');
        }
        const result = await response.text();
        alert(result); // Show success message
        this.reset(); // Reset the form
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add movie');
    }
});

document.getElementById('deleteMovieForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(this);
    try {
        const response = await fetch('http://127.0.0.1:8000/movie/delete', {
            method: 'DELETE',
            body: formData
        });
        if (!response.ok) {
            throw new Error('Failed to delete movie');
        }
        const result = await response.text();
        alert(result); // Show success message
        this.reset(); // Reset the form
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete movie');
    }
});

document.getElementById('updateMovieForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    try {
        const response = await fetch('http://127.0.0.1:8000/movie/update', {
            method: 'PUT',
            body: formData
        });
        if (!response.ok) {
            throw new Error('Failed to update movie');
        }
        const result = await response.text();
        alert(result); // Show success message
        this.reset(); // Reset the form
    } catch(error) {
        console.error('Error:', error);
        alert('Failed to update movie');
    }
});

// Function to fetch movie data from the server
async function fetchMovies() {
    try {
        const response = await fetch('http://127.0.0.1:8000/movies');
        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }
        const movies = await response.json();
        displayMovies(movies);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch movies');
    }
}

// Function to display movie data on the webpage
function displayMovies(movies) {
    const movieList = document.getElementById('movieList');
    movieList.innerHTML = ''; // Clear previous content
    for (const [title, details] of Object.entries(movies)) {
        const movieItem = document.createElement('div');
        movieItem.innerHTML = `
            <h3>${title}</h3>
            <p>Release Year: ${details['release-year']}</p>
            <p>Featured Song: ${details['featured-song']}</p>
            <p>Rotten Tomatoes Rating: ${details['rotten-tomatoes']}</p>
            <hr>
        `;
        movieList.appendChild(movieItem);
    }
}

// Call fetchMovies when the page loads
document.addEventListener('DOMContentLoaded', fetchMovies);