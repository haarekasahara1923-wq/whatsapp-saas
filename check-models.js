
const API_KEY = "AIzaSyBwOUErffADQAS_zTzaaMKR_bFRtSgIF9o";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function check() {
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log("Available Models:");
        data.models.forEach(m => console.log(m.name));
    } catch (e) {
        console.error(e);
    }
}
check();
