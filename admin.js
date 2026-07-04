const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("loginError");
const loginView = document.getElementById("loginView");
const managerView = document.getElementById("managerView");
const logoutButton = document.getElementById("logoutButton");

const ADMIN_PASSWORD = "Danilo2026";

const projectConfig = [
    {
        number: 1,
        fileInputId: "file1",
        previewId: "preview1",
        buttonLabelId: "buttonLabel1",
        statusId: "status1",
        outputName: "project-1.jpeg",
        publicPath: "images/project-1.jpeg"
    },
    {
        number: 2,
        fileInputId: "file2",
        previewId: "preview2",
        buttonLabelId: "buttonLabel2",
        statusId: "status2",
        outputName: "project-2.jpeg",
        publicPath: "images/project-2.jpeg"
    },
    {
        number: 3,
        fileInputId: "file3",
        previewId: "preview3",
        buttonLabelId: "buttonLabel3",
        statusId: "status3",
        outputName: "project-3.jpeg",
        publicPath: "images/project-3.jpeg"
    },
    {
        number: 4,
        fileInputId: "file4",
        previewId: "preview4",
        buttonLabelId: "buttonLabel4",
        statusId: "status4",
        outputName: "project-4.jpeg",
        publicPath: "images/project-4.jpeg"
    }
];

const selectedFiles = {};

function showManager() {
    loginView.hidden = true;
    managerView.hidden = false;
}

function showLogin() {
    loginView.hidden = false;
    managerView.hidden = true;
    passwordInput.value = "";
    passwordInput.focus();
}

function setStatus(projectNumber, message) {
    const status = document.getElementById(`status${projectNumber}`);

    if (status) {
        status.textContent = message;
    }
}

function setPreview(projectNumber, dataUrl) {
    const preview = document.getElementById(`preview${projectNumber}`);

    if (preview) {
        preview.src = dataUrl;
    }
}

function prepareAndDownload(projectNumber) {
    const file = selectedFiles[projectNumber];
    const config = projectConfig[projectNumber - 1];

    if (!file) {
        setStatus(projectNumber, `Choose a photo first. This project will use ${config.publicPath}.`);
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        const image = new Image();

        image.onload = function () {
            const canvas = document.createElement("canvas");
            const maxWidth = 2000;
            const maxHeight = 2000;

            let width = image.width;
            let height = image.height;

            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            canvas.width = width;
            canvas.height = height;

            const context = canvas.getContext("2d");
            context.drawImage(image, 0, 0, width, height);

            canvas.toBlob(function (blob) {
                if (!blob) {
                    setStatus(projectNumber, "The photo could not be prepared. Please try another file.");
                    return;
                }

                const link = document.createElement("a");
                const objectUrl = URL.createObjectURL(blob);
                link.href = objectUrl;
                link.download = config.outputName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(objectUrl);

                setStatus(projectNumber, `Prepared and downloaded as ${config.outputName}. Place it in ${config.publicPath}.`);
            }, "image/jpeg", 0.92);
        };

        image.src = event.target.result;
    };

    reader.readAsDataURL(file);
}

projectConfig.forEach((config) => {
    const input = document.getElementById(config.fileInputId);
    const buttonLabel = document.getElementById(config.buttonLabelId);
    const saveButton = document.querySelector(`.save-button[data-project="${config.number}"]`);

    if (input && buttonLabel) {
        input.addEventListener("change", function () {
            const file = this.files[0];

            if (!file) {
                return;
            }

            const reader = new FileReader();

            reader.onload = function (event) {
                setPreview(config.number, event.target.result);
                selectedFiles[config.number] = file;
                buttonLabel.textContent = "REPLACE PHOTO";
                setStatus(config.number, `Selected for ${config.publicPath}.`);
            };

            reader.readAsDataURL(file);
        });
    }

    if (saveButton) {
        saveButton.addEventListener("click", function () {
            prepareAndDownload(config.number);
        });
    }
});

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const password = passwordInput.value;

    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem("daniloAdminLoggedIn", "true");
        showManager();
    } else {
        loginError.textContent = "Incorrect password. Please try again.";
        passwordInput.value = "";
        passwordInput.focus();
    }
});

logoutButton.addEventListener("click", function () {
    sessionStorage.removeItem("daniloAdminLoggedIn");
    showLogin();
});

if (sessionStorage.getItem("daniloAdminLoggedIn") === "true") {
    showManager();
} else {
    showLogin();
}