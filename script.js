// ==========================================
// SIDEBAR
// ==========================================

const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");
const content = document.querySelector(".content");

menuButton.addEventListener("click", () => {

    if (window.innerWidth <= 768) {

        // Mobile
        sidebar.classList.toggle("show");

    } else {

        // Desktop
        sidebar.classList.toggle("hide");
        content.classList.toggle("full");

    }

});

// ==========================================
// PAGE NAVIGATION
// ==========================================

const menuDashboard = document.getElementById("menuDashboard");
const menuIPAL = document.getElementById("menuIPAL");

const dashboardPage = document.getElementById("dashboardPage");
const ipalPage = document.getElementById("ipalPage");

// Dashboard
menuDashboard.addEventListener("click", function(e){

    e.preventDefault();

    dashboardPage.classList.add("active");
    ipalPage.classList.remove("active");

    menuDashboard.classList.add("active");
    menuIPAL.classList.remove("active");

    // Tutup sidebar saat di HP
    if(window.innerWidth <= 768){
        sidebar.classList.remove("show");
    }

});

// IPAL
menuIPAL.addEventListener("click", function(e){

    e.preventDefault();

    dashboardPage.classList.remove("active");
    ipalPage.classList.add("active");

    menuDashboard.classList.remove("active");
    menuIPAL.classList.add("active");

    // Tutup sidebar saat di HP
    if(window.innerWidth <= 768){
        sidebar.classList.remove("show");
    }

});

// ==========================================
// MQTT CONFIG
// ==========================================

const broker = "ws://192.168.80.99:9001";

const options = {
    connectTimeout: 5000,
    reconnectPeriod: 3000
};


// ==========================================
// HTML ELEMENT
// ==========================================

const pressure = document.getElementById("pressure");
const flowIn = document.getElementById("flowIn");
const flowOut = document.getElementById("flowOut");
const phIn = document.getElementById("phIn");
const phOut = document.getElementById("phOut");
const wind = document.getElementById("wind");

const mqttStatus = document.getElementById("mqttStatus");
const lastUpdate = document.getElementById("lastUpdate");


// ==========================================
// SENSOR VALUE
// ==========================================

let currentPressure = 0;
let currentFlowIn = 0;
let currentFlowOut = 0;
let currentPHIn = 0;
let currentPHOut = 0;
let currentWind = 0;


// ==========================================
// UPDATE CARD
// ==========================================

function updatePressure(value) {
    pressure.textContent = Number(value).toFixed(2);
}

function updateFlowIn(value) {
    flowIn.textContent = Number(value).toFixed(3);
}

function updateFlowOut(value) {
    flowOut.textContent = Number(value).toFixed(3);
}

function updatePHIn(value) {
    phIn.textContent = Number(value).toFixed(2);
}

function updatePHOut(value) {
    phOut.textContent = Number(value).toFixed(2);
}

function updateWind(value) {
    wind.textContent = Number(value).toFixed(2);
}


// ==========================================
// LAST UPDATE
// ==========================================

function updateTime() {

    const now = new Date();

    lastUpdate.textContent =
        "Last Update : " +
        now.toLocaleTimeString("id-ID");

}


// ==========================================
// MQTT CONNECT
// ==========================================

const client = mqtt.connect(broker, options);


client.on("connect", () => {

    console.log("MQTT Connected");

    mqttStatus.textContent = "🟢 Connected";
    mqttStatus.classList.remove("offline");
    mqttStatus.classList.add("online");

    client.subscribe("sensor/tekanan");
    client.subscribe("flow/inlet");
    client.subscribe("flow/outlet");
    client.subscribe("phmeter/inlet");
    client.subscribe("phmeter/outlet");
    client.subscribe("wind/speed");

});


client.on("reconnect", () => {

    mqttStatus.textContent = "🟡 Reconnecting";

});


client.on("close", () => {

    mqttStatus.textContent = "🔴 Offline";
    mqttStatus.classList.remove("online");
    mqttStatus.classList.add("offline");

});


// ==========================================
// MQTT MESSAGE
// ==========================================

