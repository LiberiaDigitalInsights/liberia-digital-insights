import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SEO from '../SEO';

function renderAtPath(pathname) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[pathname]}>
        <SEO />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

describe('SEO component', () => {
  it('sets title and meta on home route', async () => {
    renderAtPath('/');
    expect(document.title).toBe('Home | Liberia Digital Insights');
    const metaDesc = document.querySelector('meta[name="description"]');
    expect(metaDesc).not.toBeNull();
    expect(metaDesc.getAttribute('content')).toMatch(/technology news/i);
  });

  it('sets title and meta on contact route', async () => {
    renderAtPath('/contact');
    expect(document.title).toBe('Contact Us | Liberia Digital Insights');
    const metaDesc = document.querySelector('meta[name="description"]');
    expect(metaDesc).not.toBeNull();
    expect(metaDesc.getAttribute('content')).toMatch(/get in touch/i);
  });
});
