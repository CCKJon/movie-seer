# Movie Seer

A modern, dark-themed movie discovery platform that aggregates the latest movie releases across streaming platforms, theaters, and Blu-ray. Built with SvelteKit and inspired by modern streaming service designs.

## Features

### 🎬 **Home Page**
- **Featured Movie Banner**: Large hero section showcasing the latest streaming release
- **Recent Streaming Releases**: Horizontal scrollable list of latest streaming movies
- **Coming to Theaters**: Preview of upcoming theatrical releases
- **Modern Dark Theme**: Consistent with popular streaming platforms

### 📺 **Streaming Page**
- Grid layout of streaming movies with infinite scroll
- Real-time data from Rotten Tomatoes
- Hover effects and smooth animations
- Direct links to IMDb for more information

### 🎭 **Theaters Page**
- Grid layout of upcoming theatrical releases
- Infinite scroll functionality
- Real-time data from Rotten Tomatoes
- Consistent design with streaming page

### 💿 **Blu-ray Page**
- Coming soon page with feature preview
- Placeholder for future Blu-ray release data
- Consistent design language

## Design Features

### 🎨 **UI/UX Design**
- **Dark Theme**: Consistent gray-900 background with proper contrast
- **Modern Cards**: Rounded corners, hover effects, and smooth transitions
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Horizontal Scrolling**: Smooth scrollable sections for movie lists
- **Loading States**: Proper loading indicators and empty states

### 🧩 **Components**
- `MovieCard.svelte`: Reusable movie card component with hover effects
- `MovieSection.svelte`: Horizontal scrollable movie sections
- `FeaturedMovie.svelte`: Hero banner component for featured movies
- Consistent styling across all components

### 🚀 **Performance**
- Lazy loading for images
- Infinite scroll for better performance
- Optimized API responses
- TypeScript for better development experience

## Technology Stack

- **Frontend**: SvelteKit with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Flowbite Svelte
- **Data Scraping**: LinkedOM for HTML parsing
- **Data Source**: Rotten Tomatoes

## API Endpoints

- `/api/streaming` - Latest streaming movie releases
- `/api/theater` - Upcoming theatrical releases  
- `/api/bluray` - Blu-ray releases (coming soon)

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Type Checking**
   ```bash
   npm run check
   ```

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── MovieCard.svelte
│   │   ├── MovieSection.svelte
│   │   └── FeaturedMovie.svelte
│   └── images/
├── routes/
│   ├── api/
│   │   ├── streaming/+server.ts
│   │   ├── theater/+server.ts
│   │   └── bluray/+server.ts
│   ├── streaming/+page.svelte
│   ├── theater/+page.svelte
│   ├── bluray/+page.svelte
│   ├── +layout.svelte
│   └── +page.svelte
└── app.html
```

## Design Inspiration

The UI/UX design is inspired by modern streaming platforms like Netflix, with:
- Clean, dark interface
- Large movie posters and banners
- Horizontal scrolling sections
- Smooth hover animations
- Consistent typography and spacing

## Future Enhancements

- [ ] User authentication and watchlists
- [ ] Movie ratings and reviews
- [ ] Advanced filtering and search
- [ ] Blu-ray release data integration
- [ ] Mobile app development
- [ ] Social features and sharing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## License

This project is open source and available under the MIT License.
