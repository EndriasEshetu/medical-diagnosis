//Disease type and its symptoms
const symptomsObject = {
  cold: ["headache", "running_nose", "sore_throat", "mild_cough", "tiredness"],
  covid_19: [
    "fever",
    "cough",
    "difficulty_breathing",
    "fatigue",
    "loss_taste/smell",
  ],
  flu: ["fever", "headache", "chills", "body_ache", "dry_cough", "fatigue"],
  typhoid: ["headache", "abdominal_pain", "poor_appetite", "fever"],
  measles: ["fever", "running_nose", "rash", "conjunctivitis"],
  malaria: ["fever", "sweating", "headache", "nausea", "vomiting", "diarrhea"],
};

// Diseases and their Treatment
const treatments = {
  cold: [
    "Antihistamines tablets",
    "Paracetamol tablets",
    "Cough syrup",
    "Rest, stay hydrated, and use over-the-counter medication.",
  ],
  covid_19: [
    "Paxlovid",
    "Antihistamines",
    "Paracetamol",
    "Eat well, sleep enough, and stay active to keep your immune system strong.",
  ],
  flu: [
    "Tamiflu or Oseltamivir",
    "Paracetamol",
    "Cough syrup",
    "Warm bath and hydrate",
  ],
  typhoid: [
    "Chloramphenicol",
    "Amoxicillin",
    "Ciprofloxacin",
    "Azithromycin",
    "Eat cooked food and bottled water",
  ],
  measles: [
    "Quinine",
    "Tylenol",
    "Agvil",
    "Vitamin A diet",
    "Rest and hydrate",
  ],
  malaria: [
    "Aralen",
    "Qualaquin",
    "Plaquenil",
    "Mefloquine",
    "Use mosquito nets and repellents",
  ],
};

// Array of Responses
let responses = {};
let currentSymptoms = [];
let currentIndex = 0;
let userName = "";

// function to start the program and collect data
function startDiagnosis() {
  document.getElementById("instructions").style.display = "none";
  document.getElementById("result").innerHTML = "";
  document.getElementById("identity").style.display = "block";

  // Retrieve all array using Object.values
  // Combine in to one Array using flat()
  // Avoid duplicated symptoms using Set
  const allSymptoms = [...new Set(Object.values(symptomsObject).flat())];
  currentSymptoms = allSymptoms;
  currentIndex = 0;
  responses = {};
  askNext();
}

//function for Identify Personality
function identify() {
  //Get input elements
  const nameInput = document.querySelector(".name");
  const ageInput = document.querySelector(".age");

  // Store values before clearing
  userName = nameInput.value;

  // Clear input fields
  nameInput.value = "";
  ageInput.value = "";

  // Clear input box and proceed next steps.
  document.getElementById("identity").style.display = "none";
  document.getElementById("diagnosis").style.display = "block";
}

//function for next symptom question
function askNext() {
  if (currentIndex >= currentSymptoms.length) {
    finishDiagnosis();
    return;
  }

  const symptom = currentSymptoms[currentIndex];
  document.getElementById(
    "question"
  ).textContent = `Do you have ${symptom.replace(/_/g, " ")}?`;

  document.getElementById("progress").textContent = `Question ${
    currentIndex + 1
  } of ${currentSymptoms.length}`;
}

//Records the user's response for the current symptom
function answer(response) {
  const symptom = currentSymptoms[currentIndex];
  responses[symptom] = response;
  currentIndex++;
  askNext();
}

//

function finishDiagnosis() {
  document.getElementById("diagnosis").style.display = "none";

  // Calculate match % for each disease
  const diseaseMatches = [];
  for (let disease in symptomsObject) {
    const symptoms = symptomsObject[disease];
    const matched = symptoms.filter((symptom) => responses[symptom]).length;
    const percentMatch = (matched / symptoms.length) * 100;

    if (percentMatch >= 50) {
      // Only consider diseases with ≥50% match
      diseaseMatches.push({ disease, percentMatch });
    }
  }

  // Sort diseases by highest % first
  diseaseMatches.sort((a, b) => b.percentMatch - a.percentMatch);

  const resultDiv = document.getElementById("result");

  // Case: No matches found
  if (diseaseMatches.length === 0) {
    resultDiv.innerHTML = `
      <h3>No clear diagnosis.</h3>
      <p>Your symptoms don't strongly match any known conditions in our system.</p>
      <p><strong>Advice:</strong> Consult a doctor if symptoms persist.</p>
      <button onclick="startDiagnosis()">Try Again</button>
      <p class="disclaimer">Note: This is a basic tool, not medical advice.</p>
    `;
    return;
  }

  // Case: One or more matches found
  const topDisease = diseaseMatches[0]; // Highest % match
  const otherDiseases = diseaseMatches.slice(1); // Other matches (if any)

  // Generate HTML for treatments
  const adviceList = treatments[topDisease.disease]
    .map((item) => `<li>${item}</li>`)
    .join("");

  // Generate HTML for other possible diseases (if any)
  let otherDiseasesHTML = "";
  if (otherDiseases.length > 0) {
    otherDiseasesHTML = `
      <h4>Other Possible Conditions:</h4>
      <ul>
        ${otherDiseases
          .map(
            (d) =>
              `<li><strong>${d.disease.toUpperCase()}</strong> (${d.percentMatch.toFixed(
                0
              )}% match)</li>`
          )
          .join("")}
      </ul>
    `;
  }

  // Final Result Display
  resultDiv.innerHTML = `
    <p><strong>${
      userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase()
    }, Your Most Likely Condition ${topDisease.disease.toUpperCase()}</strong> (${topDisease.percentMatch.toFixed(
    0
  )}% match).</p>
    
    <h4>Recommended Treatment:</h4>
    <ul>${adviceList}</ul>
    
    ${otherDiseasesHTML}
    
    <p><strong>Note:</strong> If symptoms worsen, Consult a doctor.</p>
    <button onclick="startDiagnosis()">Restart Diagnosis</button>
    <p class="disclaimer">This tool is for educational purposes only.</p>
  `;
}
