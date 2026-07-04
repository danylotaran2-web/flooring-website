if (sessionStorage.getItem("daniloAdminLoggedIn") !== "true") {
    window.location.href = "admin.html";
}

const saveMessage = document.getElementById("saveMessage");
const imageManagerMessage = document.getElementById("imageManagerMessage");
const logoutButton = document.getElementById("logoutButton");
const websiteImagesGrid = document.getElementById("websiteImagesGrid");
const viewWebsiteLink = document.getElementById("viewWebsiteLink");

if (viewWebsiteLink) {
    viewWebsiteLink.href = new URL("index.html", window.location.href).href;
}

const defaultProjects = [
    {
        title: "WARM MODERN LIVING",
        type: "Residential Flooring"
    },
    {
        title: "REFINED STAIRCASE",
        type: "Stair Installation"
    },
    {
        title: "NATURAL KITCHEN",
        type: "Flooring Installation"
    },
    {
        title: "OPEN SPACE",
        type: "Full Floor Replacement"
    }
];

const websiteImageConfig = [
    {
        id: "hero-main",
        name: "HERO / MAIN BACKGROUND IMAGE",
        selector: ".hero-image",
        type: "background",
        outputName: "hero-main.jpeg",
        publicPath: "images/hero-main.jpeg",
        fallback: "images/hero-main.jpeg"
    },
    {
        id: "transform-section",
        name: "TRANSFORM SECTION IMAGE",
        selector: ".statement-image",
        type: "background",
        outputName: "transform-section.jpeg",
        publicPath: "images/transform-section.jpeg",
        fallback: "images/transform-section.jpeg"
    },
    {
        id: "precision-background",
        name: "PRECISION / CRAFT / QUALITY BACKGROUND",
        selector: ".experience-background",
        type: "background",
        outputName: "precision-background.jpeg",
        publicPath: "images/precision-background.jpeg",
        fallback: "images/precision-background.jpeg"
    },
    {
        id: "project-1",
        name: "PROJECT 01",
        selector: ".project-image-one",
        type: "background",
        outputName: "project-1.jpeg",
        publicPath: "images/project-1.jpeg",
        fallback: "images/project-1.jpeg"
    },
    {
        id: "project-2",
        name: "PROJECT 02",
        selector: ".project-image-two",
        type: "background",
        outputName: "project-2.jpeg",
        publicPath: "images/project-2.jpeg",
        fallback: "images/project-2.jpeg"
    },
    {
        id: "project-3",
        name: "PROJECT 03",
        selector: ".project-image-three",
        type: "background",
        outputName: "project-3.jpeg",
        publicPath: "images/project-3.jpeg",
        fallback: "images/project-3.jpeg"
    },
    {
        id: "project-4",
        name: "PROJECT 04",
        selector: ".project-image-four",
        type: "background",
        outputName: "project-4.jpeg",
        publicPath: "images/project-4.jpeg",
        fallback: "images/project-4.jpeg"
    }
];

function getProjects() {
    const savedProjects = localStorage.getItem("daniloProjects");

    if (savedProjects) {
        return JSON.parse(savedProjects);
    }

    return defaultProjects;
}

function getWebsiteImages() {
    const savedImages = localStorage.getItem("daniloWebsiteImages");

    if (savedImages) {
        try {
            return JSON.parse(savedImages);
        } catch (error) {
            console.warn("Unable to load saved website images.", error);
        }
    }

    return {};
}

let projects = getProjects();
let websiteImages = getWebsiteImages();

function loadManager() {
    projects.forEach((project, index) => {
        const projectNumber = index + 1;

        const titleInput = document.getElementById(
            `title${projectNumber}`
        );

        const typeInput = document.getElementById(
            `type${projectNumber}`
        );

        const preview = document.getElementById(
            `preview${projectNumber}`
        );

        titleInput.value = project.title;
        typeInput.value = project.type;

        if (project.image) {
            preview.src = project.image;
        }
    });
}

