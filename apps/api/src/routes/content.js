import { Router } from 'express';

const router = Router();

router.get('/home', (_req, res) => {
  res.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=600');
  res.json({
    regions: [
      { id: 'western', title: 'Western Armenia', subtitle: 'Historic provinces, cities and monuments' },
      { id: 'eastern', title: 'Eastern Armenia', subtitle: 'Regions, settlements and cultural heritage' },
    ],
    periods: [
      { id: 'ancient', title: 'Ancient', range: 'Before 301' },
      { id: 'medieval', title: 'Medieval', range: '301–1800' },
      { id: 'modern', title: '19th Century', range: '1800–1918' },
      { id: 'republic', title: '1918–1920', range: 'First Republic' },
    ],
  });
});

export default router;
