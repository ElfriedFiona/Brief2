document.addEventListener("DOMContentLoaded", function () {
    const images = {
        1: "../assets/images/accueil1.jpg",
        2: "../assets/images/accueil2.jpg",
        3: "../assets/images/accueil3.jpg"
    };

    let currentStep = 1;
    const steps = document.querySelectorAll(".step");
    const stepImage = document.getElementById("stepImage");

    function showStep(stepNumber) {
        // Retirer la classe 'active' de toutes les étapes
        steps.forEach(step => step.classList.remove("active"));

        // Ajouter la classe 'active' à l'étape en cours
        const activeStep = document.querySelector(`.step[data-step="${stepNumber}"]`);
        if (activeStep) {
            activeStep.classList.add("active");
        }

        // Changer l’image
        stepImage.src = images[stepNumber];
        stepImage.style.display = "block";
        stepImage.style.opacity = "1";
    }

    function nextStep() {
        showStep(currentStep);
        currentStep = currentStep % 3 + 1; // Boucle entre 1 → 2 → 3 → 1
    }

    // Démarrer l'animation
    showStep(currentStep);
    setInterval(nextStep, 3000);
});