for (let i = 1; i <= 4; i++) {
    const imageInput = document.getElementById(`image${i}`);
    const preview = document.getElementById(`preview${i}`);

    imageInput.addEventListener("change", function () {
        const file = this.files[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = function (event) {
            const img = new Image();

            img.onload = function () {
                const canvas = document.createElement("canvas");

                const maxWidth = 2000;
                const maxHeight = 2000;

                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(
                        maxWidth / width,
                        maxHeight / height
                    );

                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                const compressedImage = canvas.toDataURL(
                    "image/jpeg",
                    0.86
                );

                preview.src = compressedImage;
                preview.dataset.newImage = compressedImage;
            };

            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    });
}

document.querySelectorAll(".save-project").forEach((button) => {
    button.addEventListener("click", function () {
        const projectNumber = Number(this.dataset.project);
        const projectIndex = projectNumber - 1;

        const title = document.getElementById(
            `title${projectNumber}`
        ).value.trim();

        const type = document.getElementById(
            `type${projectNumber}`
        ).value.trim();

        const preview = document.getElementById(
            `preview${projectNumber}`
        );

        projects[projectIndex] = {
            title: title,
            type: type,
            image:
                preview.dataset.newImage ||
                projects[projectIndex].image ||
                ""
        };

        try {
            localStorage.setItem(
                "daniloProjects",
                JSON.stringify(projects)
            );

            saveMessage.textContent =
                `PROJECT ${projectNumber} SAVED SUCCESSFULLY.`;

            setTimeout(() => {
                saveMessage.textContent = "";
            }, 3000);
        } catch (error) {
            saveMessage.textContent =
                "IMAGE IS TOO LARGE. TRY A SMALLER PHOTO.";
        }
    });
});

function applyWebsiteImage(slot, source, preview) {
    const target = document.querySelector(slot.selector);

    if (!target) {
        return;
    }

    if (slot.type === "background") {
        target.style.backgroundImage = `url("${source}")`;
    } else if (preview) {
        preview.src = source;
    }

    if (preview) {
        preview.src = source;
        preview.dataset.currentImage = source;
    }
}

function setSlotStatus(slotId, message) {
    const status = document.getElementById(`status-${slotId}`);

    if (status) {
        status.textContent = message;
    }
}

function renderWebsiteImageEditors() {
    if (!websiteImagesGrid) {
        return;
    }

    websiteImagesGrid.innerHTML = websiteImageConfig.map((slot) => {
        const currentValue = websiteImages[slot.id] || slot.fallback;

        return `
            <article class="website-image-editor" data-slot="${slot.id}">
                <div class="image-preview">
                    <img id="preview-${slot.id}" data-current-image="${currentValue}" src="${currentValue}" alt="${slot.name}">
                    <span>${slot.name}</span>
                </div>

                <div class="editor-content">
                    <p class="slot-path">Permanent public file: ${slot.publicPath}</p>
                    <p class="slot-note">Download the prepared image and replace the matching file inside the /images folder.</p>
                    <label class="choose-button" for="image-${slot.id}">
                        <input type="file" id="image-${slot.id}" accept="image/*">
                        <span id="label-${slot.id}">CHOOSE PHOTO</span>
                    </label>

                    <button class="prepare-button" data-slot="${slot.id}" type="button">
                        DOWNLOAD / PREPARE PHOTO
                        <span>↗</span>
                    </button>

                    <p class="slot-status" id="status-${slot.id}">Current preview is ready for ${slot.publicPath}.</p>
                </div>
            </article>
        `;
    }).join("");

    websiteImageConfig.forEach((slot) => {
        const input = document.getElementById(`image-${slot.id}`);
        const preview = document.getElementById(`preview-${slot.id}`);
        const buttonLabel = document.getElementById(`label-${slot.id}`);
        const prepareButton = document.querySelector(
            `.prepare-button[data-slot="${slot.id}"]`
        );
        const selectedFiles = {};

        if (input && preview) {
            input.addEventListener("change", function () {
                const file = this.files[0];

                if (!file) {
                    return;
                }

                const reader = new FileReader();

                reader.onload = function (event) {
                    preview.src = event.target.result;
                    preview.dataset.newImage = event.target.result;
                    selectedFiles[slot.id] = file;

                    if (buttonLabel) {
                        buttonLabel.textContent = "REPLACE PHOTO";
                    }

                    setSlotStatus(slot.id, `Selected for ${slot.publicPath}.`);
                };

                reader.readAsDataURL(file);
            });
        }

        if (prepareButton && preview) {
            prepareButton.addEventListener("click", function () {
                const file = selectedFiles[slot.id];

                if (!file) {
                    setSlotStatus(slot.id, `Choose a photo first. This slot will use ${slot.publicPath}.`);
                    return;
                }

                const reader = new FileReader();

                reader.onload = function (event) {
                    const img = new Image();

                    img.onload = function () {
                        const canvas = document.createElement("canvas");
                        const maxWidth = 2000;
                        const maxHeight = 2000;

                        let width = img.width;
                        let height = img.height;

                        if (width > maxWidth || height > maxHeight) {
                            const ratio = Math.min(maxWidth / width, maxHeight / height);
                            width = Math.round(width * ratio);
                            height = Math.round(height * ratio);
                        }

                        canvas.width = width;
                        canvas.height = height;

                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0, width, height);

                        canvas.toBlob(function (blob) {
                            if (!blob) {
                                setSlotStatus(slot.id, "The photo could not be prepared. Please try another file.");
                                return;
                            }

                            const link = document.createElement("a");
                            const objectUrl = URL.createObjectURL(blob);
                            link.href = objectUrl;
                            link.download = slot.outputName;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(objectUrl);

                            setSlotStatus(slot.id, `Prepared and downloaded as ${slot.outputName}. Replace the matching file in ${slot.publicPath}.`);
                        }, "image/jpeg", 0.92);
                    };

                    img.src = event.target.result;
                };

                reader.readAsDataURL(file);
            });
        }

        applyWebsiteImage(slot, websiteImages[slot.id] || slot.fallback, preview);
    });
}

logoutButton.addEventListener("click", function () {
    sessionStorage.removeItem("daniloAdminLoggedIn");
    window.location.href = "admin.html";
});

loadManager();
renderWebsiteImageEditors();