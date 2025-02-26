document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById('audio');
    const playButton = document.getElementById('playButton');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const progressContainer = document.getElementById('progressContainer');
    const progress = document.getElementById('progress');
    const currentTimeDisplay = document.getElementById('currentTime');
    const durationDisplay = document.getElementById('duration');
    const songTitle = document.getElementById('songTitle');

    // List of songs
    const songs = [
        { title: "Forever Chemicals", file: "song1.mp3" },
        { title: "fusoku", file: "song2.mp3" },
        { title: "призрак", file: "song3.mp3" }
    ];

    let songIndex = 0; // Current song index

    // Load a song
    function loadSong(index) {
        audio.src = songs[index].file;
        songTitle.textContent = songs[index].title;
        audio.load();
    }

    // Toggle play/pause
    function togglePlay() {
        if (audio.paused) {
            audio.play();
            playButton.textContent = '⏸';  // Pause symbol
        } else {
            audio.pause();
            playButton.textContent = '\u25B6';  // Play symbol (▶) without blue background
        }
    }

    // Next song
    function nextSong() {
        songIndex = (songIndex + 1) % songs.length;
        loadSong(songIndex);
        audio.play();
        playButton.textContent = '⏸';
    }

    // Previous song
    function prevSong() {
        songIndex = (songIndex - 1 + songs.length) % songs.length;
        loadSong(songIndex);
        audio.play();
        playButton.textContent = '⏸';
    }

    // Update progress bar
    audio.addEventListener('timeupdate', () => {
        if (!audio.duration) return; // Prevent errors before metadata loads
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = percent + '%';
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
    });

    // Seek functionality
    progressContainer.addEventListener("click", (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const percent = (event.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    });

    // Display song duration when metadata is loaded
    audio.addEventListener('loadedmetadata', () => {
        durationDisplay.textContent = formatTime(audio.duration);
    });

    // Auto-play next song when current song ends
    audio.addEventListener("ended", nextSong);

    // Format time helper function
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds === Infinity) return "0:00"; // Handle edge cases
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    // Load the first song
    loadSong(songIndex);

    // Event listeners
    playButton.addEventListener('click', togglePlay);
    nextButton.addEventListener('click', nextSong);
    prevButton.addEventListener('click', prevSong);
});
