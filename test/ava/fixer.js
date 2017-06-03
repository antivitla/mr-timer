import axios from 'axios';
import test from 'ava';

test('Currency rates', function* (t) {
  const r = yield axios.get('http://api.fixer.io/latest');
  t.truthy(r);
});
