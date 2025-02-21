// Function to update the tabButtons and webviewContainers NodeLists
function updateTabLists() {
  tabButtons = document.querySelectorAll('.tab-button');
  webviewContainers = document.querySelectorAll('.webview-container');

  const tabReloadCounts = {}; // Object to store reload counts for each tab

  // Reattach event listeners to all tab buttons
  tabButtons.forEach((button) => {

    let reloading = false; // Add a flag to track reloading state

    // Remove existing click listener to prevent duplicates
    button.removeEventListener('click', button.clickHandler); // Remove if already attached

    button.clickHandler = () => { // Store the function for removal

      if (reloading) {
        console.log("Reload already in progress, ignoring click.");
        return; // Exit if already reloading
      }

      const tabId = button.dataset.tab;

      // Initialize count if not already present
      if (!tabReloadCounts[tabId]) {
        tabReloadCounts[tabId] = 0;
      }

      // Deactivate all tabs and webviews
      tabButtons.forEach((btn) => btn.classList.remove('active'));
      webviewContainers.forEach((container) => container.classList.remove('active'));

      // Activate the selected tab and webview
      button.classList.add('active');
      const activeContainer = document.getElementById(tabId);
      activeContainer.classList.add('active');

      // Check if it's the Profile tab before reloading
      if (tabId !== 'profile') { // Or if (button.dataset.tab !== 'profile')

        if (tabReloadCounts[tabId] < 2) { // Check reload limit

          // Reload the webview of the activated tab
          const activeWebview = activeContainer.querySelector('webview');
          if (activeWebview) {
            const tryReload = () => {
              if (typeof activeWebview.reload === 'function') {
                console.log(`Reloading tab: ${tabId}`);
                reloading = true; // Set the flag before reloading
                activeWebview.reload();
                tabReloadCounts[tabId]++; // Increment reload count

                activeWebview.addEventListener('did-finish-load', () => {
                  reloading = false; // Reset the flag after reload finishes
                }, { once: true });

                activeWebview.addEventListener('error', () => {
                  reloading = false; // Reset the flag if there's an error
                }, { once: true });
              } else {
                console.log(`Webview reload not ready: ${tabId}`);
                activeWebview.addEventListener('dom-ready', () => {
                  console.log(`Reloading tab (dom-ready): ${tabId}`);
                  reloading = true; // Set the flag before reloading
                  activeWebview.reload();
                  tabReloadCounts[tabId]++; // Increment reload count

                  activeWebview.addEventListener('did-finish-load', () => {
                    reloading = false; // Reset the flag after reload finishes
                  }, { once: true });

                  activeWebview.addEventListener('error', () => {
                    reloading = false; // Reset the flag if there's an error
                  }, { once: true });
                }, { once: true });
              }
            };
            setTimeout(tryReload, 50);
          }
        } else {
          console.log(`Reload limit reached for tab: ${tabId}`);
        }
      } else {
        console.log("Profile tab clicked - No reload triggered.");
      }
    };
    button.addEventListener('click', button.clickHandler); // Attach the click handler
  });
}

let tabButtons = document.querySelectorAll('.tab-button');
let webviewContainers = document.querySelectorAll('.webview-container');

// Initial setup of event listeners
updateTabLists();

// Function to reload all webviews after they are added to the DOM
function reloadAllWebviews() {
  const webviews = document.querySelectorAll('webview');
  webviews.forEach(webview => {
    const tabId = webview.dataset.tab;
    const tryReload = () => {
      if (typeof webview.reload === 'function') {
        console.log(`Initial Reloading tab: ${tabId}`);
        webview.reload();
      } else {
        console.log(`Initial Webview reload not ready: ${tabId}`);
        webview.addEventListener('dom-ready', () => {
          console.log(`Initial Reloading tab (dom-ready): ${tabId}`);
          webview.reload();
        }, { once: true });
      }
    };
    setTimeout(tryReload, 50);
  });
}


// Navigation for each tab
if (window.api && window.api.onNavigate) {
  window.api.onNavigate((event, direction) => {
    const activeWebview = document.querySelector('.webview-container.active webview'); // Get the active webview

    if (activeWebview) {
      console.log('Navigation command received:', direction);
      if (direction === 'back' && activeWebview.canGoBack()) {
        activeWebview.goBack();
      } else if (direction === 'forward' && activeWebview.canGoForward()) {
        activeWebview.goForward();
      }
    }
  });
} else {
  console.error('Electron API is not available.');
}


// Function to save tab state to localStorage
function saveTabState(tabId, url, name) {
  localStorage.setItem(`tab-${tabId}-url`, url);
  localStorage.setItem(`tab-${tabId}-name`, name);

  // Save tab order
  let tabOrder = JSON.parse(localStorage.getItem('tabOrder') || '[]');
  if (!tabOrder.includes(tabId)) {
    tabOrder.push(tabId);
    localStorage.setItem('tabOrder', JSON.stringify(tabOrder));
  }
}

