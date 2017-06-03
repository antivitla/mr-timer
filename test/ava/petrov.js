import test from 'ava';
import Chance from 'chance';
import petrov from '../src/petrov';

const chance = new Chance();

test('exist', t => {
  t.truthy(petrov);
});

test('get account', t => {
  return petrov.get('zok')
    .then((r) => t.pass(r))
    .catch((e) => t.pass(e));
});

test('delete account', t => {
  return petrov.delete('zoooo')
    .then(r => t.pass(r))
    .catch(e => t.pass(e))
});

test('create and delete account', t => {
  return petrov.get('zakka')
    .catch(e => petrov.post('zakka', {entries: []}))
    .then(() => petrov.delete('zakka'))
    .then(r => t.pass(r));
});

test('create account and update it', t => {
  const account = 'zoooo';
  const data = {entries: [1, 2, 3]};
  return petrov
    .get(account)
    .then(() => petrov.delete(account))
    .catch(() => petrov.post(account))
    .then(() => petrov.put(account, data))
    .then(() => petrov.get(account))
    .then(res => {
      t.deepEqual(JSON.parse(res.data), data);
    })
    .then(() => petrov.delete(account))
    .catch(e => t.fail(e));
});




