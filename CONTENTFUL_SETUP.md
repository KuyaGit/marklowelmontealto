# Contentful Setup Guide

This document covers everything needed to set up Contentful for this portfolio site — from creating the space and API keys to building each content model and re-entering all the original portfolio data.

> **Field IDs must match exactly.** The fetchers in `lib/contentful.ts` map Contentful fields by their Field ID (camelCase). A mismatched ID silently returns an empty value.

---

## 1. Create the Space and API Keys

1. Go to [contentful.com](https://contentful.com) → **Create space** → name it `marklowelmontealto-portfolio`.
2. **Settings → API keys → Add API key**.  
   Copy these three values — you'll need them below:
   - **Space ID**
   - **Content Delivery API access token** (the CDA token — for published content)
   - **Environment** (use `master`)

---

## 2. Configure Environment Variables

### Local development — `.env`

Create `.env` (git-ignored) in the project root:

```
CONTENTFUL_SPACE_ID=<your space id>
CONTENTFUL_ACCESS_TOKEN=<your CDA token>
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_REVALIDATE_SECRET=<random string, e.g. openssl rand -hex 32>
```

Next.js loads `.env` automatically for `next dev` and `next build`. You can also use `.env.local` for values you don't want in `.env`.

### Production (Docker / Coolify)

Pass the same vars at container runtime — see `DOCKER_DEPLOY.md` for the full `docker run -e` and Docker Compose setup. The key variables are:

| Variable | Required at runtime |
|---|---|
| `CONTENTFUL_SPACE_ID` | ✓ (ISR revalidation) |
| `CONTENTFUL_ACCESS_TOKEN` | ✓ (ISR revalidation) |
| `CONTENTFUL_ENVIRONMENT` | optional (default: `master`) |
| `CONTENTFUL_REVALIDATE_SECRET` | ✓ (webhook auth) |

---

## 3. Configure the Revalidation Webhook

After deploying the site, add the webhook in **Contentful → Settings → Webhooks → Add webhook**:

| Setting | Value |
|---|---|
| Name | `Revalidate Portfolio` |
| URL | `https://marklowelmontealto.com/api/revalidate` |
| Method | `POST` |
| Triggers | Entry **Publish**, Entry **Unpublish**, Asset **Publish**, Asset **Unpublish** |
| Custom header | `x-revalidate-secret: <your CONTENTFUL_REVALIDATE_SECRET>` |

---

## 5. Content Models

Create these in **Contentful → Content model → Add content type**. The **Content type ID** (the API identifier, set when creating) must match the values shown. Field IDs are set in the field settings panel.

---

### `profile` — Singleton (create exactly one entry)

**Content type ID:** `profile`

| Field ID | Display name | Type | Required | Notes |
|---|---|---|---|---|
| `name` | Name | Short text | ✓ | Set as entry title |
| `role` | Role | Short text | | |
| `dateLine` | Date line | Short text | | e.g. "Updated June 2026" |
| `intro` | Intro | Long text | | Opening bio paragraph |
| `bioCommunity` | Bio (community) | Long text | | Continuation of the bio — community lead sentence, closing goals paragraph |
| `location` | Location | Short text | | |
| `email` | Email | Short text | | |
| `avatar` | Avatar | Media (one file) | | Profile photo |
| `resume` | Resume | Media (one file) | | PDF asset |
| `social` | Social links | JSON object | | See exact shape below — now includes `github` |
| `skills` | Skills | Short text, list | | One item per skill group — format: `"Category: item1, item2"` |
| `knowsAbout` | Knows about | Short text, list | | Topics for JSON-LD `Person.knowsAbout` |
| `worksForOrg` | Works for (org) | Short text | | Current employer name — JSON-LD `Person.worksFor` |
| `communityOrg` | Community org | Short text | | Community organisation name — JSON-LD `Person.memberOf` |
| `communityOrgUrl` | Community org URL | Short text | | Community organisation URL |

**`social` JSON shape** — paste this as the JSON object value:
```json
{
  "facebook": "https://www.facebook.com/marklowelmontealto",
  "linkedin": "https://www.linkedin.com/in/marklowelmontealto",
  "github": "https://github.com/marklowelmontealto",
  "onlinejobs": "https://www.onlinejobs.ph/jobseekers/info/3887338",
  "upwork": "https://www.upwork.com/freelancers/marklowelmontealto",
  "youtube": "https://www.youtube.com/@kuyagit"
}
```

---

### `blogPost` — Blog posts

**Content type ID:** `blogPost`

| Field ID | Display name | Type | Required | Notes |
|---|---|---|---|---|
| `title` | Title | Short text | ✓ | Entry title |
| `slug` | Slug | Short text | ✓ | Unique · pattern `^[a-z0-9-]+$` |
| `excerpt` | Excerpt | Long text | | |
| `date` | Date | Date & time | ✓ | ISO date |
| `body` | Body | **Rich text** | | Full article content |
| `coverImage` | Cover image | Media (image) | | |
| `isFeatured` | Featured | Boolean | | Default: `false` |

---

### `project` — Projects

**Content type ID:** `project`

| Field ID | Display name | Type | Required | Notes |
|---|---|---|---|---|
| `name` | Name | Short text | ✓ | Entry title |
| `slug` | Slug | Short text | ✓ | Unique |
| `description` | Description | Long text | | |
| `liveUrl` | Live URL | Short text | | |
| `techStack` | Tech stack | Short text, list | | Accepted values: `angular` `react` `nextjs` `typescript` `javascript` `nodejs` `nestjs` `tailwind` `aws` `docker` `postgresql` `mysql` |
| `image` | Image | Media (image) | | |
| `isFeatured` | Featured | Boolean | | Default: `false` |

---

### `work` — Work experience

**Content type ID:** `work`

| Field ID | Display name | Type | Required | Notes |
|---|---|---|---|---|
| `title` | Title | Short text | ✓ | Entry title |
| `slug` | Slug | Short text | ✓ | Unique |
| `company` | Company | Short text | ✓ | |
| `period` | Period | Short text | | Free text e.g. "February 2025 – Present" |
| `description` | Description | Long text | | |
| `order` | Order | Integer | | Controls display sort (1 = most recent) |
| `image` | Image | Media (image) | | |
| `isFeatured` | Featured | Boolean | | Default: `false` — use for current role |

---

### `certificate` — Certificates

**Content type ID:** `certificate`

| Field ID | Display name | Type | Required | Notes |
|---|---|---|---|---|
| `title` | Title | Short text | ✓ | Entry title |
| `slug` | Slug | Short text | ✓ | Unique — needed as React key (old data used title) |
| `issuer` | Issuer | Short text | ✓ | |
| `date` | Date | Short text | | Year string e.g. "2024" |
| `description` | Description | Long text | | |
| `image` | Image | Media (image) | | Certificate badge or thumbnail |
| `verifiedUrl` | Verified URL | Short text | | Link to verify the certificate on the issuer's site |
| `isFeatured` | Featured | Boolean | | Default: `false` |
| `credentialId` | Credential ID | Short text | | Issuer-provided credential or license number (e.g. `ABC-1234-XYZ`) |
| `skills` | Skills | Short text | | Comma-separated list of skills, e.g. `AWS, Cloud Security, Terraform` |

---

## 6. Original Portfolio Data

Enter the entries below and **Publish** each. The site only fetches published content.

---

### Profile (1 entry)

| Field ID | Value |
|---|---|
| `name` | Mark Lowel Montealto |
| `role` | Full Stack Developer & DevOps Engineer |
| `dateLine` | Updated June 2026 |
| `intro` | Full Stack Developer and DevOps Engineer based in Manila, Philippines with 4+ years of experience building scalable web applications and cloud-native infrastructure. Specializing in Angular, TypeScript, AWS, and CI/CD automation. |
| `bioCommunity` | I'm also the Community Lead of Angular Philippines, where I help developers grow through knowledge sharing, mentorship, and community initiatives. My goal is to leverage software engineering, cloud technologies, and DevOps practices to build scalable, reliable, and impactful solutions. |
| `location` | Manila, Philippines |
| `email` | montealtomarklowel@gmail.com |
| `avatar` | *(upload `public/profile.JPG` as a Contentful asset)* |
| `resume` | *(upload `public/assets/MarkLowelMontealto.pdf` as a Contentful asset)* |
| `social` | *(see JSON below)* |
| `skills` | *(see list below)* |
| `knowsAbout` | *(see list below)* |
| `worksForOrg` | Whitecloak Technologies, Inc. |
| `communityOrg` | Angular Philippines |
| `communityOrgUrl` | https://www.facebook.com/angularphilippines |

**`social` JSON:**
```json
{
  "facebook": "https://www.facebook.com/marklowelmontealto",
  "linkedin": "https://www.linkedin.com/in/marklowelmontealto",
  "github": "https://github.com/marklowelmontealto",
  "onlinejobs": "https://www.onlinejobs.ph/jobseekers/info/3887338",
  "upwork": "https://www.upwork.com/freelancers/marklowelmontealto",
  "youtube": "https://www.youtube.com/@kuyagit"
}
```

**`skills` list** — add each line as a separate list item:
```
Frontend: Angular, TypeScript, JavaScript, HTML5 / CSS3, Tailwind CSS, Angular Material
Backend: Node.js, NestJS, PHP, REST APIs
Cloud & DevOps: Amazon Web Services, CI/CD Pipelines, GitHub Actions, GitLab CI/CD, Docker, Infrastructure Automation
Database: MySQL, PostgreSQL, SQLite
Testing & Tools: Cypress, Git, Postman, Jira
```

**`knowsAbout` list** — add each line as a separate list item:
```
Angular
TypeScript
JavaScript
Node.js
NestJS
Amazon Web Services
CI/CD Pipelines
DevOps
Docker
PostgreSQL
Full Stack Development
```

---

### Blog Posts (3 entries)

> **Date field note:** The original data used free-text month/year strings. The Contentful field is `Date & time` — use the 1st of each month as the date value. The site formats it back to "Month YYYY" on display.

#### Post 1 — Featured

| Field ID | Value |
|---|---|
| `slug` | `cicd-github-actions` |
| `title` | Building CI/CD Pipelines with GitHub Actions |
| `excerpt` | A practical guide to automating deployments with GitHub Actions — from environment setup and secrets management to multi-stage pipelines that cut deployment time by 40%. |
| `date` | `2026-05-01` |
| `body` | *(write the full article in the Rich text editor — was "Full article coming soon." placeholder)* |
| `isFeatured` | `true` |

#### Post 2

| Field ID | Value |
|---|---|
| `slug` | `angular-nestjs-scalable-apps` |
| `title` | Scalable Full Stack Apps with Angular and NestJS |
| `excerpt` | How Angular and NestJS share TypeScript types end-to-end, enabling a single source of truth for your data models and dramatically reducing runtime errors. |
| `date` | `2026-03-01` |
| `body` | *(write article content)* |
| `isFeatured` | `false` |

#### Post 3

| Field ID | Value |
|---|---|
| `slug` | `aws-cloud-architecture-web-devs` |
| `title` | AWS Cloud Architecture Patterns for Web Developers |
| `excerpt` | Practical AWS patterns — Lambda, S3, CloudFront, RDS — that every web developer should know to build cost-effective, highly available applications. |
| `date` | `2026-01-01` |
| `body` | *(write article content)* |
| `isFeatured` | `false` |

---

### Projects (3 entries)

> **Image note:** All original images were empty (`""`). The ProjectCard renders an SVG placeholder when no image is set. Upload screenshots later or leave the image field empty for now.

#### Project 1 — Featured

| Field ID | Value |
|---|---|
| `slug` | `devops-dashboard` |
| `name` | DevOps Monitoring Dashboard |
| `description` | Real-time cloud infrastructure monitoring with alerting and cost analytics. |
| `liveUrl` | `https://marklowelmontealto.com` |
| `techStack` | `angular`, `typescript`, `aws`, `docker`, `nestjs` |
| `isFeatured` | `true` |

#### Project 2

| Field ID | Value |
|---|---|
| `slug` | `inspection-app` |
| `name` | Outdoor Inspection System |
| `description` | Field inspection management with Google Maps integration and route planning. |
| `liveUrl` | `https://marklowelmontealto.com` |
| `techStack` | `angular`, `typescript`, `nodejs`, `postgresql` |
| `isFeatured` | `false` |

#### Project 3

| Field ID | Value |
|---|---|
| `slug` | `portfolio-site` |
| `name` | Developer Portfolio |
| `description` | SSR portfolio built with Next.js — fully optimised for SEO and Core Web Vitals. |
| `liveUrl` | `https://kuyagit.github.io/marklowelmontealto` |
| `techStack` | `nextjs`, `react`, `typescript`, `tailwind` |
| `isFeatured` | `false` |

---

### Works (6 entries)

> **`order` field:** Sets the display sort order. Set `isFeatured: true` only for the current role — the UI renders it as a "Current" badge.

#### Work 1 — Featured (current role)

| Field ID | Value |
|---|---|
| `slug` | `devops-whitecloak` |
| `title` | DevOps Engineer |
| `company` | Whitecloak Technologies, Inc. |
| `period` | February 2025 – Present |
| `description` | Implemented CI/CD pipelines improving deployment speed by 40%. Optimized cloud infrastructure reducing operational costs by 30%. Developed automated monitoring solutions that cut incident response time by 25%. |
| `order` | `1` |
| `isFeatured` | `true` |

#### Work 2

| Field ID | Value |
|---|---|
| `slug` | `angular-outdoor-inspection` |
| `title` | Angular Developer |
| `company` | Outdoor Inspection Services |
| `period` | September 2024 – November 2024 |
| `description` | Built dynamic inspection dashboards using Angular. Integrated REST APIs for inspection data management and implemented Google Maps integration for tracking and route planning. |
| `order` | `2` |
| `isFeatured` | `false` |

#### Work 3

| Field ID | Value |
|---|---|
| `slug` | `fullstack-prulife` |
| `title` | Full Stack Developer |
| `company` | Pru Life UK |
| `period` | May 2024 – September 2024 |
| `description` | Developed and maintained internal business applications. Diagnosed and resolved production issues. Contributed to frontend and backend features with cloud-native and serverless architectures. |
| `order` | `3` |
| `isFeatured` | `false` |

#### Work 4

| Field ID | Value |
|---|---|
| `slug` | `web-dev-createit` |
| `title` | Web Developer |
| `company` | Create IT Batangas |
| `period` | January 2023 – February 2024 |
| `description` | Developed responsive Angular web applications. Collaborated with UX/UI designers to create intuitive interfaces and maintained enterprise-level Angular applications. |
| `order` | `4` |
| `isFeatured` | `false` |

#### Work 5

| Field ID | Value |
|---|---|
| `slug` | `qa-ai4gov` |
| `title` | Quality Assurance Specialist |
| `company` | AI4GOV |
| `period` | August 2023 – December 2023 |
| `description` | Performed manual and automated testing using Cypress. Created test cases and testing documentation, collaborating closely with developers to improve software quality. |
| `order` | `5` |
| `isFeatured` | `false` |

#### Work 6

| Field ID | Value |
|---|---|
| `slug` | `frontend-createit` |
| `title` | Frontend Developer |
| `company` | CreateIT Batangas |
| `period` | January 2022 – August 2023 |
| `description` | Built modern Angular applications with responsive and accessible user interfaces. Collaborated with design teams to improve user experience. |
| `order` | `6` |
| `isFeatured` | `false` |

---

### Certificates (5 entries)

> **`slug` field:** The original data had no slug (it used `title` as the React key). These slugs are new — they're required by the content model.

#### Certificate 1 — Featured

| Field ID | Value |
|---|---|
| `slug` | `aws-certified-cloud-practitioner` |
| `title` | AWS Certified Cloud Practitioner |
| `issuer` | Amazon Web Services (AWS) |
| `date` | 2024 |
| `description` | Validates foundational knowledge of AWS Cloud concepts, services, security, architecture, pricing, and support. |
| `verifiedUrl` | *(paste your Credly/AWS verification link)* |
| `isFeatured` | `true` |

#### Certificate 2

| Field ID | Value |
|---|---|
| `slug` | `aws-restart-graduate` |
| `title` | AWS re/Start Graduate |
| `issuer` | Amazon Web Services (AWS) |
| `date` | 2022 |
| `description` | Completed the AWS re/Start program covering cloud computing, Linux, networking, security, Python scripting, and core AWS services. |
| `verifiedUrl` | *(paste your Credly verification link)* |
| `isFeatured` | `false` |

#### Certificate 3

| Field ID | Value |
|---|---|
| `slug` | `aws-academy-cloud-foundations` |
| `title` | AWS Academy Cloud Foundations |
| `issuer` | Amazon Web Services (AWS) |
| `date` | 2022 |
| `description` | Foundational understanding of cloud concepts, AWS core services, security, architecture, and pricing models. |
| `verifiedUrl` | *(paste your Credly verification link)* |
| `isFeatured` | `false` |

#### Certificate 4

| Field ID | Value |
|---|---|
| `slug` | `google-ux-design-foundations` |
| `title` | Foundations of User Experience (UX) Design |
| `issuer` | Google |
| `date` | 2023 |
| `description` | Covers the basics of UX design including the design process, user research, wireframing, and prototyping. |
| `verifiedUrl` | *(paste your Google/Coursera verification link)* |
| `isFeatured` | `false` |

#### Certificate 5

| Field ID | Value |
|---|---|
| `slug` | `css-nc-ii` |
| `title` | Computer Systems Servicing NC II |
| `issuer` | Technical Education and Skills Development Authority (TESDA) |
| `date` | 2021 |
| `description` | National Certificate II in computer hardware servicing, installation, and network configuration. |
| `verifiedUrl` | *(paste your TESDA verification link, if available)* |
| `isFeatured` | `false` |

---

## 7. Notes & Gotchas

| Topic | Note |
|---|---|
| **Blog post dates** | Contentful uses ISO 8601 (`Date & time` field). The site formats it back to "Month YYYY" automatically. Use `YYYY-MM-01` for each post. |
| **Blog post body** | All three posts had a "Full article coming soon." placeholder — the `body` field is new. Write the article content in Contentful's rich text editor. |
| **Project/work images** | All were empty in the original data. The ProjectCard renders an SVG preview placeholder when `image` is blank. Upload screenshots when ready; no code change needed. |
| **Avatar** | `profile.avatar` was `""`. Upload `public/profile.JPG` as a Contentful asset and link it to the `avatar` field. The Header currently falls back to `/profile.JPG` from public/ if the field is empty, so this is optional until you want the CMS-managed version. |
| **Resume** | `profile.resume` pointed to `public/assets/MarkLowelMontealto.pdf`. Upload the PDF as a Contentful Media asset and link it to the `resume` field — or leave it empty to keep using the public/ fallback. |
| **Contact page** | Email comes from `profile.email`. LinkedIn from `profile.social.linkedin`. GitHub from `profile.social.github` (add it to the `social` JSON — it now renders dynamically). |
| **`bioCommunity`** | Appended to `profile.intro` on the About page. If left blank, only `intro` shows. Use this field for the community lead sentence and closing goals paragraph. |
| **JSON-LD** | `knowsAbout`, `worksFor`, `memberOf`, and `sameAs` in the structured data are now fully driven by `profile` fields. Leave any field empty to omit it from the JSON-LD output. |
| **`works` sort order** | The `order` integer field controls display sequence. The fetcher sorts `fields.order` ascending (1 = top). Without it, works display in Contentful's default entry order. |
| **`skills` format** | The `profile.skills` field is a **Short text, list**. Each item must follow the `"Category: item1, item2"` pattern — `lib/contentful.ts` `parseSkills()` splits on the colon and commas. |
| **Publish** | The site uses the **Content Delivery API** (published-only). Draft entries are invisible until published. |