// Function to restore tab state from localStorage
function restoreTabState() {
  const tabOrder = JSON.parse(localStorage.getItem('tabOrder') || '[]');
  tabOrder.forEach(tabId => {
    const url = localStorage.getItem(`tab-${tabId}-url`);
    const name = localStorage.getItem(`tab-${tabId}-name`) || 'New Tab';
    if (url) {
      createNewTab(url, tabId, name);
    }
  });
}

// Function to create a new tab
function createNewTab(url, tabId = `tab-${Date.now()}`, name = 'New Tab') {
  const tabButton = document.createElement('button');
  tabButton.classList.add('tab-button');
  tabButton.dataset.tab = tabId;
  tabButton.textContent = name;

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'x';
  deleteButton.classList.add('delete-button');

  const webviewContainer = document.createElement('div');
  webviewContainer.classList.add('webview-container');
  webviewContainer.id = tabId;

  const webview = document.createElement('webview');
  webview.src = url;
  webview.allowpopups = true;
  webview.dataset.tab = tabId;

  webviewContainer.appendChild(webview);

  tabButton.appendChild(deleteButton);
  document.querySelector('.tab-container').appendChild(tabButton);
  document.body.appendChild(webviewContainer);

  // Update NodeLists after creating a new tab
  updateTabLists();

  // Save tab state
  saveTabState(tabId, url, name);

  // Add event listener to the new tab button
  tabButton.addEventListener('click', () => {
    // Deactivate all tabs and webviews
    tabButtons.forEach((btn) => btn.classList.remove('active'));
    webviewContainers.forEach((container) => container.classList.remove('active'));

    // Activate the selected tab and webview
    tabButton.classList.add('active');
    document.getElementById(tabId).classList.add('active');
  });

  // Add event listener to the new tab button for renaming
  tabButton.addEventListener('dblclick', (event) => {
    event.stopPropagation(); // Prevent the click event from firing

    const dialog = document.getElementById('rename-dialog');
    const input = document.getElementById('rename-input');
    const confirmButton = document.getElementById('rename-confirm');
    const cancelButton = document.getElementById('rename-cancel');

    // Extract tab name without delete button text
    const tabName = tabButton.textContent.replace('x', '').trim();
    input.value = tabName; // Set initial input value

    // Calculate dialog position
    const rect = tabButton.getBoundingClientRect();
    dialog.style.left = `${rect.left}px`;
    dialog.style.top = `${rect.bottom}px`;

    dialog.style.display = 'block';

    // Focus and select the input text
    input.focus();
    input.select();

    confirmButton.onclick = () => {
      const newName = input.value.trim();
      if (newName) {
        tabButton.textContent = newName;
        tabButton.appendChild(deleteButton);
        saveTabState(tabId, url, newName); // Update localstorage
      }
      dialog.style.display = 'none';
    };

    cancelButton.onclick = () => {
      dialog.style.display = 'none';
    };

    // Confirm on Enter key press
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        confirmButton.click();
      }
    });

    // Cancel on Esc key press
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        cancelButton.click();
      }
    });
  });

  // Add event listener to the delete button
  deleteButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent tab click event
    tabButton.remove();
    webviewContainer.remove();
    updateTabLists();

    // Remove tab state from localStorage
    localStorage.removeItem(`tab-${tabId}-url`);
    localStorage.removeItem(`tab-${tabId}-name`);

    // If the deleted tab was active, switch to the first remaining tab
    if (document.querySelector('.tab-button.active') === null && tabButtons.length > 0) {
      tabButtons[0].click();
    }
  });

  // Switch to the new tab
  tabButton.click();
}

// Call restoreTabState when the renderer process loads
restoreTabState();

// Reload all webviews after restoring tab state
setTimeout(reloadAllWebviews, 100); // Delay to ensure webviews are added to DOM


// Listen for the "reload-active-tab" message from the main process
if (window.api) {
  window.api.handle('reload-active-tab', () => {
    return () => {
      const activeWebview = document.querySelector('.webview-container.active webview');
      if (activeWebview) {
        activeWebview.reload();
      }
    };
  });
}

// Listen for the "create-new-tab" message from the main process
if (window.api) {
  window.api.handle('create-new-tab', (event, data) => {
    return (event, url) => {
      createNewTab(url);
    }
  });
}

// Listen for the "show-shortcuts-dialog" message from the main process
if (window.api) {
  window.api.handle('show-shortcuts-dialog', () => {
      return () => {
          const dialog = document.getElementById('shortcuts-dialog');
          dialog.style.display = 'block';

          const closeButton = document.getElementById('close-shortcuts');
          closeButton.addEventListener('click', () => {
              dialog.style.display = 'none';
          });
      };
  });
}