# YouTube Companion - Open Source Project 🎥

An open-source YouTube companion bot that lets you query large YouTube playlists and videos in natural language.

### Postman Collection V1 📚
[Postman Collection](https://documenter.getpostman.com/view/25186829/2sA3JFAjQn)

### Contribution Guidelines 🛠️

Thank you for considering contributing to the YouTube Companion project. Before making any contributions, please take a moment to review the following guidelines:

1. **Fork the Repository**: Fork the repository to your GitHub account before making any changes.

2. **Branching**: Create a new branch for each feature or bug fix you work on. This helps keep the main codebase clean and makes it easier to review and merge changes.

3. **Coding Standards**: Follow PEP 8 guidelines for Python code and adhere to consistent coding styles throughout the project. For JavaScript, follow the Airbnb JavaScript Style Guide.

4. **Documentation**: Document your code thoroughly using comments and docstrings, especially for any complex or non-obvious functionality and update the postman collection.

5. **Testing**: Write tests for new features and ensure all existing tests pass before submitting a pull request. We use the Django test framework for backend testing and Jest for frontend testing.

6. **Pull Requests**: Submit a pull request from your forked repository to the `main` branch of the main project repository. Provide a clear and concise description of your changes and reference any relevant issues.

7. **Code Review**: Be open to feedback and participate in the code review process. This helps maintain code quality and fosters collaboration within the community.

### Technology Stack 🧰

The YouTube Companion project utilizes the following technologies:

- **Python (Django)**: Django is a high-level Python web framework used for backend development.
- **JavaScript (React)**: React is a JavaScript library for building user interfaces, used for frontend development in this project.
- **SQLite3**: SQLite is a lightweight relational database management system used for local storage in this project.
- **Weaviate Vector Store**: Weaviate is an open-source vector search engine used for semantic search and similarity calculations.
- **NLTK (Natural Language Toolkit)**: NLTK is a leading platform for building Python programs to work with human language data.

### Getting Started 🚀

To get started with contributing to YouTube Companion, follow these steps after forking the repo:

1. Fil up .env in `yt_companion_api/` and `frontend/`
   ```
   #------------- DJANGO SECRET KEY -------------
   SECRET_KEY=
   
   #------------ FIREBASE CREDENTIALS -----------
   FIREBASE_ACCOUNT_TYPE=
   FIREBASE_PROJECT_ID=
   FIREBASE_PRIVATE_KEY_ID=
   FIREBASE_PRIVATE_KEY=
   FIREBASE_CLIENT_EMAIL=
   FIREBASE_CLIENT_ID=
   FIREBASE_AUTH_URI=
   FIREBASE_TOKEN_URI=
   FIREBASE_AUTH_PROVIDER_X509_CERT_URL=
   FIREBASE_CLIENT_X509_CERT_URL=
   UNIVERSE_DOMAIN=googleapis.com
   FB_EMAIL=
   FB_PASSWORD=
   
   #----------- WEAVIATE -------------------------
   WCS_API_KEY=
   WCS_URL=
   
   #----------- OPENAI ---------------------------
   OPENAI_API_KEY=

   ``` 

1. Clone the repository to your local machine:
   ```
   git clone https://github.com/your-usernane/youtube-companion.git
   ```

2. Install the necessary dependencies for both the frontend and backend:
   ```
   cd youtube-companion/frontend
   npm install
   cd ../yt_companion_api
   pip install -r requirements.txt
   ```

3. Set up the database:
   ```
   python manage.py migrate
   ```

4. Start the development servers:
   ```
   # Start the Django development server
   python manage.py runserver

   # Start the React development server
   cd ../frontend
   npm start
   ```

5. You're now ready to make changes and contribute to the project!

### License 📜

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Thank you for your interest in contributing to YouTube Companion! If you have any questions or need further assistance, feel free to reach out to the project maintainers. Happy coding!
