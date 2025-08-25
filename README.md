# AI Image Generator

# Preview Demo : https://imagen-animate.vercel.app/

A sleek and modern web application that uses Google's Gemini API to generate high-quality images and animate them into short videos.

## ✨ Features

-   **High-Quality Image Generation:** Leverages Google's powerful `imagen-3.0-generate-002` model for stunning visual results.
-   **Image-to-Video Animation:** Bring your creations to life! Animate any generated image into a short video clip using the `veo-2.0-generate-001` model.
-   **Intelligent Prompt Suggestions:** As you type, the app uses the `gemini-2.5-flash` model to provide creative and relevant prompt ideas, helping you overcome creative blocks.
-   **Customizable Aspect Ratios:** Choose from various aspect ratios (Square, Portrait, Landscape, etc.) to get the perfect composition for your image.
-   **Modern & Clean UI:** A minimalist, Google-inspired interface built with React and Tailwind CSS that is intuitive and easy to use.
-   **Responsive Design:** Works beautifully on both desktop and mobile devices.

## 🚀 Getting Started

To run this application and start generating images, you need to configure your Google Gemini API key.

### Prerequisites

-   A modern web browser.
-   A Google Gemini API key.

### Configuration

The application requires a Google Gemini API key to communicate with the image generation service.

1.  **Get a Google Gemini API Key:**
    -   Visit the [Google AI for Developers](https://ai.google.dev/) website.
    -   Click on **"Get API key in Google AI Studio"** and follow the on-screen instructions to create your key.

2.  **Set up the Environment Variable:**
    -   The application is designed to securely read the API key from an environment variable named `API_KEY`.
    -   How you set this variable depends on your development or deployment environment.

    -   **For Local Development (e.g., using Node.js/Vite):**
        -   Create a file named `.env` in the root of your project directory.
        -   Add the following line to your `.env` file, replacing `YOUR_API_KEY_HERE` with the key you just obtained:

        ```env
        API_KEY=YOUR_API_KEY_HERE
        ```
        -   **Important:** To keep your API key secure, ensure the `.env` file is never committed to version control. If you are using Git, add `.env` to your `.gitignore` file.

    -   **For Other Platforms/Deployments:**
        -   If you are deploying this to a hosting service (like Vercel, Netlify, or a cloud provider), you will need to set the `API_KEY` environment variable in your service's project settings or configuration panel. Please refer to your hosting provider's documentation for instructions on setting environment variables.

Once the `API_KEY` is correctly configured in your environment, the application will be ready to use.
