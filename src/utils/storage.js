// Storage Utility: LocalStorage, JSON File Export/Import & Google Drive Sync API Scaffold

const STORAGE_KEY = 'talebot_pro_challenges_v1';
const GOOGLE_CLIENT_ID_KEY = 'talebot_gdrive_client_id';

// Save challenges array to LocalStorage
export function saveChallengesToLocal(challenges) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(challenges));
    return true;
  } catch (err) {
    console.error('Error guardando en LocalStorage:', err);
    return false;
  }
}

// Load challenges array from LocalStorage
export function loadChallengesFromLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Error cargando de LocalStorage:', err);
    return null;
  }
}

// Export challenges array as downloadable .json file
export function exportChallengesToJSON(challenges, filename = 'coleccion_retos_talebot.json') {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(challenges, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Read imported JSON file
export function importChallengesFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        resolve(json);
      } catch {
        reject(new Error('Formato de archivo JSON inválido'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

// Google Drive Sync API Scaffold (Google Identity Services GIS)
export function getSavedGoogleClientId() {
  return localStorage.getItem(GOOGLE_CLIENT_ID_KEY) || '';
}

export function saveGoogleClientId(clientId) {
  localStorage.setItem(GOOGLE_CLIENT_ID_KEY, clientId);
}

// Upload collection JSON file directly to user's Google Drive app folder / root
export async function uploadToGoogleDrive(clientId, challengesData) {
  if (!clientId) {
    throw new Error('Se requiere un Client ID de Google Cloud API para sincronizar con Drive.');
  }
  
  // Dynamic GIS script injection if not loaded
  if (!window.gapi) {
    await new Promise((res) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = res;
      document.body.appendChild(script);
    });
  }

  return new Promise((resolve, reject) => {
    window.gapi.load('client:auth2', async () => {
      try {
        await window.gapi.client.init({
          clientId: clientId,
          scope: 'https://www.googleapis.com/auth/drive.file'
        });
        
        const GoogleAuth = window.gapi.auth2.getAuthInstance();
        if (!GoogleAuth.isSignedIn.get()) {
          await GoogleAuth.signIn();
        }

        const fileContent = JSON.stringify(challengesData, null, 2);
        const metadata = {
          name: 'TaleBot_Retos_Guardados.json',
          mimeType: 'application/json'
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', new Blob([fileContent], { type: 'application/json' }));

        const accessToken = GoogleAuth.currentUser.get().getAuthResponse().access_token;
        const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
          body: form
        });

        if (res.ok) {
          const fileInfo = await res.json();
          resolve(fileInfo);
        } else {
          reject(new Error('Error subiendo archivo a Google Drive'));
        }
      } catch (err) {
        reject(err);
      }
    });
  });
}
