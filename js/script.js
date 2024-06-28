// Global variable to store song links
let songLinks = [];

// Function to format seconds to minutes
function formatSecondsToMinutes(inputSeconds) {
  if (
    typeof inputSeconds !== "number" ||
    isNaN(inputSeconds) ||
    inputSeconds < 0
  ) {
    return "0.00";
  }

  const minutes = Math.floor(inputSeconds / 60);
  const remainingSeconds = Math.round(inputSeconds % 60); // Round seconds to nearest whole number
  const formattedMinutes = minutes.toString().padStart(2, "0"); // Ensure 2 digits with zero padding
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0"); // Ensure 2 digits with zero padding
  const formattedTime = `${formattedMinutes}:${formattedSeconds}`;

  return formattedTime;
}

let currentSong = new Audio();
let currentSongIndex = 0; // To keep track of the current song index

const playmusic = (track, pause = false) => {
  currentSong.src = "/songs/" + track;
  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }
  // Extract song name from the full path
  let songName = track.substring(track.lastIndexOf("/") + 1);
  document.querySelector(".songinfo").innerHTML = decodeURIComponent(songName).replaceAll("%20", " ").replaceAll("%26", " ");
  document.querySelector(".songtime").innerHTML = " 00:00 / 00:00 ";
};

const loadSongs = async (folder, playFirstSong = true) => {
  console.log(`Loading songs from folder: ${folder}`);
  let response = await fetch(`http://127.0.0.1:5500/songs/${folder}`);
  let htmlContent = await response.text();

  let tempElement = document.createElement("div");
  tempElement.innerHTML = htmlContent;

  let files = tempElement.querySelectorAll("#files li a");
  songLinks = []; // Reset songLinks

  files.forEach((file) => {
    let link = file.getAttribute("href");
    if (link && link !== "/") {
      // Exclude the parent directory link and ensure link is valid
      let songLink = link.split("/songs/")[1];
      if (
        songLink &&
        !songLink.includes("info.json") &&
        !songLink.includes("cover.jpg")
      ) {
        // Exclude info.json and cover.jpg
        songLinks.push(songLink);
      }
    }
  });

  console.log("Song Links:", songLinks);

  if (songLinks.length > 0) {
    currentSongIndex = 0; // Reset current song index
    if (playFirstSong) {
      playmusic(songLinks[0]); // Play the first song automatically if playFirstSong is true
    }
  } else {
    console.error("No valid song links found");
  }

  // Show all the songs in the playlist
  let songsUL = document.querySelector(".songList ul");
  songsUL.innerHTML = "";

  for (const song of songLinks) {
    if (song) {
      let songName = song.substring(song.lastIndexOf("/") + 1);
      songsUL.innerHTML += `<li><img src="img/music.svg" class="invert" alt="music">
        <div class="info">
          <div>${decodeURIComponent(songName).replaceAll("%20", " ").replaceAll("%26", " ")}</div>
          <div>Abhishek</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="img/play.svg" alt="">
        </div>
      </li>`;
    }
  }

  // Attach event listeners to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e, index) => {
    e.addEventListener("click", () => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      currentSongIndex = index; // Update current song index
      playmusic(songLinks[currentSongIndex].trim());
    });
  });
};

async function displayAlbums() {
  console.log("Displaying albums");
  try {
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".card-Container");
    let array = Array.from(anchors);

    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
        let folderUrl = new URL(e.href);
        let folder = folderUrl.pathname
          .split("/")
          .filter((part) => part !== "")
          .pop();
        console.log(`Processing folder: ${folder}`);
        try {
          // Get the metadata of the folder
          let metadataResponse = await fetch(`/songs/${folder}/info.json`);
          if (metadataResponse.status === 404) {
            // console.error(`info.json not found for folder: ${folder}`);
            continue; // Skip to the next iteration if info.json not found
          }

          let metadata = await metadataResponse.json();
          cardContainer.innerHTML += `
            <div data-folder="${folder}" class="card">
            <div class="play circular-box">
            <i class="fa-solid fa-play invert"></i>
          </div>
              <img src="/songs/${folder}/cover.jpg" alt="Cover image for ${metadata.title}">
              <h2>${metadata.title}</h2>
              <p>${metadata.description}</p>
            </div>`;
        } catch (error) {
          console.error(
            `Failed to fetch info.json for folder ${folder}:`,
            error
          );
        }
      }
    }

    // Add event listeners to the newly created album cards or Load the playlist whenever card is clicked
    let folderCards = document.querySelectorAll(".card-Container .card");
    folderCards.forEach((card) => {
      card.addEventListener("click", () => {
        let folder = card.getAttribute("data-folder");
        console.log(`Folder clicked: ${folder}`);
        loadSongs(folder).then(() => {
          if (songLinks.length > 0) {
            playmusic(songLinks[0]); // Play the first song automatically
          }
        });
      });
    });
  } catch (error) {
    console.error("Failed to display albums:", error);
  }
}

async function main() {
  await displayAlbums(); // Display albums on page load
  await loadSongs('NCS', false); // Load NCS folder by default without playing the first song

  // Event listeners for play, previous, next, and volume
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });

  // Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    const formattedTime = formatSecondsToMinutes(currentSong.currentTime);
    document.querySelector(
      ".songtime"
    ).innerHTML = `${formattedTime} / ${formatSecondsToMinutes(
      currentSong.duration
    )}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Add an event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  // Add an event listener for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-130%";
  });

  // Add an event listener to previous
  previous.addEventListener("click", () => {
    currentSong.pause();
    console.log("prev clicked");
    currentSongIndex =
      (currentSongIndex - 1 + songLinks.length) % songLinks.length;
    playmusic(songLinks[currentSongIndex]);
  });

  // Add an event listener to next
  next.addEventListener("click", () => {
    currentSong.pause();
    console.log("next clicked");
    currentSongIndex = (currentSongIndex + 1) % songLinks.length;
    playmusic(songLinks[currentSongIndex]);
  });

  // Add an event to volume
  document.querySelector(".range input").addEventListener("change", (e) => {
    console.log("Setting volume to", e.target.value);
    currentSong.volume = parseInt(e.target.value) / 100;
    if (currentSong.volume > 0) {
      document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg");
    }
  });

  // Add event listener to mute the track
  document.querySelector(".volume>img").addEventListener("click", (e) => {
    console.log(e.target);
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      document.querySelector(".range input").value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      document.querySelector(".range input").value = 10;
    }
  });
}

main();
