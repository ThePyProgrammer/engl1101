import React from 'react';
import { createRoot } from 'react-dom/client';
import Article from './content/article.mdx';
import './styles.css';

createRoot(document.getElementById('root')).render(<Article />);
