import assert from 'node:assert/strict';
import test from 'node:test';
import { getMap, getPlace, searchPlaces } from '../src/data/catalog.js';

test('catalog returns a known place', () => {
  const place = getPlace('ani');
  assert.equal(place.title, 'Ani');
  assert.equal(place.region, 'western');
});

test('catalog search supports Armenian place names', () => {
  const payload = searchPlaces({ q: 'Տաթև' });
  assert.equal(payload.results[0].slug, 'tatev');
});

test('catalog map separates regions', () => {
  const map = getMap('eastern');
  assert.ok(map.places.length > 0);
  assert.ok(map.places.every((place) => !['van', 'ani', 'kars'].includes(place.slug)));
});
