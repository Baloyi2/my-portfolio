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

- A forest-green hero with my name, title, availability, introduction, "View My Projects" and "Download My CV" buttons, and a profile card with my photo (shown in full) and two key facts.
- Sections for About, Practical Software Development Experience, Skills, Projects, Education, Certifications, career focus and Contact.
- Experience shown side by side as "Built by me" and "Team contribution", with a separate "In progress" note, so each part of the team project is clearly labelled.
- Skills in one panel divided into six areas, each listing only technologies used in my project work.
- A project card with its category, status labels, my contribution, technologies, expandable details and a "Request details" email button, with room for a real screenshot.
- Education with relevant coursework, and a Certifications section that stays empty until a certificate is earned.
- Contact form (name, email, subject, message) that opens the visitor's email app, next to email, phone, location, GitHub and LinkedIn details.
- Sticky navigation that marks the section on screen, a "Download CV" button, a drop-down menu on phones and tablets, a reading-progress line and a back-to-top button.
- Light and dark themes in forest green, sand beige and a touch of electric purple. The site follows the visitor's system setting until they choose a theme, and remembers that choice.
- Calm motion: a short entrance for the hero, smooth scrolling, a quick fade when the theme changes and subtle hover states. Visitors who turn off motion see no animation at all.
- Installable app that also works offline after the first visit.
- Layouts tested from 320px phones to 2560px monitors, with large tap targets.
- Accessible markup: skip link, labelled landmarks and form fields, visible keyboard focus, focus kept clear of the sticky header, and colour contrast that meets WCAG 2.2 AA.

## Design system

All colours, sizes and corner radii are CSS custom properties at the top of `css/styles.css`, with a second set for the dark theme.

| Role | Light | Dark |
|---|---|---|
| Primary (buttons, hero, key lines) | Forest green `#1f3d2b` | Sand `#e8dcc4` on dark green |
| Neutral (page, bands, tags) | Sand-tinted `#faf7f1`, `#f2ece0`, `#f3eee3` | `#0f1d15`, `#122219`, `#1b3024` |
| Accent (used sparingly) | Electric purple `#8b5cf6` | `#a98bfa` |

Purple is kept for focus rings, the current-section line in the navigation, the reading-progress line and the "Team contribution" label. Type is Manrope throughout, with weights from 450 (body) to 800 (headings). Corner radii are 6px for tags, 10px for buttons and fields, 14px for inner panels and 20px for cards.

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
│   └── main.js                 # Theme toggle, mobile menu, active link, contact form, scroll effects, back to top, footer year
├── assets/
│   ├── fonts/manrope/          # Font file and its licence
│   ├── images/                 # Favicon, and app icons in images/icons/
│   └── cv/                     # CV in PDF format
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

The service worker (`sw.js`) always loads the latest files when you are online, so your edits show up straight away. If you rename or add files that the site needs offline, add them to the `PRECACHE` list in `sw.js` and change the version in `CACHE` (for example from `baloyi-portfolio-v3` to `baloyi-portfolio-v4`).

## Updating the content

| Content | How to update it |
|---|---|
| CV | The CV is `assets/cv/Nwayitelo_Baloyi_CV.pdf` and is linked from the header, menu, hero and footer. To update it, replace the file and keep the same name (GitHub Pages treats upper and lower case as different). |
| Project screenshots | Save real screenshots in `assets/images/projects/`, for example `tender-scrapper.png`. The project card in `index.html` has a comment with a ready-made `<figure class="project-media">` block: paste it at the top of the card and set the `src`, `alt`, `width` and `height`. The image is shown at 16:9 from the top. |
| Profile photo | Replace `assets/images/me.jpeg` with a new photo of the same name. If its size changes, update the `width` and `height` on the hero `<img>` in `index.html`. |
| LinkedIn | The profile URL appears in the hero links, the contact cards and the footer links in `index.html`. Update all three if it changes. |
| Contact email | Change the email links and the form's `data-recipient` attribute in `index.html`. |
| Experience and projects | Edit the `role-card` and `project` blocks. Put my own work in the `work-group-mine` list, team work in `work-group-team`, and unfinished work in the `role-status` note. Use `badge-mine`, `badge-team` and `badge-progress` for labels. List only features that are finished as finished. |
| Certificates | The Certifications section shows an empty state until a certificate is earned. Replace the `empty-state` block with the certificate's name, issuer and date, and link to the issuer's verification page where possible. |

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
