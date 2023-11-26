document.addEventListener('DOMContentLoaded', (event) => {
    const cardContainer = document.getElementById("cardContainer");
    const htmlFolder = "days";
    let baseURL = ''; // Default empty base URL

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      baseURL = 'http://localhost:5173/';
    } else if (window.location.hostname === '100-days-of-vanilla.netlify.app') {
      baseURL = 'https://100-days-of-vanilla.netlify.app/';
    } else {
     
    }

    function createProjectCard(day, title, description, name) {
        const card = document.createElement('div');
        card.classList.add('card');
        const icon = document.createElement('div');

        icon.classList.add('icon');
        icon.textContent = `${day}`;

        const cardTitle = document.createElement('div');
        cardTitle.classList.add('title');
        cardTitle.textContent = title;
        cardTitle.addEventListener('click', function () {
            window.location.assign(`./${htmlFolder}/day${day}/day${day}.html`);

        })
        // Conditionally add a different class based on the value of fileTitle
        if (title === 'Coming soon') {
            card.classList.add('coming-soon');
        }


        const cardText = document.createElement('div');
        cardText.classList.add('text');
        cardText.textContent = description;

        card.appendChild(icon);
        card.appendChild(cardTitle);
        card.appendChild(cardText);
        return card;
    }

    async function fetchProjectDays() {
        const htmlFiles = [];
        let i = 1;

        while (i <= 2) {
            try {
                const response = await fetch(`${baseURL}/${htmlFolder}/day${i}/day${i}.html`);
                if (!response.ok) {
                    break;
                }
                const htmlContent = await response.text();
                const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
                const descriptionMatch = htmlContent?.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']\s*\/?>/i);

                // For empty projects
                const fileTitle = titleMatch ? titleMatch[1] : 'Coming soon';
                const fileDescription = descriptionMatch ? descriptionMatch[1] : ' ';
                htmlFiles.push({ name: `day${i}.html`, fileTitle, fileDescription });
                i++;
            } catch (error) {
                console.error(error);
                break;
            }
        }

        return htmlFiles;
    }
    fetchProjectDays("days").then((htmlFiles) => {
        htmlFiles.forEach((file, index) => {
            const card = createProjectCard(index + 1, file.fileTitle, file.fileDescription, file.name);
            cardContainer.appendChild(card);
        });
    })
});