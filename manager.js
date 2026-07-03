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
        id: "hero-background",
        name: "HERO BACKGROUND",
        selector: ".hero-image",
        type: "background",
        fallback: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=2400&q=90"
    },
    {
        id: "statement-image",
        name: "TRANSFORM SECTION IMAGE",
        selector: ".statement-image",
        type: "background",
        fallback: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=90"
    },
    {
        id: "project-1",
        name: "SELECTED WORK 01",
        selector: ".project-image-one",
        type: "background",
        fallback: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=90"
    },
    {
        id: "project-2",
        name: "SELECTED WORK 02",
        selector: ".project-image-two",
        type: "background",
        fallback: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1500&q=90"
    },
    {
        id: "project-3",
        name: "SELECTED WORK 03",
        selector: ".project-image-three",
        type: "background",
        fallback: "https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?auto=format&fit=crop&w=1500&q=90"
    },
    {
        id: "project-4",
        name: "SELECTED WORK 04",
        selector: ".project-image-four",
        type: "background",
        fallback: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=90"
    },
    {
        id: "experience-background",
        name: "EXPERIENCE BACKGROUND",
        selector: ".experience-background",
        type: "background",
        fallback: "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=2400&q=90"
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
                    <label>${slot.name}</label>
                    <input type="file" id="image-${slot.id}" accept="image/*">

                    <button class="save-image" data-slot="${slot.id}">
                        SAVE IMAGE
                        <span>↗</span>
                    </button>
                </div>
            </article>
        `;
    }).join("");

    websiteImageConfig.forEach((slot) => {
        const input = document.getElementById(`image-${slot.id}`);
        const preview = document.getElementById(`preview-${slot.id}`);
        const saveButton = document.querySelector(
            `.save-image[data-slot="${slot.id}"]`
        );

        if (input && preview) {
            input.addEventListener("change", function () {
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

        if (saveButton && preview) {
            saveButton.addEventListener("click", function () {
                const source = preview.dataset.newImage || preview.dataset.currentImage || slot.fallback;

                websiteImages[slot.id] = source;

                try {
                    localStorage.setItem(
                        "daniloWebsiteImages",
                        JSON.stringify(websiteImages)
                    );

                    applyWebsiteImage(slot, source, preview);

                    imageManagerMessage.textContent =
                        `${slot.name} SAVED SUCCESSFULLY.`;

                    setTimeout(() => {
                        imageManagerMessage.textContent = "";
                    }, 3000);
                } catch (error) {
                    imageManagerMessage.textContent =
                        "IMAGE IS TOO LARGE. TRY A SMALLER PHOTO.";
                }
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