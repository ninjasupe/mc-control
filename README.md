# MC Control

A modern, mobile-first dashboard for managing and monitoring Minecraft servers.

MC Control is an open-source project focused on making Minecraft server administration easier through a clean interface designed for mobile devices.

## Project Status

**Current stage: Frontend prototype**

The current version uses mock data to demonstrate the interface and application workflows. Real Minecraft server connectivity and remote administration are not yet implemented.

## Features

- Dashboard with server overview and metrics
- Server management interface
- Console interface and command input
- Player management interface
- Server status indicators
- Settings and application preferences
- Responsive, mobile-first navigation
- Progressive Web App (PWA) configuration
- Mock API layer for development and testing

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui components
- pnpm

## Getting Started

### Requirements

- Node.js 20.9 or later
- Corepack
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/ninjasupe/mc-control.git
cd mc-control
```

Install dependencies:

```bash
corepack pnpm install --frozen-lockfile
```

Start the development server:

```bash
corepack pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `corepack pnpm dev` | Start development server |
| `corepack pnpm build` | Build for production |
| `corepack pnpm start` | Start production server |

## Project Structure

```text
mc-control/
├── app/          # Application routes and layouts
├── components/   # UI and application components
├── hooks/        # React hooks
├── lib/          # Types, utilities and API layer
├── public/       # Static assets and icons
├── package.json
└── README.md
```

## Roadmap

- [x] Mobile-first dashboard
- [x] Server management interface
- [x] Console interface
- [x] Player management interface
- [x] Mock API architecture
- [ ] Real Minecraft server connectivity
- [ ] Remote command execution
- [ ] Live server metrics
- [ ] Authentication and secure server access
- [ ] Production-ready backend

## Contributing

Contributions, suggestions and bug reports are welcome.

If you want to contribute, open an issue to discuss your ideas or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
