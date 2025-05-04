class Footer extends HTMLElement {
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
            .footer {
                display: flex;
                justify-content: center; /* Pusatkan secara horizontal */
                align-items: center; /* Pusatkan secara vertikal */
                background-color: #4A5A48;
                color: white;
                text-align: center;
                padding: 20px;
                font-size: 14px;
                bottom: 0;
                width: 100%;
                height: 40px;
            }

            .footer div {
                padding: 10px;
            }

            .footer a {
                color: white;
                text-decoration: none;
            }

            .footer a:hover {
                text-decoration: underline;
            }
        </style>

        <div class="footer">
            <div class="about">
                <strong>Note App</strong><br>
            </div>
        </div>
        `;
  }
}

// Mendefinisikan custom element <custom-footer>
customElements.define("custom-footer", Footer);
