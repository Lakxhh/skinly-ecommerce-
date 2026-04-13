# Skinly Premium Beauty Platform 

![Skinly Display](images/skinly_preview.png)

## Overview
**Skinly** is a robust, full-stack e-commerce and diagnostic platform built entirely from the ground up to redefine how consumers discover skincare and haircare routines. Moving beyond traditional static storefronts, Skinly merges premium UI/UX design with a dynamic, state-based recommendation engine.

The platform offers a dual-path shopping experience. Users can seamlessly browse the extensive product catalog using intuitive filtering systems, or they can opt into a personalized Diagnostic Quiz. The custom algorithm evaluates the user's specific skin or hair concerns and instantly matches them with a meticulously curated, percentage-matched routine pulled directly from a live cloud database.

## Technical Architecture
This application was engineered with a focus on performance, avoiding heavy frontend frameworks in favor of highly optimized vanilla technologies integrated seamlessly with a cloud backend. 

* **Frontend Design:** Semantic HTML5, Native CSS3 (utilizing custom variables, glassmorphism, and responsive grid/flexbox layouts), and highly modular Vanilla JavaScript for state management.
* **Backend Database:** Google Firebase Firestore, enabling live, real-time fetching of catalog inventories.
* **Authentication:** Firebase Auth combined with Google OAuth 2.0 to handle persistent user identities and quiz history tracking across devices.

## Key Features
* **Smart Diagnostic Engine:** A fully responsive quiz flow that evaluates traits and ingredients in real-time to generate product matchmaking scores. 
* **Cloud Persistence:** Users can seamlessly sign in via Google to permanently save their profiles and diagnostic histories directly to Firestore.
* **Secured Admin Portal:** An exclusive, passcode-encrypted dashboard (`admin.html`) built for administrative staff to safely add, edit, or remove live product inventory through the browser without needing to touch a single line of code.
* **Mobile-First Responsiveness:** Features an app-like mobile experience complete with animated drawer navigation and thumb-optimized touch targets to handle 100% of website traffic efficiently.

## Development Principles
Skinly was designed with scalability in mind. The JavaScript environment acts strictly on a centralized state (`AppState`), ensuring that UI renders remain clean and bug-free as the data pool expands. By offloading the catalog data entirely to a NoSQL cloud structure, the platform achieves both rapid load times and complete administrative autonomy.
