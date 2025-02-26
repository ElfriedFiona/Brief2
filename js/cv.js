document.getElementById("photo-upload-container").addEventListener("click", function () {
    document.getElementById("profilePic").click();
});

document.getElementById("profilePic").addEventListener("change", function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById("photo-preview");

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Ajout des champs dynamique
document.addEventListener("DOMContentLoaded", function () {
    function addField(containerId, fields, existingData = null) {
        const container = document.getElementById(containerId);
        const div = document.createElement("div");
        div.classList.add("mb-3", "border", "p-3", "position-relative");

        let inputs = [];

        fields.forEach((field, index) => {
            let input, errorDiv;

            if (field.type === "select") {
                input = document.createElement("select");
                input.classList.add("form-select", "mb-2");

                field.options.forEach(optionText => {
                    let option = document.createElement("option");
                    option.value = optionText;
                    option.textContent = optionText;
                    input.appendChild(option);
                });

                if (existingData) input.value = existingData[index];

            } else {
                input = document.createElement("input");
                input.type = field.type;
                input.classList.add("form-control", "mb-2");
                input.placeholder = field.placeholder;
                input.required = true;
                if (existingData) input.value = existingData[index];
            }

            let label = document.createElement("label");
            label.classList.add("form-label");
            label.textContent = field.label;

            errorDiv = document.createElement("div");
            errorDiv.classList.add("invalid-feedback", "d-block");
            errorDiv.style.display = "none";

            div.appendChild(label);
            div.appendChild(input);
            div.appendChild(errorDiv);
            inputs.push({ label: field.label, input: input, errorDiv: errorDiv });

            input.addEventListener("input", function () {
                updateCVSection(containerId);
                saveData();
            });
        });

        let finishBtn = document.createElement("button");
        finishBtn.textContent = "Terminé";
        finishBtn.classList.add("btn", "btn-success", "me-2");
        finishBtn.style.marginTop = "10px";

        let removeBtn = document.createElement("button");
        removeBtn.textContent = "❌";
        removeBtn.classList.add("btn", "btn-danger");
        removeBtn.style.marginTop = "10px";

        removeBtn.addEventListener("click", function () {
            container.removeChild(div);
            updateCVSection(containerId);
            saveData();
        });

        finishBtn.addEventListener("click", function () {
            let valid = true;
            let values = [];

            inputs.forEach(({ label, input, errorDiv }) => {
                let value = input.value.trim();
                errorDiv.innerHTML = "";
                errorDiv.style.display = "none";
                input.classList.remove("is-invalid");

                if (!value) {
                    valid = false;
                    errorDiv.innerHTML = `${label} ne peut pas être vide.`;
                    errorDiv.style.display = "block";
                    input.classList.add("is-invalid");
                }

                let currentYear = new Date().getFullYear();
                if (label === "Année d'obtention" && (value < 1980 || value > currentYear)) {
                    valid = false;
                    errorDiv.innerHTML = `L'année d'obtention doit être entre 1980 et ${currentYear}.`;
                    errorDiv.style.display = "block";
                    input.classList.add("is-invalid");
                }

                values.push(value);
            });

            console.log("Valeurs récupérées :", values);
          
            if (!valid) return;

            let resultDiv = document.createElement("div");
            resultDiv.classList.add("alert", "alert-secondary", "mt-2", "d-flex", "justify-content-between", "align-items-center");

            let textDiv = document.createElement("div");
            inputs.forEach(({ label }, index) => {
                let p = document.createElement("p");
                p.innerHTML = `<strong>${label}:</strong> ${values[index]}`;
                textDiv.appendChild(p);
            });

            let editBtn = document.createElement("button");
            editBtn.textContent = "Modifier";
            editBtn.classList.add("btn", "btn-warning", "btn-sm");

            editBtn.addEventListener("click", function () {
                container.removeChild(resultDiv);
                addField(containerId, fields, values);
              
            });

            console.log("Valeurs à afficher :", values);

            resultDiv.appendChild(textDiv);
            resultDiv.appendChild(editBtn);

            container.insertBefore(resultDiv, container.firstChild);
            div.remove();

            updateCVSection(containerId);
            saveData();
        });

        div.appendChild(finishBtn);
        div.appendChild(removeBtn);
        container.appendChild(div);
    }

    function updateCVSection(containerId) {
        const sectionId = {
            "education-list": "cv-education",
            "experience-list": "cv-experience",
            "skills-list": "cv-skills",
            "hobbies-list": "cv-hobbies",
            "references-list": "cv-references",
            "langues": "cv-languages"
        };

        let cvContent = "";

        const container = document.getElementById(containerId);
        // Récupérer les valeurs des champs visibles
        const fields = Array.from(container.children);
        fields.forEach(field => {
            const inputs = field.querySelectorAll("input, select");
            let values = Array.from(inputs).map(input => input.value.trim()).filter(value => value !== "");
            console.log("Valeurs récupérées :", values); // Log des valeurs
            if (values.length > 0) {
                cvContent += `<li>${values.join(", ")}</li>`;
            }
        });
      
        const results = container.querySelectorAll(".alert");
        results.forEach(result => {
            let textDiv = result.querySelector("div"); // Récupérer la div contenant le texte
            if (textDiv) {
                let formattedText = Array.from(textDiv.children)
                    .map(p => p.innerText.replace("Modifier", "").trim())
                    .join(" - ");
                cvContent += `<li>${formattedText}</li>`;
            }
        });
        

        const cvSection = document.getElementById(sectionId[containerId]);
        cvSection.innerHTML = cvContent || "Votre section est vide...";
    }

    function loadData() {
        let storedData = localStorage.getItem("cvData");
        if (!storedData) return;
    
        let formData = JSON.parse(storedData);
    
        Object.keys(formData).forEach(section => {
            let container = document.getElementById(section);
    
            formData[section].forEach(entry => {
                let resultDiv = document.createElement("div");
                resultDiv.classList.add("alert", "alert-secondary", "mt-2", "d-flex", "justify-content-between", "align-items-center");
    
                let textDiv = document.createElement("div");
                entry.forEach((value, index) => {
                    let p = document.createElement("p");
                    p.innerHTML = `<strong>${getFieldsBySection(section)[index].label}:</strong> ${value}`;
                    textDiv.appendChild(p);
                });
    
                let editBtn = document.createElement("button");
                editBtn.textContent = "Modifier";
                editBtn.classList.add("btn", "btn-warning", "btn-sm");
    
                editBtn.addEventListener("click", function () {
                    container.removeChild(resultDiv);
                    addField(section, getFieldsBySection(section), entry);
                    saveData();
                });
    
                resultDiv.appendChild(textDiv);
                resultDiv.appendChild(editBtn);
                container.appendChild(resultDiv);
            });
        });
    }
    

    function saveData() {
        let formData = JSON.parse(localStorage.getItem("cvData")) || {}; // Charger les anciennes données
    
        ["experience-list", "education-list", "skills-list", "hobbies-list", "references-list", "langues"].forEach(section => {
            let container = document.getElementById(section);
            let data = [];
    
            container.querySelectorAll(".alert").forEach(alert => {
                let values = Array.from(alert.querySelectorAll("p")).map(p => p.innerText.split(": ")[1]);
                data.push(values);
            });
    
            // Vérifier si la section a du contenu avant d'écraser
            if (data.length > 0) {
                formData[section] = data;
            }
        });
    
        localStorage.setItem("cvData", JSON.stringify(formData)); // Sauvegarde complète
    }
    
    

    function getFieldsBySection(section) {
        const fieldsMap = {
            "experience-list": [
                { label: "Nom de l’entreprise", type: "text", placeholder: "Entreprise" },
                { label: "Poste occupé", type: "text", placeholder: "Poste" },
                { label: "Durée", type: "text", placeholder: "Ex: 2 ans" },
                { label: "Description des missions", type: "text", placeholder: "Détaillez votre rôle" }
            ],
            "education-list": [
                { label: "Diplôme", type: "text", placeholder: "Ex: Master Informatique" },
                { label: "Établissement", type: "text", placeholder: "Université / École" },
                { label: "Année d'obtention", type: "number", placeholder: "Ex: 2023" }
            ],
            "skills-list": [
                { label: "Compétence", type: "text", placeholder: "Ex: JavaScript, SQL..." },
                { label: "Niveau", type: "select", options: ["Débutant", "Intermédiaire", "Avancé", "Expert"] }
            ],
            "hobbies-list": [
                { label: "Loisir / Passion", type: "text", placeholder: "Ex: Lecture, Sport..." }
            ],
            "references-list": [
                { label: "Nom", type: "text", placeholder: "Nom de la référence" },
                { label: "Poste", type: "text", placeholder: "Poste occupé" },
                { label: "Contact", type: "text", placeholder: "Email / Téléphone" }
            ],
            "langues": [
                { label: "Langue", type: "text", placeholder: "Ex: Anglais, Espagnol..." },
                { label: "Niveau", type: "select", options: ["Débutant", "Intermédiaire", "Avancé", "Bilingue"] }
            ]
        };
        return fieldsMap[section] || [];
    }

    loadData();
    ["education-list", "experience-list", "skills-list", "hobbies-list", "references-list", "langues"].forEach(updateCVSection);
    

    document.getElementById("add-experience").addEventListener("click", function () {
        addField("experience-list", getFieldsBySection("experience-list"));
    });

    document.getElementById("add-education").addEventListener("click", function () {
        addField("education-list", getFieldsBySection("education-list"));
    });

    document.getElementById("add-skills").addEventListener("click", function () {
        addField("skills-list", getFieldsBySection("skills-list"));
    });

    document.getElementById("add-hobbies").addEventListener("click", function () {
        addField("hobbies-list", getFieldsBySection("hobbies-list"));
    });

    document.getElementById("add-references").addEventListener("click", function () {
        addField("references-list", getFieldsBySection("references-list"));
    });

    document.getElementById("add-languages").addEventListener("click", function () {
        addField("langues", getFieldsBySection("langues"));
    });
});




document.addEventListener("DOMContentLoaded", function() {
    // Fonction pour mettre à jour un champ du CV
    function updateField(inputId, outputId) {
        document.getElementById(inputId).addEventListener("input", function() {
            document.getElementById(outputId).textContent = this.value;
        });
    }

    function updateFullName() {
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        
        // Concaténation avec un espace
        document.getElementById("cv-name").textContent = firstName + " " + lastName;
    }
    
    // Ajout d'un écouteur d'événements pour chaque champ
    document.getElementById("firstName").addEventListener("input", updateFullName);
    document.getElementById("lastName").addEventListener("input", updateFullName);
    

    // Mise à jour en temps réel
    
    updateField("age", "cv-age");
    updateField("jobTitle", "cv-poste");
    updateField("currentStatus", "cv-status");
    updateField("description", "cv-description");
    updateField("email", "cv-email");
    updateField("phone", "cv-phone");
    updateField("address", "cv-address");
    

    // Mise à jour du sexe
    document.querySelectorAll('input[name="gender"]').forEach(radio => {
        radio.addEventListener("change", function() {
            document.getElementById("cv-gender").textContent = this.value;
        });
    });

    // Gestion de l'upload de photo
    document.getElementById("profilePic").addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById("cv-photo").src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
});

document.addEventListener("DOMContentLoaded", function() { 
    function updateField(inputId, outputId) {
        const inputElement = document.getElementById(inputId);
        const outputElement = document.getElementById(outputId);
        
        if (localStorage.getItem(inputId)) {
            inputElement.value = localStorage.getItem(inputId);
            outputElement.textContent = localStorage.getItem(inputId);
        }

        inputElement.addEventListener("input", function() {
            outputElement.textContent = this.value;
            localStorage.setItem(inputId, this.value);
        });
    }

    function updateFullName() {
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const fullName = firstName + " " + lastName;
        
        document.getElementById("cv-name").textContent = fullName;
        localStorage.setItem("firstName", firstName);
        localStorage.setItem("lastName", lastName);
    }

    if (localStorage.getItem("firstName")) {
        document.getElementById("firstName").value = localStorage.getItem("firstName");
    }
    if (localStorage.getItem("lastName")) {
        document.getElementById("lastName").value = localStorage.getItem("lastName");
    }
    if (localStorage.getItem("firstName") || localStorage.getItem("lastName")) {
        document.getElementById("cv-name").textContent = 
            (localStorage.getItem("firstName") || "") + " " + (localStorage.getItem("lastName") || "");
    }

    document.getElementById("firstName").addEventListener("input", updateFullName);
    document.getElementById("lastName").addEventListener("input", updateFullName);
    
    updateField("age", "cv-age");
    updateField("jobTitle", "cv-poste");
    updateField("currentStatus", "cv-status");
    updateField("description", "cv-description");
    updateField("email", "cv-email");
    updateField("phone", "cv-phone");
    updateField("address", "cv-address");

    document.querySelectorAll('input[name="gender"]').forEach(radio => {
        if (localStorage.getItem("gender") === radio.value) {
            radio.checked = true;
            document.getElementById("cv-gender").textContent = radio.value;
        }

        radio.addEventListener("change", function() {
            document.getElementById("cv-gender").textContent = this.value;
            localStorage.setItem("gender", this.value);
        });
    });

    // Gestion de l'upload de photo
    const profilePicInput = document.getElementById("profilePic");
    const profilePicPreview = document.getElementById("cv-photo");
    const imageMessage = document.getElementById("imageMessage"); // Ajout d'un message pour indiquer une image chargée
    const resetImageButton = document.getElementById("resetImage"); // Bouton pour réinitialiser

    profilePicInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePicPreview.src = e.target.result;
                localStorage.setItem("profilePic", e.target.result);
                imageMessage.textContent = "✔ Image enregistrée"; // Message de confirmation
            };
            reader.readAsDataURL(file);
        }
    });

    if (localStorage.getItem("profilePic")) {
        profilePicPreview.src = localStorage.getItem("profilePic");
        imageMessage.textContent = "✔ Image enregistrée"; // Afficher le message si une image existe
    }

    // Réinitialisation de l'image
    resetImageButton.addEventListener("click", function() {
        localStorage.removeItem("profilePic");
        profilePicPreview.src = "";
        imageMessage.textContent = "❌ Image supprimée";
    });
});












