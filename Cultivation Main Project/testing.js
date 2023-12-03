var page = document.getElementById("content-page");
var lastClickedOption = "dashboard"; 


fetch('https://blr1.blynk.cloud/external/api/isHardwareConnected?token=6i5iWoPdapPxfDbVorxH4vo-dZC3aoKn')
  .then(response => response.json())
  .then(data => {
    const status = document.getElementsByClassName('bottom-right')[0];

    if (data == true) {
      status.innerHTML = "Device Status : Online";
      status.classList.add('bottom-right_true');
    } else {
      status.innerHTML = "Device Status : Offline";
      status.classList.add('bottom-right_false');
    }
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });


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
        setGaugeValue(gaugeElement, data.main.humidity);
      } else {
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
function loadMotor(){
    fetch('motor.html')
    .then((response)=>response.text())
    .then((data)=>{
        page.innerHTML=data;
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
    lastClickedOption="motor";
    loadMotor();
}

// Reload data every 3 seconds, except for the dashboard
setInterval(() => {
  if (lastClickedOption !== "Dashboard" || lastClickedOption!=="motor") {
    reloadData();
  }
}, 3000);




