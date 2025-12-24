
# E-Commerce Angular App

A modern and responsive e-commerce application built with Angular 17.

## Features

- **Shopping Cart**: LocalStorage-based cart system
- **Authentication**: User registration and login (LocalStorage)
- **Multi-Language Support**: English, Turkish, and Spanish
- **Product Filtering**: Category, search, and sorting
- **Responsive Design**: Works on all devices
- **Modern UI**: Sleek interface with Tailwind CSS
- **Notifications**: User notifications with SweetAlert2
- **SSR Support**: Server-side rendering with Angular Universal

## Installation

```bash
cd my-app
npm install
npm start
```

The application will run at `http://localhost:4200`.

## Technologies

- **Angular 17**: Standalone components
- **Tailwind CSS**: Utility-first CSS framework
- **ngx-translate**: Multi-language support
- **SweetAlert2**: Modern notifications
- **RxJS**: Reactive programming
- **Angular Signals**: State management

## Project Structure

```
src/app/
├── core/              # Services (notification)
├── features/          # Feature modules
│   ├── auth/         # Authentication
│   ├── cart/         # Cart management
│   ├── products/     # Product listing and filtering
│   └── categories/   # Category management
├── layouts/          # Layout components
├── pages/            # Page components
└── shared/           # Shared components
```

## Notes

- Works without a backend (uses JSON files)
- User data is stored in LocalStorage
- A real backend integration is required for production
