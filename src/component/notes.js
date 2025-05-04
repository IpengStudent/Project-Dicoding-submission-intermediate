class NoteList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.notes = [];
    this.showArchived = false;
    this.toggleTexts = {
      archived: "Tampilkan Catatan Aktif",
      active: "Tampilkan Arsip",
    };
  }


  async connectedCallback() {
    await this.fetchNotes();
    document.addEventListener("noteUpdated", () => this.fetchNotes());
  }

  async fetchNotes() {
    try {
      const endpoint = this.showArchived
        ? "https://notes-api.dicoding.dev/v2/notes/archived"
        : "https://notes-api.dicoding.dev/v2/notes";

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Gagal mengambil catatan");

      const data = await response.json();
      this.notes = data.data;
      this.render();
    } catch (error) {
      console.error("Error:", error);
      this.showAlert("Gagal memuat catatan", "error");
    }
  }

  async toggleArchive(noteId, isArchived) {
    try {
      const action = isArchived ? "unarchive" : "archive";
      const response = await fetch(
        `https://notes-api.dicoding.dev/v2/notes/${noteId}/${action}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Gagal ${action} catatan`);
      }

      this.showAlert(
        `Catatan berhasil ${
          isArchived ? "dikeluarkan dari arsip" : "diarsipkan"
        }`,
        "success"
      );

      // Refresh data setelah berhasil
      await this.fetchNotes();
    } catch (error) {
      console.error("Error:", error);
      this.showAlert(
        `Gagal ${isArchived ? "mengaktifkan" : "mengarsipkan"} catatan: ${
          error.message
        }`,
        "error"
      );
    }
  }

  async deleteNote(noteId) {
      // Tampilkan loading indicator
      const loadingOverlay = document.createElement('div');
      loadingOverlay.className = 'loading-overlay';
      loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
      document.body.appendChild(loadingOverlay);

    try {
      const response = await fetch(
        `https://notes-api.dicoding.dev/v2/notes/${noteId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Gagal menghapus catatan");

      this.showAlert("Catatan berhasil dihapus", "success");
      document.dispatchEvent(new Event("noteUpdated"));
    } catch (error) {
      console.error("Error:", error);
      this.showAlert("Gagal menghapus catatan", "error");
    } finally{
      // Sembunyikan loading indicator
    loadingOverlay.remove();
    }
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

  createNoteElement(note) {
    return `
      <div class="note">
        <h2>${note.title}</h2>
        <p>${note.body}</p>
        <div class="note-footer">
          <small>${new Date(note.createdAt).toLocaleString()}</small>
          <div class="note-actions">
            <button class="archive-btn" data-id="${note.id}" data-archived="${
      note.archived
    }">
              ${note.archived ? "Aktifkan" : "Arsipkan"}
            </button>
            <button class="delete-btn" data-id="${note.id}">Hapus</button>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const notes = this.notes
      .map((note) => this.createNoteElement(note))
      .join("");
    this.shadowRoot.innerHTML = `
      <style>
       
        .notes-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          padding: 16px;
        }

        .note {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 16px;
          background-color: #FDF7E3;
          box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }

        .note h2 {
          margin: 0 0 8px;
        }

        .note p {
          margin: 0;
          flex-grow: 1;
        }

        .note-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
        }

        .note small {
          font-size: 12px;
          color: gray;
        }

        .delete-btn {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: 0.3s;
        }

        .delete-btn:hover {
          background-color: #d32f2f;
        }

        .note-actions {
          display: flex;
          gap: 8px;
        }
        
        .archive-btn {
          background-color: ${this.showArchived ? "#4CAF50" : "#FFC107"};
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: 0.3s;
        }
        
        .archive-btn:hover {
          background-color: ${this.showArchived ? "#388E3C" : "#FFA000"};
        }
        
        .toggle-archive {
          margin: 16px;
          padding: 8px 16px;
          background-color: #2196F3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
          .toggle-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
          margin-bottom: 16px;
        }
        
        .toggle-title {
          font-weight: bold;
          color: #333;
        }
        
        .toggle-btn {
          padding: 8px 16px;
          background-color: ${this.showArchived ? "#4CAF50" : "#2196F3"};
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .toggle-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }
           .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .loading-spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

        @media (max-width: 480px) {
          .notes-container {
            grid-template-columns: repeat(1, 1fr);
          }
        }
      </style>

    <div class="toggle-container">
        <div class="toggle-title">
          ${this.showArchived ? "Catatan Terarsip" : "Catatan Aktif"}
        </div>
        <button class="toggle-btn">
          ${
            this.showArchived
              ? this.toggleTexts.archived
              : this.toggleTexts.active
          }
        </button>
      </div>

      <div class="notes-container">
        ${notes}
      </div>
    `;

    // Event listener untuk toggle button
    this.shadowRoot
      .querySelector(".toggle-btn")
      .addEventListener("click", async () => {
        this.showArchived = !this.showArchived;
        await this.fetchNotes();

        // Scroll ke atas setelah toggle
        this.scrollIntoView({ behavior: "smooth" });
      });

    // Event listener untuk tombol arsip/aktifkan
    this.shadowRoot.querySelectorAll(".archive-btn").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const noteId = e.target.dataset.id;
        const isArchived = e.target.dataset.archived === "true";

        // Tampilkan konfirmasi
        const confirmMessage = isArchived
          ? "Aktifkan catatan ini?"
          : "Arsipkan catatan ini?";

        if (confirm(confirmMessage)) {
          // Tampilkan loading state
          e.target.disabled = true;
          e.target.textContent = isArchived
            ? "Mengaktifkan..."
            : "Mengarsipkan...";

          await this.toggleArchive(noteId, isArchived);

          // Reset button state
          e.target.disabled = false;
        }
      });
    });

    // Tambahkan event listener untuk tombol hapus
    this.shadowRoot.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const noteId = e.target.getAttribute("data-id");
        if (confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
          this.deleteNote(noteId);
        }
      });
    });
  }

  
}
// Daftarkan custom element
//terattab
//ygfsgs
customElements.define("note-list", NoteList);
