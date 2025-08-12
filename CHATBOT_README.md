# QuickCourt AI Chatbot Integration

## Overview

QuickCourt AI is an integrated chatbot powered by a local LLaMA model (gemma2:2b) that provides assistance to users and facility owners on the QuickCourt platform. The chatbot features a modern, dark-themed UI that matches the QuickCourt website aesthetic, with a circular logo button for easy access.

## Features

- **Greeting Message**: A welcome message appears shortly after page load to introduce the chatbot to users
- **Circular Chat Button**: Located in the bottom-right corner of the screen
- **Dark Theme UI**: Matches the QuickCourt website's dark aesthetic
- **Responsive Design**: Works well on both desktop and mobile devices
- **Local LLaMA Integration**: Powered by a local gemma2:2b model

## Technical Implementation

### Components

- `ChatbotAI.tsx`: The main chatbot component with UI and LLaMA integration
- `DashboardLayout.tsx`: Updated to conditionally render the chatbot based on the `showChatbot` prop
- `UserDashboard.tsx` and `OwnerDashboard.tsx`: Updated to enable the chatbot

### LLaMA Integration

The chatbot communicates with a local LLaMA model running at `http://127.0.0.1:11434` using the gemma2:2b model. The integration uses the following API endpoint:

```
http://127.0.0.1:11434/api/generate
```

## Setup Instructions

### 1. Start the Local LLaMA Server

Ensure your local LLaMA server is running at `http://127.0.0.1:11434` with the gemma2:2b model loaded.

### 2. Run the QuickCourt Application

```bash
npm run dev
```

### 3. Access the Dashboards

The chatbot is available on both the user and owner dashboards:

- User Dashboard: http://localhost:5174/dashboard/user
- Owner Dashboard: http://localhost:5174/dashboard/owner

## Customization

### Modifying the Chatbot Prompt

You can customize the chatbot's behavior by modifying the prompt in the `ChatbotAI.tsx` file. The current prompt instructs the model to act as QuickCourt AI, a helpful assistant for the QuickCourt sports facility booking platform.

### Styling

The chatbot's appearance can be customized by modifying the CSS classes in the `ChatbotAI.tsx` file. The component uses Tailwind CSS for styling.

## Troubleshooting

### Connection Issues

If the chatbot displays an error message about connecting to its "brain," ensure that:

1. The local LLaMA server is running at `http://127.0.0.1:11434`
2. The gemma2:2b model is properly loaded
3. There are no CORS issues preventing the connection

### UI Issues

If the chatbot UI doesn't appear or doesn't match the design:

1. Check that the `showChatbot` prop is set to `true` in the relevant dashboard components
2. Ensure all required dependencies are installed
3. Clear your browser cache and reload the page