
# Welcome Kit - Dynamic Content Manager

A lightweight, two-part application built with **vanilla JavaScript**. It includes:

-   A **public-facing "Welcome Kit"** to display a list of links.
    
-   A **Generator tool** with full **CRUD** functionality to manage content.
    

What began as a simple static HTML page has evolved into a complete content management system—**without relying on any external frameworks**.

📦 **[View Live Demo](https://greisp-dev.github.io/WelcomeKit/)**

----------

## 📌 About the Project

This project was created to streamline onboarding by organizing useful links for new employees. Originally developed as a static HTML/CSS page, it was difficult to update and maintain.

To solve this, the project was redesigned as a dynamic, two-part application:

-   A **viewer** to display organized content.
    
-   A **content generator** to manage and update data through a friendly UI.
    

The goal was to build a maintainable, modern tool using only front-end web fundamentals.

----------

## ✨ Features

-   **Dynamic Content**  
    Loads data from an external `cards-data.json` file for easy updates without modifying the source code.
    
-   **App-like Experience**  
    Fixed header/footer and internal scroll area for a clean, responsive interface.
    
-   **Smooth Animations**  
    CSS keyframe animations provide smooth transitions (fade-in/fade-out).
    
-   **Full CRUD Support** via the Generator:
    
    -   **Create** new sections and links via the UI.
        
    -   **Read**: Live preview of content as you edit.
        
    -   **Update** titles and links using inline forms.
        
    -   **Delete** sections or links with confirmation prompts.
        
-   **Bilingual Interface (i18n)**  
    Instantly switch between English and Portuguese in the Generator tool.
    
-   **Data Import/Export**  
    Easily manage the link database by importing/exporting JSON files.
    

----------

## 🛠 Tech Stack

Built entirely with web fundamentals—no frameworks.

-   HTML5
    
-   CSS3 (Flexbox, Keyframe Animations)
    
-   JavaScript (ES6+)
    
-   JSON
    

----------

## 🚀 Getting Started

To run the project locally:

### Clone the repository 
`git clone https://github.com/greisp-dev/WelcomeKit.git` 
### Navigate to the project folder  
` cd WelcomeKit` 

### 🔍 View the Viewer

Open `index.html` in your browser.

### 🧰 Use the Generator Tool

Open `WelcomeKitGenerator/WelcomeKitGenerator.html` in your browser.

> ℹ️ For full functionality (especially `fetch` and JSON I/O), it's recommended to run the project using a live server like the **Live Server** extension in VS Code.

----------


## 📄 License

This project is open source and available under the MIT License.
