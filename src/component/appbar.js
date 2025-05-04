class AppBAr extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
         <style>
        .navbar {
          background: #4A5A48;
          color: white;
          padding: 15px;
          text-align: center;
          font-size: 20px;
        }</style>

        <div class="appbar">
            <h1 class="noteapp">NoteApp</h1>
        </div>
        `;
  }
}

customElements.define("app-bar", AppBAr);
//rgaaefaeare
