const template = document.createElement('template');
template.innerHTML = `
    <style>
        img {
            width: 280px;
            border-radius: 5px;
            margin-bottom: -15px;
        }

        button {
            width: 97%;
            height: 35px;
            cursor: pointer;
            background-color: #2a7a46;
            color: white;
            margin-bottom: 4px;
            border: none;
            border-radius: 3px;
            font-family: Outfit;
            font-size: 11pt;
            font-weight: 200;
            text-align: center;
        }

        button:hover {
            background-color: rgb(14, 66, 14);
            transition: 0.2s background-color ease-in-out;
        }

        h4 {
            color: #343434;
            padding-left: 10px;
            padding-right: 10px;
            margin-bottom: -8px;
            font-weight: 700;
            text-align: left;
            font-size: 10pt;
            white-space: wrap;
        }

        p {
            color: #505050;
            padding-left: 10px;
            margin-bottom: 35px;
            font-weight: 300;
            font-size: 9pt;
            text-align: left;
        }

        .recipe-card {
            cursor: pointer;
            font-family: Outfit;
            text-align: center;
            margin: 0.5rem;
            border-radius: 5px;
            box-shadow: 1px 1px 10px 1px #888888;
        }

        .recipe-card:hover {
            box-shadow: 2px 2px 10px 2px #888888;
            transition: 0.2s box-shadow ease-in-out;
        }

        @media screen and (max-width: 950px) {
            img {
                width: 100%;
                height: auto;
            }

            .recipe-card {
                max-width: 430px;
                min-width: 350px;
                margin-bottom: 35px;
            }
        }
    </style>

    <div class="recipe-card" onclick="navigateToHelloFresh()">
        <img>
        <h4></h4>
        <p></p>
        <button type="submit" onclick="navigateToHelloFresh()">
    </div>
`;

// Decided not to place the styling in an external stylesheet and import using <link>, since it
// generated momentary flashing of unstyled components upon reload (while the styles were being loaded).

const navigateToHelloFresh = () => {
    window.location.href = "https://hellofresh.de";
}

class RecipeCard extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.shadowRoot.querySelector('img').src = this.getAttribute('recipeImage');
        this.shadowRoot.querySelector('h4').innerText = this.getAttribute('recipeName');
        this.shadowRoot.querySelector('p').innerText = this.getAttribute('recipeHeadline');
        this.shadowRoot.querySelector('button').innerText = this.getAttribute('buttonName');
    }
}

window.customElements.define('recipe-card', RecipeCard);
