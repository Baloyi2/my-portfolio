# Baloyi Nwayitelo | Developer Portfolio

Personal portfolio of Baloyi Nwayitelo, an aspiring Software Developer and Computer Science diploma student at Tshwane University of Technology. It presents my practical development experience, projects, skills and education, and gives employers a way to get in touch about junior developer opportunities and software development internships.

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

- Hero with my name, role, introduction, calls to action, availability, my photo and credential cards.
- Numbered sections: About, Practical Software Development Experience, Skills, Projects, Education, Certifications, Focus and Contact.
- Experience timeline that labels which parts of a team project I built myself, which I built with the team, and what is still in progress.
- Skill cards grouped by area, including the tools I use, each listing only technologies used in my project work.
- Project cards with a category, my contribution, technologies, expandable details and a "Request details" email button.
- Education with relevant coursework, and a Certifications section that stays empty until a certificate is earned.
- Contact form (name, email, subject, message) that opens the visitor's email app, next to email, phone, location and GitHub cards.
- Navigation that highlights the section on screen, a "Download CV" button in the header, and a back-to-top button.
- Typing effect in the hero, sections and cards that fade in while scrolling, a purple glow that follows the pointer over cards, and a reading-progress bar under the header.
- An animated network of purple dots behind the hero, a circular ripple when the theme changes, and project cards that tilt slightly under the mouse.
- Installable app that also works offline: visitors can add the portfolio to their phone or computer, and after the first visit it opens without internet.
- Every animation is skipped for visitors who turn off motion, and all content still shows with JavaScript turned off.
- Light and dark themes in forest green, sand beige and a touch of electric purple. The site follows the visitor's system setting until they choose a theme, and remembers that choice.
- Layouts for phones, tablets and desktops, with large tap targets and a collapsible menu on small screens.
- Accessible markup: skip link, labelled landmarks and form fields, visible keyboard focus, colour contrast that meets WCAG AA, and reduced motion for visitors who ask for it.

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
│   └── main.js                 # Theme toggle, mobile menu, active link, contact form, back to top, footer year
├── assets/
│   ├── fonts/manrope/          # Font file and its licence
│   ├── images/                 # Favicon, and app icons in images/icons/
│   └── cv/                     # CV in PDF format (create when adding the CV)
├── manifest.webmanifest        # Makes the site installable as an app
├── sw.js                       # Service worker for offline use
├── .nojekyll                   # Tells GitHub Pages to publish the files as they are
└── .gitignore
```

## Running locally

The site is published at `/my-portfolio/` rather than at the root of the domain. To preview it the same way, serve the folder that contains the repository and open the repository's path:

```bash
# Run from the folder that contains my-portfolio
python -m http.server 8000
```

Then open <http://localhost:8000/my-portfolio/>. VS Code's Live Server extension also works.

Any asset that loads locally but breaks online usually has a path starting with `/`. Keep all paths relative, for example `css/styles.css`.

The service worker (`sw.js`) always loads the latest files when you are online, so your edits show up straight away. If you rename or add files that the site needs offline, add them to the `PRECACHE` list in `sw.js` and change the version in `CACHE` (for example `baloyi-portfolio-v2`).

## Updating the content

| Content | How to update it |
|---|---|
| CV | The CV is `assets/cv/Nwayitelo_Baloyi_CV.pdf` and is linked from the header, menu, hero and footer. To update it, replace the file and keep the same name (GitHub Pages treats upper and lower case as different). |
| Project screenshots | Save images in `assets/images/projects/`, for example `tender-scrapper.webp`. Add an `<img>` at the top of the project's `<article>` with `alt`, `width`, `height` and `loading="lazy"` attributes. |
| Profile photo | Replace `assets/images/me.jpeg` with a new photo of the same name. If its size changes, update the `width` and `height` on the hero `<img>` in `index.html`. |
| LinkedIn | The profile URL appears in the hero links, the contact cards and the footer links in `index.html`. Update all three if it changes. |
| Contact email | Change the email links and the form's `data-recipient` attribute in `index.html`. |
| Experience and projects | Edit the `timeline-card` and `project` blocks. Use `badge-mine` for parts I built, `badge-team` for team work and `badge-progress` for work in progress. List only features that are finished as finished. |
| Certificates | There is no certificates section yet. Add one when a certificate is earned, and link to the issuer's verification page where possible. |

GitHub Pages treats `CV.pdf` and `cv.pdf` as different files, so use lowercase file names and match them exactly in links.

## Contact form

GitHub Pages only serves static files, so the form cannot send email or store messages by itself. When a visitor submits it, the form checks the input and opens the visitor's email app with the message addressed and ready to send. The page explains this next to the form.

Sending messages straight from the page would need either a form-handling service or a separately hosted backend that sends the email.

## Deployment

GitHub Pages publishes the `main` branch from the repository root. Every push to `main` updates the live site within a few minutes.

## Privacy

Everything in this repository is public, including files that are later deleted, because they stay in the Git history.

- Before uploading a CV, remove your ID number, home address and date of birth.
- Blur or remove student and ID numbers on any certificate, or link to the issuer's verification page instead.
- The site has no secrets and needs no environment file. `.env` files are excluded by `.gitignore` and must never be committed.

## Credits

Manrope is used under the [SIL Open Font License 1.1](assets/fonts/manrope/OFL.txt).
