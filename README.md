# Music Player Web App
This is a Music Player Web App that allows users to browse and play songs from different albums. The app is built using HTML, CSS, and JavaScript without any backend. and it provides features such as album display, playlist creation, and song controls including play, pause, next, previous, and volume adjustment.

![screenshot](<Screenshot (144).png>)
# Features
Album Display: Browse and display albums with their respective metadata and cover images.
Playlist Management: Load songs from selected albums into a playlist.
Song Controls: Play, pause, skip to the next or previous song, and adjust volume.
Seek Bar: Seek through the song using a progress bar.
Responsive Design: Adaptable to different screen sizes with a hamburger menu for navigation.
Installation
To run this project locally, follow these steps:

# Usage
Browse Albums: On page load, albums from the /songs directory will be displayed with their cover images and descriptions.
Load Songs: Click on an album to load its songs into the playlist.
Play a Song: Click on any song in the playlist to start playing it.
# Control Playback:
Play/Pause: Click the play button to play or pause the current song.
Next/Previous: Use the next and previous buttons to navigate through the playlist.
Seek: Click on the seek bar to jump to a different part of the song.
Volume: Adjust the volume using the volume slider or mute/unmute by clicking the volume icon.
# Project Structure
index.html: Main HTML file containing the structure of the app.
style.css: CSS file for styling the app.
script.js: JavaScript file for handling the app's functionality.
# songs:
 Directory containing albums, each with an info.json file for metadata and cover.jpg for the album cover. The songs are stored as audio files in each album's folder.
Metadata Format
Each album should contain an info.json file with the following structure:

# json
{
  "title": "Album Title",
  "description": "Album description."
}