# Lalit More — Portfolio

A fast, static, LEGO-themed portfolio.
No build step. No framework. No server. No API keys. **Completely free to run and update forever.**

```
portfolio/
├── index.html        ← structure + styles (rarely touched)
├── render.js         ← turns content into the page  (don't edit)
├── content.js        ← ★ YOUR CONTENT — the only file you normally edit
├── sync_resume.py    ← scans a résumé and rewrites content.js automatically
├── requirements.txt  ← Python deps for the sync script (free packages)
└── .gitignore
```

---

## 1. Deploy for free on GitHub Pages

GitHub Pages hosts static sites at no cost — free HTTPS, free subdomain, optional custom domain.

1. Create a free account at https://github.com and make a **public** repository.
   Name it `your-username.github.io` for the cleanest URL.
2. Upload `index.html`, `render.js`, `content.js`, and (optionally) `resume.pdf`.
   Drag-and-drop works via *Add file → Upload files*.
3. Go to **Settings → Pages**, set Source to the `main` branch / root folder, click Save.
4. Wait ~1 minute. Your site is live at `https://your-username.github.io`.

To preview locally before uploading, run one command in the project folder:

```bash
python -m http.server 8000
```

Then open http://localhost:8000. (Opening index.html by double-click also works
because content.js loads as a regular `<script>` tag, not a network fetch.)

**The only optional cost** is a custom domain like `lalitmore.dev` — about $10–15/year.
Add it under *Settings → Pages → Custom domain*. Everything else is $0 forever.

---

## 2. Update by hand (30 seconds)

Open `content.js` and change the values. It's just data:

- New job/role → edit `"role"`, `"tagline"`, and `"about"`.
- New project → copy a block in `"projects"` and fill it in.
- New skill → add a string to the right `"items"` list.
- Wrap words in `**double asterisks**` to bold them in about paragraphs.

```bash
git add content.js
git commit -m "Add new project"
git push
```
GitHub Pages redeploys automatically within a minute.

---

## 3. Update automatically from your résumé (free, local)

The sync script reads your résumé, extracts changed info, and rewrites `content.js`.
No internet connection. No API. No cost. Runs entirely on your laptop.

**One-time setup:**

```bash
pip install -r requirements.txt
```

**Each time your résumé changes:**

```bash
# See what the script extracted before touching anything
python sync_resume.py resume.pdf --report

# Preview the proposed changes
python sync_resume.py resume.pdf --dry-run

# Apply the changes
python sync_resume.py resume.pdf

# Review what changed, then push
git diff content.js
git add content.js && git commit -m "Sync resume" && git push
```

The script uses heuristic parsing (regex + section detection) to extract your
name, location, GPA, graduation date, skills, and projects. It preserves your
existing project links, colors, and set numbers when it recognises a project.

**Tip:** If the script can't find a section, check that your résumé uses standard
section headers like *PROJECTS*, *SKILLS*, *EDUCATION*, *EXPERIENCE*. If
your résumé has unusual formatting, edit `content.js` by hand for that item — it
takes under a minute.

---

## Cost summary

| Thing | Cost |
|---|---|
| GitHub Pages hosting | **$0** |
| HTTPS / SSL | **$0** |
| Resume sync (runs locally) | **$0** |
| Custom domain (optional) | ~$10–15/yr |

---

## Good practices baked in

- Content is separated from presentation — updates are one-file edits.
- All dynamic text uses `textContent`, not raw HTML — XSS-safe by construction.
- External links use `rel="noopener noreferrer"`.
- Accessible: skip-link, ARIA labels, keyboard focus styles, `prefers-reduced-motion` support.
- Secrets: there are none. The site is 100% static HTML/JS/CSS with no server-side code.
