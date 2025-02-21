<div align="left">
    <img src="images/KotlinPlaygroundd.png" alt="App Logo" height="100">
</div> 

# Kotlin Playground - Desktop App

#### This is a desktop app built with **Electron**, which can be used to practice coding in **Kotlin** Language. The app is best suited for Android developers.

#### The app uses Kotlin Compiler Playground from SoloLearn (www.sololearn.com/en/compiler-playground/kotlin). 

#### It gives a convenient way to test and run Kotlin codes without needing to open a web browser or use any heavy IDE for practising code.

<p><b><h3> • Download Exe file ⬇️</h3></b></p>
https://github.com/ayushpadlekar/kotlin-playground/releases/tag/v1.0.0

</br> </br>

## Screenshots 📸

* ### Main Screen (Empty Compiler Tab selected by default)

![Main Screen (Compiler Tab)](<images/Main Screen.jpeg>)

* ### Profile Tab (To open saved kotlin programs)

![Profile Tab](<images/Profile Tab.jpeg>)

* ### Other features like Add, Rename or Delete tabs

![All other features](<images/All other features.jpeg>)

</br>

## Features 💡

*   **Tabbed Interface:**  Organize your Kotlin coding sessions with multiple tabs, each running a separate instance of the Kotlin Playground.
*   **Easy Navigation:** Use the built-in navigation buttons (Back/Forward) or keyboard shortcuts (Alt+Left or Alt+Right) to navigate within each tab.
*   **Reload Functionality:** Refresh the content of any tab with a Reload button from the menu or with keyboard shortcut.
*   **Tab Renaming:** Double click on tab name to rename it.
*   **Tab Deletion:** Close tabs as needed.
*   **Zoom Control:** Zoom in and out using standard keyboard shortcuts (Ctrl ++ or Ctrl +- or Ctrl+0)

</br>

## How to Use ❓

1.  Launch the application.
2.  The application will open with two default tabs: "Compiler" and "Profile".
3.  The 'Compiler' tab has default kotlin editor opened and the 'Profile' tab contains our saved kotlin program codes.
4.  Use the Kotlin Playground within each tab as you normally would on the SoloLearn website.
7.  Double-click on a tab name to rename it.
8.  Click the "x" button on a tab to close it.
9.  Use Ctrl+ +/-/0 to zoom in, out, and reset the zoom level.

</br>

## Technologies Used 🛠️

*   **Electron:** Framework for building cross-platform desktop applications with web technologies.
*   **HTML, CSS, JavaScript:** Used for the user interface and application logic.
*   **SoloLearn Kotlin Playground:** The web-based Kotlin execution environment integrated into the app.

</br>

## Project - Main Files 📚📌

Key files and their roles in the application :

*   **`main.js`** *(Main Process) :* This is the entry point of the Electron app. It's responsible for -
    *   Creating and managing the application window.
    *   Handling the application lifecycle (launching, quitting, etc.).
    *   Managing webviews and their events.
    *   Setting up the menu bar.
    *   Registering global shortcuts.
    *   Communicating with the renderer process via IPC.

*   **`index.html`** *(UI) :* This file defines the design of the application. It includes -
    *   Webview of sololearn's website.
    *   The structure of the tab container.
    *   The definitions of the tab buttons and webview containers.
    *   The inclusion of the renderer.js script.
    *   Dialog definition for renaming tabs.

*   **`renderer.js`** *(Renderer Process Logic) :* This script runs in the renderer process (the browser window) and handles the application logic.  It's responsible for -
    *   Managing tab switching and webview visibility.
    *   Reloading webviews.
    *   Saving and restoring tab state using localStorage.
    *   Creating new tabs dynamically.
    *   Handling tab renaming and deletion.
    *   Handling navigation commands (back/forward).
    *   Communicating with the main process via IPC.
    *   Adding event listeners to the tabs and webviews.

*   **`preload.js`** *(Preload Script) :*
    * This script runs before the renderer and acts as a bridge between the renderer and the main process. It controls which APIs the renderer process can access. It exposes a limited set of APIs to the renderer process using ***contextBridge***, enabling secure communication with the main process. It defines the ***window.api*** object used by the renderer.js file.

</br>

## Installation ↙️

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/ayushpadlekar/kotlin-playground.git
    ```

2.  **Navigate to the Project Directory:**

    ```bash
    cd kotlin-playground
    ```

3.  **Install Dependencies:**

    ```bash
    npm install
    ```

4.  **Run the Application:**

    ```bash
    npm start
    ```


## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues.
