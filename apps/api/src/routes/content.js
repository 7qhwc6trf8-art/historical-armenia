import { Router } from 'express';
import { z } from 'zod';
import {
  getHomeContent,
  getMap,
  getPlace,
  getTimeline,
  searchPlaces,
} from '../data/catalog.js';

const router = Router();

const searchSchema = z.object({
  q: z.string().trim().max(80).default(''),
  region: z.enum(['all', 'western', 'eastern']).default('all'),
  kind: z.enum(['all', 'province', 'city', 'monument', 'monastery']).default('all'),
  period: z.enum(['all', 'ancient', 'medieval', 'nineteenth', 'republic', 'soviet', 'modern']).default('all'),
  limit: z.coerce.number().int().min(1).max(30).default(24),
});

const mapSchema = z.object({ region: z.enum(['western', 'eastern']).default('western') });
const slugSchema = z.string().regex(/^[a-z0-9-]{1,80}$/);

router.get('/home', (_req, res) => {
  res.set('Cache-Control', 'private, max-age=120, stale-while-revalidate=600');
  res.json(getHomeContent());
});

router.get('/search', (req, res) => {
  const filters = searchSchema.parse(req.query);
  res.set('Cache-Control', 'private, max-age=60, stale-while-revalidate=180');
  res.json(searchPlaces(filters));
});

router.get('/map', (req, res) => {
  const { region } = mapSchema.parse(req.query);
  const payload = getMap(region);
  res.set('Cache-Control', 'private, max-age=120, stale-while-revalidate=600');
  res.json(payload);
});

router.get('/timeline', (_req, res) => {
  res.set('Cache-Control', 'private, max-age=120, stale-while-revalidate=600');
  res.json({ periods: getTimeline() });
});

router.get('/places/:slug', (req, res) => {
  const slug = slugSchema.parse(req.params.slug);
  const place = getPlace(slug);
  if (!place) return res.status(404).json({ error: 'PLACE_NOT_FOUND', message: 'Historical place was not found.' });
  res.set('Cache-Control', 'private, max-age=120, stale-while-revalidate=600');
  return res.json({ place });
});

export default router;
