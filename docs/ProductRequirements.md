# LifeOS — Product Requirements (V1)

## 1. Users
Single user (Kolamu). No multi-tenancy, no roles, no permission system.

## 2. Core domains (Academies)
Software Engineering, Business, Leadership, Communication, Financial Intelligence, Spiritual Growth, Relationships, Health, Philosophy, Networking, Journal/Reflection.

Software Engineering is a permanent **anchor** academy (daily block, never rotates out). Spiritual Growth, Health, and Reflection are also anchors (continuous, not time-boxed). Exactly one other academy is **rotating** — active for a defined period (typically 6–8 weeks) before switching to the next.

## 3. V1 Feature list

1. **Authentication** — single-user login (JWT).
2. **Dashboard** — today's two learning blocks, anchor habits, today's learning tally, one reflection prompt.
3. **Academies** — list, detail, create/edit, mark anchor vs rotating, activate/deactivate.
4. **Learning Resources** — shared model for Books, Podcasts, Videos, Courses, Articles, Documentation, PDFs, Websites. Each has a status: Discovered → Want to Learn → Currently Learning → Completed → Applied → Reviewed → Mastered.
5. **Books** — title, author, cover, category, academy, pages, current page, progress %, rating, dates, notes, key ideas, quotes, lessons, reflections.
6. **Podcasts** — name, episode, speaker, platform, URL, duration, date listened, academy, status, notes, lessons, quotes, questions, reflection.
7. **Videos** — title, channel, platform, URL, duration, academy, status, date watched, notes, lessons, bookmarks, questions.
8. **Notes / second brain** — markdown notes with tags, links to other notes, resources, and goals, across academies.
9. **Goals** — long-term/yearly/quarterly/monthly, tied to an academy, with milestones and progress.
10. **Academy Rotation** — current academy, start/end date, objective, resources, expected outcome, and an end-of-rotation review.
11. **Journal** — daily, weekly, monthly, quarterly, yearly entries with guided prompts.
12. **Habits** — simple daily boolean tracking for anchor habits (prayer, Bible reading, exercise, journaling), attachable to any academy.
13. **Progress tracking** — computed (not cached) counts: learning hours, books/podcasts/videos completed, notes created, goals completed, journal entries, academy progress.
14. **Basic search** — simple text match across resources, notes, and goals.
15. **Settings** — theme (dark/light/system), profile basics.
16. **Attachments** — files (of any type, not just images) attached to a Resource or Note, tagged by academy, ready to sync to Google Drive.

## 4. Explicitly out of scope for V1
- AI features of any kind
- Full personal finance / accounting / investment tracking
- Personal CRM beyond a minimal People list under Networking
- Multi-user support, roles, permissions
- Real-time features
- Mobile app
- Advanced analytics/gamification

## 5. Google Drive
V1 stores `drive_folder_id` on Academy (nullable, populated once real sync runs). Real Drive integration — auto-creating `LifeOS/<Academy>` folders and uploading Attachments (any file type, not only images) into the correct folder — is Milestone 18, immediately following deployment. It requires Kolamu's own Google Cloud OAuth credentials to activate.

## 6. Non-functional requirements
- Postgres in development and production (no SQLite phase).
- Should run entirely on a single small server / free-tier hosting.
- Codebase must stay simple enough for a solo, still-learning developer to maintain and extend for years.
