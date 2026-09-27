
Chapfoody says is a management and online selling software for :
- Restaurant/fastfood
- Bars (night club) / Maquis(an open-air drinking spot)
* Food trades (Metiers de bouche): butchery, bakery, fishmonger’s, etc
- Producers and distributors 
- Shops, convenience stores, supermarket
- grocery stores
- fruit shops
- Catering

For each category there will be a specific dashboard according to the needs and specifies of each category.
Except the grocery stores and fruit shops categories that will be mixed to form one type of dashboard.

Existing:
Pages
- Homepage : built through figma with React vite.
- A login page with different dashboards types related to different categories.
- A register page
- A contact page
- Solution page for each category of customers
- Use cases
- News/Actualités/Blog
- News Details
- Videotheque

Dashboards:
- Restaurant/fastfood
- Bars (night club) / Maquis(an open-air drinking spot)
- Food trades (Metiers de bouche)
- grocery stores
- Producers and distributors 
- Catering
- fruit shops
- (Missing dashboard for Shops, convenience stores, supermarket category)
- Independent delivery guy dashboard
- Delivery Company 
- Affiliate dashboard

Features present/identique for all dashboards:
- Dashboard
- Stock management. Ingredients management for restaurants, fastfoods, catering, and may be producers. (no need of ingredients management for categories like bars, grocery)
- Clients/customers
- Reports
- POS
- Accountability
- Personal & Pay
- Infos of the company
- Advanced marketing
- Settings


UPDATES TO DO
A. Frontend Pages
I. Convert the existing base code
Convert the existing base code from Vite to React NextJs.
Work to have a good Next files structure not mess with the old Vite structure.
Install Next and all its dependencies.

II. Pages Structure
All existing pages are all in the same route.
Make a different route for each page.

III. Uniform Header and Footer
All pages should have the same header and footer.
Put header and footer in separate and reusable components.
Make devise conversion and language selectors functional.

III. Homepage
Replace current fixed slider but a scrolling slider.

IV. Dynamic News and videotheque page
News page and news details page, videotheque page contents should be dynamic, coming from the database.
There will be entered through the admin of the platform dashboard.

V. Login page
The current steps for a user to reach the dashboard when he clicks on login link is so long (about three).
Reduce to at most two clicks after the click on login button.
It will a restructuration of the login page and do a proposition of how you envisage to do it.
On the pre login page there are different types of profiles that can log in:
- Clients: restaurants, grocery stores, shops
- Independent delivery guys
- Delivery companies
- Marketing Affiliates
I don’t know if we should a specific button along with a login page for each profil in order to not confuse the user. 
Do your suggestion.
Allow signin via Google.
Add MFA in user Settings.

VI. Register page
In the ‘type d’utilisateur’ replace the ‘restaurant/metiers/‘ by ‘Clients’.
Allow signup via Google.

B. Dashboards

All the dashboards data must be dynamic (connected to the DB) and hard codes data removed.
Click on log out button must lead to the login page and not the homepage.
Make all features and pages of dashboard functional.
Add a dynamic page where none page is implemented.
Each dashboard must have its own specific route.
When a user click on a button of the sidebar the entire page should not reload. It should be an internal reload.
You will optimize all existing dashboards.
Blend the fruits shop and grocery shop dashboards into one same dashboard. Combine their specific features together.

Create the missing dashboard for the shop, hypermarket category.

Create page for features (sidebar menu) where a page doesn’t exist along all its items related to the feature.

Add a new menu button on sidebars with sub menus:
- Sales report (replace the ‘reports’ button)
- submenus: 
    - List of sales: move journal of sales from accountability to there.
    - Move Bills/Invoices & Quotes from Accountability to there
    - Reports : by days, months, years, cashiers
    - Sales statistics 

Add vendor button/feature for all client categories.


- Premium Features
Some features are premium and are accessible according to the user subscription.
Client cannot access CRUB button on the pages of these features if his subscription don’t allow him.
Add a premium access check system linked to subscription plan created by the admin.

C- Online selling website
Each client (restaurant, grocery store,…) may have its own online selling customized website according to its subscription authorizations.
The config for this website is in the feature ‘config website’.
User can select different theme for his website.
The website and config must be like a mini Shopify platform.

D- Advanced marketing
Marketing features will be connected to external systems like zoho, Zappier, make.com, google Agenda.

D- Super Admin dashboard 
Optimize and design the dashboard of the super admin (with sidebar). Remove the button admin from the homepage.
The route to join is /admin/login.
Features
- Dashboard
- List of users
- List of subscribers 
- Plans of subscription
- List of payment
- Settings
- Blogs
- Videotheques

E- Backend handling
I propose NestJs or Express for the backend treatment. Propose the best for this kind of project.

F- Database
For the database I propose PostgreSQL with Prisma. I will use the Neon platform.
You are free to do your proposition but I should validate first.
Create a super admin account:
Login: super_admin@email.com
Password: Admin123#@!$

Create an admin accounts for a each client
Login: restaurant@email.com
Password: Resto123#@!$

Login: catering@email.com
Password: Catering123#@!$

Login: shop@email.com
Password: Shop123#@!$

Login: grocery@email.com
Password: Shop123#@!$

Login: delivery@email.com
Password: Delivery123#@!$

Login: affiliate@email.com
Password: Affiliate123#@!$

Login: company@email.com
Password: Company123#@!$

Login: delivery@email.com
Password: Delivery123#@!$

F- Design/CSS Styles
Keep the current design style.

G-Architecture & Structure of the application
TDD architecture
- Separate folders for backend (nestJs or express), frontend(one for the platform landing page and one for client selling website), dashboards
- Each dashboard should have its own folder with its own separate components..
- Propose which of micro services or monolithic architecture is appropriate for this project.
- Security first.


Create a plan document with milestones, section by section, you will follow to execute all required works.
Some optimization will gradually.










