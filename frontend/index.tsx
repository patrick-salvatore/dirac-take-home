import { createRoot } from 'react-dom/client';
import App from './app';
 
import './styles/index.css';
import './styles/vendors.css';
 
const container = document.querySelector('#root')!;
const root = createRoot(container);
 
root.render(<App />);