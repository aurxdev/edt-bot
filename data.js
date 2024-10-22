// data.js

// URL de l'API
const apiUrl = 'https://sos-salle.polytech-lille.fr/wsADE_events.php?serveurade=planning-2024&numprojet=0&promo=3YMHMA-120&start=2024-10-22&end=2024-10-23&_=1729624473910';

// Fonction pour faire la requête API
async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
    }
}

function convertirDate(dateStr) {
    return dateStr.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z');
}

function afficherCours(cours) {
    const { title, start, end } = cours;
    const dateDebut = new Date(convertirDate(start));
    const dateFin = new Date(convertirDate(end));
    const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const optionsHeure = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const jour = dateDebut.toLocaleDateString('fr-FR', optionsDate);
    const heureDebut = dateDebut.toLocaleTimeString('fr-FR', optionsHeure);
    const heureFin = dateFin.toLocaleTimeString('fr-FR', optionsHeure);
    const salle = title.split('-')[4];
    return `📚 Titre: ${title.split('-')[1]}\n📅 Jour: ${jour}\n🕒 Heure de début: ${heureDebut}\n🕒 Heure de fin: ${heureFin}\n🏫 Salle: ${salle}`;
}

function afficherCoursAujourdhui(coursArray) {
    const aujourdHui = new Date().toISOString().split('T')[0];
    const coursAujourdhui = getCoursPourJournee(coursArray, aujourdHui);
    coursAujourdhui.forEach(cours => afficherCours(cours));
}

function getCoursPourJournee(coursArray, dateSpecifique) {
    const dateSpecifiqueObj = new Date(dateSpecifique);
    return coursArray.filter(cours => {
        const dateDebut = new Date(convertirDate(cours.start));
        return dateDebut.toDateString() === dateSpecifiqueObj.toDateString();
    });
}

export { fetchData, afficherCours, afficherCoursAujourdhui, getCoursPourJournee };
