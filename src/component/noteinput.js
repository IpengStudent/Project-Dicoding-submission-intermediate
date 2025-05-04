class NoteInput extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupForm();
  }

  setupForm() {
    const form = this.shadowRoot.querySelector("form");
    const titleInput = this.shadowRoot.querySelector("#title");
    const bodyInput = this.shadowRoot.querySelector("#body");
    const titleError = this.shadowRoot.querySelector("#titleError");
    const bodyError = this.shadowRoot.querySelector("#bodyError");
    const submitButton = this.shadowRoot.querySelector("button");

    titleInput.addEventListener("input", () => {
      titleError.textContent =
        titleInput.value.trim() === "" ? "Judul tidak boleh kosong!" : "";
    });

    bodyInput.addEventListener("input", () => {
      bodyError.textContent =
        bodyInput.value.trim() === "" ? "Isi catatan tidak boleh kosong!" : "";
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = titleInput.value.trim();
      const body = bodyInput.value.trim();

      // Validasi input
      if (title === "") {
        titleError.textContent = "Judul tidak boleh kosong!";
      }
      if (body === "") {
        bodyError.textContent = "Isi catatan tidak boleh kosong!";
      }
      if (title === "" || body === "") {
        return;
      }

      // Disable button saat proses submit
      submitButton.disabled = true;
      submitButton.textContent = "Menyimpan...";

      try {
        const response = await fetch(
          "https://notes-api.dicoding.dev/v2/notes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, body }),
          }
        );

        if (!response.ok) {
          throw new Error("Gagal menambahkan catatan");
        }

        // Kosongkan form setelah berhasil
        titleInput.value = "";
        bodyInput.value = "";
        titleError.textContent = "";
        bodyError.textContent = "";

        // Kirim event untuk memuat ulang daftar catatan
        document.dispatchEvent(new Event("noteUpdated"));

        // Tampilkan notifikasi sukses
        this.showAlert("Catatan berhasil ditambahkan", "success");
      } catch (error) {
        console.error("Error:", error);
        this.showAlert("Gagal menambahkan catatan", "error");
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Tambah Catatan";
      }
    });
  }

  showAlert(message, type) {
    const alertElement = document.createElement("div");
    alertElement.textContent = message;
    alertElement.style.position = "fixed";
    alertElement.style.bottom = "20px";
    alertElement.style.right = "20px";
    alertElement.style.padding = "12px 24px";
    alertElement.style.borderRadius = "8px";
    alertElement.style.color = "white";
    alertElement.style.backgroundColor =
      type === "success" ? "#4CAF50" : "#F44336";
    alertElement.style.zIndex = "1000";
    alertElement.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";

    document.body.appendChild(alertElement);

    setTimeout(() => {
      alertElement.remove();
    }, 3000);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .add-note {
          max-width: 550px;
          margin: 20px auto;
          padding: 40px;
          background-color: #A7C7E7;
          border-radius: 12px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        }
        form {
          display: grid;
          gap: 12px;
        }
        .form-group {
          display: grid;
        }
        label {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 6px;
        }
        input, textarea {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 14px;
          width: 100%;
          box-sizing: border-box;
        }
        textarea {
          min-height: 120px;
          resize: vertical;
        }
        .error-message {
          color: red;
          font-size: 12px;
          margin-top: 4px;
        }
        button {
          background-color: #A8B5A2;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: 0.3s;
        }
        button:hover {
          background-color: #B5E7A0;
        }
        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
      </style>
      <section class="add-note" id="add-note">
        <form>
        
          <div class="form-group form-title">
            <label for="title">Judul Note</label>
            <input type="text" id="title" name="title" required>
            <span class="error-message" id="titleError"></span>
          </div>

          <div class="form-group form-title">
            <label for="body">Note</label>
            <textarea name="note" id="body" required></textarea>
            <span class="error-message" id="bodyError"></span>
          </div>

          <button type="submit">Tambah Catatan</button>
        </form>
      </section>`;
  }
}

customElements.define("note-input", NoteInput);
