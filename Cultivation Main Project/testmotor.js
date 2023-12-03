var page = document.getElementById("content-page");
var lastClickedOption = "dashboard";





function addGauge(page_content, url, isTemp, isHum) {
  page.innerHTML = page_content;
  const gaugeElement = document.querySelector(".gauge");

  function setGaugeValue(gauge, value) {
    if (value < 0 || value > 100) {
      return;
    }
    if (isTemp) {
      gauge.querySelector(".gauge__fill").style.transform = `rotate(${value / 100}turn)`;
      gauge.querySelector(".gauge__cover").textContent = `${Math.round(value * 1)}°C`;
    } else {
      gauge.querySelector(".gauge__fill").style.transform = `rotate(${value / 200}turn)`;
      gauge.querySelector(".gauge__cover").textContent = `${Math.round(value * 1)}%`;
    }
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (Number.isInteger(data)) {
        setGaugeValue(gaugeElement, data);
      } else if (isHum) {
        // console.log(data.main.humidity);
        setGaugeValue(gaugeElement, data.main.humidity);
      } else {
        // console.log(data.main.temp);
        setGaugeValue(gaugeElement, data.main.temp);
      }
    });
}

function reloadData() {
  if (lastClickedOption === "Temperature") {
    fetch('Temperature.html')
      .then((response) => response.text())
      .then((data) => {
        addGauge(data, "https://api.openweathermap.org/data/2.5/weather?q=Medinipur&appid=0d92fa45b05cc8440d8d942a25481b19&units=metric", true, false);
      });
  } else if (lastClickedOption === "Humidity") {
    fetch('Humidity.html')
      .then((response) => response.text())
      .then((data) => {
        addGauge(data, "https://api.openweathermap.org/data/2.5/weather?q=Medinipur&appid=0d92fa45b05cc8440d8d942a25481b19&units=metric", false, true);
      });
  } else if (lastClickedOption === "Soil") {
    fetch('Soil.html')
      .then((response) => response.text())
      .then((data) => {
        page.innerHTML = data;
        addGauge(data, "https://blr1.blynk.cloud/external/api/get?token=6i5iWoPdapPxfDbVorxH4vo-dZC3aoKn&v2", false, false);
      });
  }
}

function loadDashboard() {
  fetch('dashboard.html')
    .then((response) => response.text())
    .then((data) => {
      page.innerHTML = data;
    });
}
function loadMotor() {
  fetch('motor.html')
    .then((response) => response.text())
    .then((data) => {
      page.innerHTML = data;
    });
}

document.getElementById("Humidity").onclick = () => {
  lastClickedOption = "Humidity";
  reloadData();
};

document.getElementById("Temperature").onclick = () => {
  lastClickedOption = "Temperature";
  reloadData();
};

document.getElementById("Soil").onclick = () => {
  lastClickedOption = "Soil";
  reloadData();
};

document.getElementById("dashboard").onclick = () => {
  lastClickedOption = "Dashboard";
  loadDashboard();
};
document.getElementById("motor").onclick = () => {
  lastClickedOption = "motor";
  loadMotor();
}

// Reload data every 3 seconds, except for the dashboard and motor
setInterval(() => {
  if (lastClickedOption !== "Dashboard" || lastClickedOption !== "motor") {
    reloadData();
  }
}, 3000);


function getStatus() {
  fetch('https://blr1.blynk.cloud/external/api/isHardwareConnected?token=6i5iWoPdapPxfDbVorxH4vo-dZC3aoKn')
    .then(response => response.json())
    .then(data => {
      const status = document.getElementsByClassName('bottom-right')[0];

      if (data == true) {
        status.innerHTML = "Device Status: Online";
        status.classList.add('bottom-right_true');
        status.classList.remove('bottom-right_false');
      } else {
        status.innerHTML = "Device Status: Offline";
        status.classList.add('bottom-right_false');
        status.classList.remove('bottom-right_true');
      }
    })
    .catch(error => {
      console.error('An error occurred:', error);
    });
}

// Initial status check
getStatus();

// Refresh status every 2 seconds
setInterval(getStatus, 1000);




let isOn = false;

function autoModeOn() {
  isOn = !isOn;
  if (isOn) {

    const updateApiUrl = 'https://blr1.blynk.cloud/external/api/update';
    const apiToken = '6i5iWoPdapPxfDbVorxH4vo-dZC3aoKn';
    const params = new URLSearchParams({
      token: apiToken,
      v4: '1'
    });
    const updateUrl = `${updateApiUrl}?${params}`;

    fetch(updateUrl)
      .then(response => {
        if (response.ok) {
          console.log('Motor turned ON.');
        } else {
          console.log('Failed to turn the motor ON:', response.statusText);
        }
      })
      .catch(error => {
        console.log('Error:', error.message);
      });
  } else {
    const updateApiUrl = 'https://blr1.blynk.cloud/external/api/update';
    const apiToken = '6i5iWoPdapPxfDbVorxH4vo-dZC3aoKn';
    const params = new URLSearchParams({
      token: apiToken,
      v4: '0'
    });
    const updateUrl = `${updateApiUrl}?${params}`;

    fetch(updateUrl)
      .then(response => {
        if (response.ok) {
          console.log('Motor turned OFF.');
        } else {
          console.log('Failed to turn the motor ON:', response.statusText);
        }
      })
      .catch(error => {
        console.log('Error:', error.message);
      });
  }
}

let isModeOn = false;
function manualModeOn() {
  isModeOn = !isModeOn;
  if (isModeOn) {
    const updateApiUrl = 'https://blr1.blynk.cloud/external/api/update';
    const apiToken = '6i5iWoPdapPxfDbVorxH4vo-dZC3aoKn';
    const params = new URLSearchParams({
      token: apiToken,
      v3: '1'
    });
    const updateUrl = `${updateApiUrl}?${params}`;

    fetch(updateUrl)
      .then(response => {
        if (response.ok) {
          console.log('Motor turned ON.');
        } else {
          console.log('Failed to turn the motor ON:', response.statusText);
        }
      })
      .catch(error => {
        console.log('Error:', error.message);
      });
  }
  else {
    const updateApiUrl = 'https://blr1.blynk.cloud/external/api/update';
    const apiToken = '6i5iWoPdapPxfDbVorxH4vo-dZC3aoKn';
    const params = new URLSearchParams({
      token: apiToken,
      v3: '0'
    });
    const updateUrl = `${updateApiUrl}?${params}`;

    fetch(updateUrl)
      .then(response => {
        if (response.ok) {
          console.log('Motor turned OFF.');
        } else {
          console.log('Failed to turn the motor ON:', response.statusText);
        }
      })
      .catch(error => {
        console.log('Error:', error.message);
      });
  }
}




