// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZIm5-FIF60sUPsCFY4AWw3oiMOxnW3W8",
  authDomain: "study-tracker-46744.firebaseapp.com",
  databaseURL: "https://study-tracker-46744-default-rtdb.firebaseio.com",
  projectId: "study-tracker-46744",
  storageBucket: "study-tracker-46744.firebasestorage.app",
  messagingSenderId: "190293942527",
  appId: "1:190293942527:web:57a6b4cb28b8d1adae2cca"
};

// Initialize Firebase (Modular Version)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Utility Functions
function formatTime(seconds) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

// Timer Functionality
class Timer {
  constructor(user) {
    this.user = user;
    this.startTime = null;
    this.intervalId = null;
    this.totalTime = 0;

    // Get DOM Elements
    this.startBtn = document.getElementById(`${user}-start-btn`);
    this.stopBtn = document.getElementById(`${user}-stop-btn`);
    this.timerDisplay = document.getElementById(`${user}-timer-display`);
    this.entriesList = document.getElementById(`${user}-entries`);
    this.totalTimeDisplay = document.getElementById(`${user}-total-time`);

    // Initialize listeners
    this.initListeners();
    this.syncEntries();
  }

  startTimer() {
    if (this.intervalId) return;

    console.log(`Starting timer for ${this.user}`); // Debug log
    this.startTime = Date.now();
    this.intervalId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this.timerDisplay.textContent = formatTime(elapsed);
    }, 1000);
  }

  stopTimer() {
    if (!this.intervalId) return;

    console.log(`Stopping timer for ${this.user}`); // Debug log
    clearInterval(this.intervalId);
    this.intervalId = null;

    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);

    this.totalTime += minutes;
    this.timerDisplay.textContent = '00:00:00';
    this.saveEntry(minutes);
  }

  saveEntry(minutes) {
    const userRef = ref(db, `timers/${this.user}`);
    const newEntryRef = push(userRef);
    newEntryRef.set({ minutes, timestamp: Date.now() });
  }

  syncEntries() {
    const userRef = ref(db, `timers/${this.user}`);
    onChildAdded(userRef, (snapshot) => {
      const { minutes } = snapshot.val();
      const entry = document.createElement('li');
      entry.textContent = `${minutes} minutes`;
      this.entriesList.appendChild(entry);

      // Update total time displayed
      this.totalTime += minutes;
      this.totalTimeDisplay.textContent = this.totalTime;
    });
  }

  initListeners() {
    // Ensure buttons are working
    this.startBtn.addEventListener('click', () => {
      console.log(`${this.user}: Start button clicked`); // Debug log
      this.startTimer();
    });
    this.stopBtn.addEventListener('click', () => {
      console.log(`${this.user}: Stop button clicked`); // Debug log
      this.stopTimer();
    });
  }
}

// Initialize Timers for Hima and Tarush
new Timer('hima');
new Timer('tarush');