client.on("message", (topic, message) => {

    const msg = message.toString();

    try {

        switch (topic) {

            case "sensor/tekanan":

                const p = JSON.parse(msg);

                currentPressure = Number(p.pressure_avg);

                updatePressure(currentPressure);

                break;


            case "flow/inlet":

                currentFlowIn = Number(msg);

                updateFlowIn(currentFlowIn);

                break;


            case "flow/outlet":

                currentFlowOut = Number(msg);

                updateFlowOut(currentFlowOut);

                break;


            case "phmeter/inlet":

                currentPHIn = Number(msg);

                updatePHIn(currentPHIn);

                break;


            case "phmeter/outlet":

                currentPHOut = Number(msg);

                updatePHOut(currentPHOut);

                break;


            case "wind/speed":

                const w = JSON.parse(msg);

                currentWind = Number(w.kecepatan_angin_knot);

                updateWind(currentWind);

                break;

        }

        updateTime();

    } catch (err) {

        console.error(err);

    }

});
// ==========================================
// CHART DATA
// ==========================================

const MAX_DATA = 20;

const labels = [];

const pressureData = [];
const windData = [];
const flowInData = [];
const flowOutData = [];
const phInData = [];
const phOutData = [];


// ==========================================
// PRESSURE CHART
// ==========================================

const pressureChart = new Chart(document.getElementById("pressureChart"), {

    type: "line",

    data: {
        labels: labels,
        datasets: [{
            label: "Pressure (Bar)",
            data: pressureData,
            borderColor: "#e74c3c",
            borderWidth: 2,
            tension: 0.3,
            fill: false
        }]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false
    }

});


// ==========================================
// FLOW CHART
// ==========================================

const flowChart = new Chart(document.getElementById("flowChart"), {

    type: "line",

    data: {
        labels: labels,
        datasets: [

            {
                label: "Flow In",
                data: flowInData,
                borderColor: "#3498db",
                borderWidth: 2,
                tension: 0.3,
                fill: false
            },

            {
                label: "Flow Out",
                data: flowOutData,
                borderColor: "#2ecc71",
                borderWidth: 2,
                tension: 0.3,
                fill: false
            }

        ]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false
    }

});


// ==========================================
// PH CHART
// ==========================================

const phChart = new Chart(document.getElementById("phChart"), {

    type: "line",

    data: {
        labels: labels,
        datasets: [

            {
                label: "pH Inlet",
                data: phInData,
                borderColor: "#8e44ad",
                borderWidth: 2,
                tension: 0.3,
                fill: false
            },

            {
                label: "pH Outlet",
                data: phOutData,
                borderColor: "#16a085",
                borderWidth: 2,
                tension: 0.3,
                fill: false
            }

        ]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false
    }

});


// ==========================================
// WIND CHART
// ==========================================

const windChart = new Chart(document.getElementById("windChart"), {

    type: "line",

    data: {
        labels: labels,
        datasets: [

            {
                label: "Wind Speed",
                data: windData,
                borderColor: "#f39c12",
                borderWidth: 2,
                tension: 0.3,
                fill: false
            }

        ]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false
    }

});


// ==========================================
// UPDATE CHART
// ==========================================

function updateCharts() {

    const waktu = new Date().toLocaleTimeString("id-ID");

    labels.push(waktu);

    pressureData.push(currentPressure);
    flowInData.push(currentFlowIn);
    flowOutData.push(currentFlowOut);
    phInData.push(currentPHIn);
    phOutData.push(currentPHOut);
    windData.push(currentWind);

    if (labels.length > MAX_DATA) {

        labels.shift();

        pressureData.shift();
        flowInData.shift();
        flowOutData.shift();
        phInData.shift();
        phOutData.shift();
        windData.shift();

    }

    pressureChart.update("none");
    flowChart.update("none");
    phChart.update("none");
    windChart.update("none");

}


// ==========================================
// AUTO UPDATE CHART
// ==========================================

setInterval(updateCharts, 1000);
function updateClock() {
    const now = new Date();

    const time = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    document.getElementById("lastUpdate").textContent =
        "Last Update : " + time;
}

// Jalankan langsung
updateClock();

// Update setiap 1 detik
setInterval(updateClock, 1000);