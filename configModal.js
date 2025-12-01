class ConfigModal {
    constructor(containerId, title, fields, onSendCallback) {
        this.container = document.getElementById(containerId);
        this.title = title;
        this.fields = fields;
        this.onSend = onSendCallback || function (data) { console.log("No onSend callback", data); };

        this._createModalStructure();
        this._injectStyles();
        this.createBackdrop();
    }

    createBackdrop(){
        var backdrop = document.querySelector(".modal-backdrop") 
        if (backdrop) return; // already exists
        backdrop = document.createElement("div"); 
        backdrop.className = "modal-backdrop";
        document.body.appendChild(backdrop);
    }

    _createModalStructure() {
        this.container.innerHTML = `
            <div id="configModal" class="modal">
                <h3>${this.title}</h3>
                <form id="settingsForm">
                    <div id="formFields"></div>
                    <button type="submit">Save</button>
                    <button type="button" id="cancelButton">Cancel</button>
                </form>
            </div>
        `;

        this.modal = this.container.querySelector("#configModal");
        this.form = this.container.querySelector("#settingsForm");
        this.formFields = this.container.querySelector("#formFields");
        this.cancelBtn = this.container.querySelector("#cancelButton");

        this.form.onsubmit = this.submitSettings.bind(this);
        this.cancelBtn.onclick = () => this.hide();

        //this.createBackdrop();
    }

    _injectStyles() {
        const style = document.createElement("style");
        style.textContent = `
    .modal {
        display: none;
        position: fixed;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -30%);
        background: #fff;
        border: 1px solid #ccc;
        padding: 15px;
        width: 500px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        font-family: sans-serif;
        text-align: left;
        z-index: 1000;
    }

    .modal.show {
        display: block;
    }

    .modal-backdrop {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255, 255, 255, 0.1); /* light transparent layer */
    backdrop-filter: blur(8px);           /* apply blur */
    -webkit-backdrop-filter: blur(8px);   /* for Safari */
    z-index: 999;
}

.modal-backdrop.show {
    display: block;
}


.form-field {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 12px;
}
.form-field label {
    width: 100px;
    text-align: right;
    margin-right: 10px;
    white-space: nowrap;
}
.form-field input {
    flex: 1;
    min-width: 0; /* allows flex-shrink if needed */
}
`;

        document.head.appendChild(style);
    }

    generateForm() {
        this.formFields.innerHTML = '';

        this.fields.forEach(field => {
            const wrapper = document.createElement('div');
            wrapper.className = 'form-field';

            const label = document.createElement('label');
            label.innerText = `${field.name}:`;
            label.setAttribute('for', field.name); // accessibility

            let input;

            if (field.type === "select") {
                input = document.createElement("select");
                input.name = field.name;
                input.id = field.name;

                (field.options || []).forEach(optionValue => {
                    const option = document.createElement("option");
                    option.value = optionValue;
                    option.innerText = optionValue;
                    input.appendChild(option);
                });

            } else if (field.type === "radio") {
                input = document.createElement("div");
                input.style.display = "flex";
                input.style.gap = "10px";

                (field.options || []).forEach(optionValue => {
                    const radioId = `${field.name}_${optionValue}`;
                    const radioWrapper = document.createElement("label");

                    const radio = document.createElement("input");
                    radio.type = "radio";
                    radio.name = field.name;
                    radio.value = optionValue;
                    radio.id = radioId;

                    if (field.value === optionValue) {
                        radio.checked = true;
                    }

                    radioWrapper.appendChild(radio);
                    radioWrapper.appendChild(document.createTextNode(optionValue));
                    input.appendChild(radioWrapper);
                });

            } else {
                input = document.createElement("input");
                input.type = field.type;
                input.name = field.name;
                input.id = field.name;
                if (field.required) input.required = true;
                if (field.pattern) input.pattern = field.pattern;
                if (field.validityMessage) {
                    this.addCustomValidation(input, field.validityMessage);
                }
            }

            input.id = field.name;
            if (field.required) input.required = true;

            wrapper.appendChild(label);
            wrapper.appendChild(input);
            this.formFields.appendChild(wrapper);
        });
    }

    addCustomValidation(input, message) {
        input.addEventListener("invalid", () => {
            input.setCustomValidity(message);
        });

        input.addEventListener("input", () => {
            input.setCustomValidity("");
        });


    }

    show() {
        this.generateForm();
        this.modal.classList.add("show");
        document.querySelector(".modal-backdrop").classList.add("show");
    }

    hide() {
        this.modal.classList.remove("show");
        document.querySelector(".modal-backdrop").classList.remove("show");
    }

    submitSettings(e) {
        e.preventDefault();

        const data = {};
        for (const field of this.form.elements) {
            if (field.name) {
                data[field.name] = field.type === 'checkbox' ? field.checked : field.value;
            }
        }

        this.onSend(data);
        this.hide();
    }
}
