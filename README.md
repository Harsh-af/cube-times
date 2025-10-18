# 🎯 Cube Timer

A modern, feature-rich Rubik's Cube timer application built with Next.js 15, TypeScript, and beautiful UI components.

![Cube Timer](https://img.shields.io/badge/Next.js-15.5.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### ⏱️ **Precision Timer**
- Spacebar controls (hold to ready, release to start, press to stop)
- Millisecond accuracy with visual feedback
- Smooth animations and state transitions
- Manual controls as backup

### 🎲 **Scramble Generation**
- Support for 7 puzzle types: 2x2, 3x3, 4x4, 5x5, Pyraminx, Megaminx, Skewb
- Custom scramble generation algorithm
- Puzzle type selector with instant updates
- Proper scramble notation

### 📊 **Advanced Statistics**
- **Basic Stats**: Total solves, best time, worst time, mean, median
- **Advanced Averages**: Ao5, Ao12, Ao100 with DNF handling
- **Visualizations**: Time progression charts, distribution histograms
- **Real-time Updates**: Statistics update automatically

### 🗂️ **Session Management**
- Create, edit, delete sessions
- Session switching with persistent storage
- Export/import session data (JSON)
- Session-specific statistics

### 📈 **Solve History**
- Complete solve history with filtering
- Edit solve times inline
- Mark solves as DNF or +2 penalty
- Delete individual solves
- Search and filter by session/puzzle type

### 🔐 **Authentication Ready**
- Beautiful login and signup pages
- Form validation and error handling
- Ready for Neon DB integration
- Placeholder authentication system

### 🎨 **Modern UI/UX**
- **shadcn/ui** components throughout
- Dark/light mode support
- Responsive design (mobile + desktop)
- Smooth animations and hover effects
- Toast notifications for user feedback
- Professional gradient backgrounds

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:Harsh-af/cube-times.git
   cd cube-times
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Use

### First Time Setup
1. Visit the app and click "Get Started"
2. Create an account (use any email/password - placeholder auth)
3. You'll be redirected to the timer page

### Creating Your First Session
1. Click "Create Session" button
2. Enter a session name (e.g., "My 3x3 Practice")
3. Select puzzle type (3x3, 2x2, etc.)
4. Click "Create"

### Using the Timer
1. Select your session from the dropdown
2. Choose puzzle type if needed
3. **Hold spacebar** to ready, **release** to start, **press** to stop
4. Your solves will be automatically saved!

### Viewing Statistics
- Navigate to the **Statistics** page
- View your progress with beautiful charts
- Track Ao5, Ao12, Ao100 averages
- Analyze time distributions

### Managing History
- Go to the **History** page
- Filter solves by session or puzzle type
- Edit times, add penalties, or delete solves
- Export your data

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Storage**: localStorage (ready for Neon DB)

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/           # Authentication pages
│   ├── (main)/           # Main app pages
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── timer/            # Timer components
│   ├── stats/            # Statistics components
│   ├── session/          # Session management
│   └── layout/           # Layout components
├── store/                # Zustand stores
├── lib/                  # Utility functions
└── types/                # TypeScript types
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on every push to main

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔮 Future Enhancements

- [ ] **Neon DB Integration** - Real database with user authentication
- [ ] **User Accounts** - Persistent data across devices
- [ ] **Competition Mode** - WCA-style timing
- [ ] **Mobile App** - React Native version
- [ ] **Social Features** - Share times, leaderboards
- [ ] **Advanced Analytics** - More detailed statistics
- [ ] **Custom Themes** - More color schemes
- [ ] **Offline Support** - PWA capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Recharts](https://recharts.org/) for data visualization
- [Zustand](https://zustand-demo.pmnd.rs/) for state management
- [Next.js](https://nextjs.org/) for the amazing framework

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Happy Cubing! 🎯**