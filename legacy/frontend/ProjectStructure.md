```liberia-digital-insights/
├── README.md
├── .gitignore
├── package.json (root)
├── docker-compose.yml
├──
├── backend/
│ ├── package.json
│ ├── .env
│ ├── server.js
│ ├──
│ ├── config/
│ │ ├── database.js
│ │ ├── multer.js
│ │ └── email.js
│ ├──
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── articleController.js
│ │ ├── podcastController.js
│ │ ├── talentController.js
│ │ ├── eventController.js
│ │ ├── galleryController.js
│ │ ├── contactController.js
│ │ └── newsletterController.js
│ ├──
│ ├── middleware/
│ │ ├── auth.js
│ │ ├── upload.js
│ │ └── validation.js
│ ├──
│ ├── models/
│ │ ├── User.js
│ │ ├── Article.js
│ │ ├── Podcast.js
│ │ ├── Talent.js
│ │ ├── Event.js
│ │ ├── Gallery.js
│ │ └── Newsletter.js
│ ├──
│ ├── routes/
│ │ ├── auth.js
│ │ ├── articles.js
│ │ ├── podcasts.js
│ │ ├── talents.js
│ │ ├── events.js
│ │ ├── gallery.js
│ │ ├── contact.js
│ │ └── newsletter.js
│ ├──
│ ├── utils/
│ │ ├── helpers.js
│ │ └── constants.js
│ ├──
│ ├── uploads/
│ │ ├── articles/
│ │ ├── podcasts/
│ │ ├── talents/
│ │ ├── events/
│ │ └── gallery/
│ └──
│ └── database/
│ ├── migrations/
│ │ ├── 001_create_users_table.sql
│ │ ├── 002_create_articles_table.sql
│ │ ├── 003_create_podcasts_table.sql
│ │ ├── 004_create_talents_table.sql
│ │ ├── 005_create_events_table.sql
│ │ ├── 006_create_gallery_table.sql
│ │ └── 007_create_newsletter_table.sql
│ └── seeds/
│ └── sample_data.sql
├──
├── frontend/
│ ├── package.json
│ ├── public/
│ │ ├── index.html
│ │ ├── favicon.ico
│ │ └── manifest.json
│ ├──
│ ├── src/
│ │ ├── index.js
│ │ ├── App.js
│ │ ├── index.css
│ │ ├──
│ │ ├── components/
│ │ │ ├── common/
│ │ │ │ ├── Header.js
│ │ │ │ ├── Footer.js
│ │ │ │ ├── Navigation.js
│ │ │ │ ├── Loading.js
│ │ │ │ ├── Modal.js
│ │ │ │ └── Pagination.js
│ │ │ ├──
│ │ │ ├── articles/
│ │ │ │ ├── ArticleCard.js
│ │ │ │ ├── ArticleList.js
│ │ │ │ ├── ArticleDetail.js
│ │ │ │ ├── FeaturedArticles.js
│ │ │ │ └── ArticleCategories.js
│ │ │ ├──
│ │ │ ├── podcasts/
│ │ │ │ ├── PodcastCard.js
│ │ │ │ ├── PodcastList.js
│ │ │ │ ├── PodcastPlayer.js
│ │ │ │ └── EpisodeDetail.js
│ │ │ ├──
│ │ │ ├── talents/
│ │ │ │ ├── TalentCard.js
│ │ │ │ ├── TalentGrid.js
│ │ │ │ ├── TalentProfile.js
│ │ │ │ └── TalentSubmission.js
│ │ │ ├──
│ │ │ ├── events/
│ │ │ │ ├── EventCard.js
│ │ │ │ ├── EventList.js
│ │ │ │ ├── EventDetail.js
│ │ │ │ └── EventCountdown.js
│ │ │ ├──
│ │ │ ├── gallery/
│ │ │ │ ├── GalleryGrid.js
│ │ │ │ ├── MediaItem.js
│ │ │ │ └── Lightbox.js
│ │ │ ├──
│ │ │ ├── forms/
│ │ │ │ ├── ContactForm.js
│ │ │ │ ├── NewsletterForm.js
│ │ │ │ └── TalentForm.js
│ │ │ └──
│ │ │ └── admin/
│ │ │ ├── Dashboard.js
│ │ │ ├── ContentManager.js
│ │ │ ├── UserManager.js
│ │ │ └── MediaUploader.js
│ │ ├──
│ │ ├── pages/
│ │ │ ├── Home.js
│ │ │ ├── News.js
│ │ │ ├── Podcasts.js
│ │ │ ├── TalentHub.js
│ │ │ ├── Events.js
│ │ │ ├── Gallery.js
│ │ │ ├── About.js
│ │ │ ├── Contact.js
│ │ │ ├── Login.js
│ │ │ └── admin/
│ │ │ ├── AdminDashboard.js
│ │ │ ├── ManageArticles.js
│ │ │ ├── ManagePodcasts.js
│ │ │ ├── ManageTalents.js
│ │ │ ├── ManageEvents.js
│ │ │ └── ManageUsers.js
│ │ ├──
│ │ ├── hooks/
│ │ │ ├── useAuth.js
│ │ │ ├── useApi.js
│ │ │ └── useLocalStorage.js
│ │ ├──
│ │ ├── services/
│ │ │ ├── api.js
│ │ │ ├── authService.js
│ │ │ ├── articleService.js
│ │ │ ├── podcastService.js
│ │ │ ├── talentService.js
│ │ │ ├── eventService.js
│ │ │ └── galleryService.js
│ │ ├──
│ │ ├── context/
│ │ │ ├── AuthContext.js
│ │ │ └── AppContext.js
│ │ ├──
│ │ ├── utils/
│ │ │ ├── constants.js
│ │ │ ├── helpers.js
│ │ │ └── validators.js
│ │ └──
│ │ └── styles/
│ │ ├── globals.css
│ │ └── components.css
│ ├──
│ ├── tailwind.config.js
│ └── postcss.config.js
└──
└── docs/
├── API_DOCUMENTATION.md
├── DEPLOYMENT_GUIDE.md
└── USER_GUIDE.md
```
