import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: '../API/wwwroot' // when we build the client app it is gonna override the content inside the wwwwroot
  },
  server: {
    port: 3000
  },
  plugins: [react()],
})

// the api serves static content from the folder wwwroot
// we want to output our client app to that folder. To start doing that we add this build config in vite
// then go to the terminal and inside the client directory run the build