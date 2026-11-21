# Baloyi Nwayitelo | Developer Portfolio

Personal portfolio of Baloyi Nwayitelo, a Computer Science diploma student at Tshwane University of Technology. It presents my skills, projects, education, certificates and CV, and gives employers a way to get in touch about internships and Work Integrated Learning (WIL) placements.

**Live site:** <https://baloyi2.github.io/my-portfolio/>

## Contents

- [Features](#features)
- [Built with](#built-with)
- [Project structure](#project-structure)
- [Running locally](#running-locally)
- [Updating the content](#updating-the-content)
- [Contact form](#contact-form)
- [Deployment](#deployment)
- [Privacy](#privacy)
- [Credits](#credits)

## Features

- Single page with sections for About, Skills, Projects, Education, Certificates, CV and Contact.
- Light and dark themes. The site follows the visitor's system setting until they choose a theme, and remembers that choice.
- Responsive layout for phones, tablets and desktops, with a collapsible menu on small screens.
- Accessible markup: skip link, labelled landmarks and form fields, visible keyboard focus, and reduced motion for visitors who ask for it.
- Page title, description and social sharing tags for search engines and link previews.

## Built with

- HTML5, CSS3 and vanilla JavaScript
- [Manrope](https://github.com/googlefonts/manrope), stored in the repository so no font service is contacted

There are no frameworks, packages or build steps. The files in the repository are the files that are published.

## Project structure

```text
.
├── index.html                  # The portfolio page
├── css/
│   └── styles.css              # Layout, components and both colour themes
├── js/
│   ├── theme.js                # Applies the saved theme before the page is drawn
│   └── main.js                 # Theme toggle, mobile menu, contact form, footer year
├── assets/
│   ├── fonts/manrope/          # Font file and its licence
│   ├── images/                 # Favicon and other images
│   ├── cv/                     # CV in PDF format (create when adding the CV)
│   └── certificates/           # Certificate files (create when adding certificates)
├── .nojekyll                   # Tells GitHub Pages to publish the files as they are
└── .gitignore
```

## Running locally

The site is published at `/my-portfolio/` rather than at the root of the domain. To preview it the same way, serve the folder that contains the repository and open the repository's path:

```bash
# Run from the folder that contains my-portfolio
python -m http.server 8000
```

Then open <http://localhost:8000/my-portfolio/>.

Any asset that loads locally but breaks online usually has a path starting with `/`. Keep all paths relative, for example `css/styles.css`.

## Updating the content

Details that still need to be filled in are marked with `[ADD: ...]` or `ADD-YOUR-...` and are highlighted on the page. Search `index.html` for `ADD` to find them, replace the text, and remove the `placeholder` class from that element.

| Content | Where |
|---|---|
| CV | Save the PDF as `assets/cv/baloyi-nwayitelo-cv.pdf` |
| Certificates | Save files in `assets/certificates/` and list each one in the Certificates section of `index.html` |
| LinkedIn | Replace `ADD-YOUR-LINKEDIN-USERNAME` in `index.html` |
| Contact email | Replace `ADD-YOUR-EMAIL@example.com` in `index.html`, including the form's `data-recipient` attribute |
| Projects | Edit the `<article class="project">` blocks in the Projects section |

GitHub Pages treats `CV.pdf` and `cv.pdf` as different files, so use lowercase file names and match them exactly in links.

## Contact form

GitHub Pages only serves static files, so the form cannot send email or store messages by itself. When a visitor submits it, the form checks the input and opens the visitor's email app with the message addressed and ready to send. The page explains this next to the form.

Sending messages straight from the page would need either a form-handling service or a separately hosted backend that sends the email.

## Deployment

GitHub Pages publishes the `main` branch from the repository root. Every push to `main` updates the live site within a few minutes, so fill in the placeholders before pushing.

## Privacy

Everything in this repository is public, including files that are later deleted, because they stay in the Git history.

- Before uploading a CV, remove your ID number, home address and date of birth.
- Blur or remove student and ID numbers on certificates, or link to the issuer's verification page instead.
- The site has no secrets and needs no environment file. `.env` files are excluded by `.gitignore` and must never be committed.

## Credits

Manrope is used under the [SIL Open Font License 1.1](assets/fonts/manrope/OFL.txt).
